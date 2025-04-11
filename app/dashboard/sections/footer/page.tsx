"use client";

import {
  Save,
  Loader2,
  Plus,
  Eye,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useQuery, useMutation } from "convex/react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SocialLinkItem } from "./components/social-link-item";
import { FooterSectionItem } from "./components/footer-section-item";

interface SocialLink {
  name: string;
  image: Id<"_storage"> | string | null;
  url: string;
  order: number;
  _previewImage?: string; // For UI preview only
  _pendingDelete?: boolean; // For UI indication only
}

interface FooterLink {
  label: string;
  href: string;
  order: number;
  image?: Id<"_storage"> | string | null;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  order: number;
}

interface FormData {
  storeName: string;
  description: string;
  socialLinks: SocialLink[];
  footerLinks: FooterSection[];
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-full sm:w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="inline-flex h-auto items-center justify-start rounded-lg bg-muted px-0.5 py-1 text-muted-foreground w-full md:w-fit">
            <div className="w-full flex items-center justify-between gap-1 p-1">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FooterDashboard() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    storeName: "",
    description: "",
    socialLinks: [],
    footerLinks: [],
  });

  // Track original values for comparison
  const [originalData, setOriginalData] = useState<FormData>({
    storeName: "",
    description: "",
    socialLinks: [],
    footerLinks: [],
  });

  // Track pending changes
  const [pendingImageChanges, setPendingImageChanges] = useState<
    { index: number; file: File }[]
  >([]);

  // Track if general section has changes
  const hasGeneralChanges =
    formData.storeName !== originalData.storeName ||
    formData.description !== originalData.description;

  // Check if footer section titles or links have changed
  const hasFooterSectionChanges = formData.footerLinks.some(
    (section, index) => {
      // Check if section title has changed
      if (section.title !== (originalData.footerLinks[index]?.title || "")) {
        return true;
      }

      // Check if links have changed
      if (
        section.links.length !==
        (originalData.footerLinks[index]?.links.length || 0)
      ) {
        return true;
      }

      // Check if any link content has changed
      return section.links.some((link, linkIndex) => {
        const originalLink = originalData.footerLinks[index]?.links[linkIndex];
        if (!originalLink) return true;

        return (
          link.label !== originalLink.label || link.href !== originalLink.href
        );
      });
    }
  );

  // Check if social links have changed
  const hasSocialLinksChanges =
    formData.socialLinks.length !== originalData.socialLinks.length ||
    formData.socialLinks.some((link, index) => {
      const originalLink = originalData.socialLinks[index];
      if (!originalLink) return true;

      return link.name !== originalLink.name || link.url !== originalLink.url;
    });

  // Track if any section has changes
  const hasAnyChanges =
    hasGeneralChanges ||
    pendingImageChanges.length > 0 ||
    hasFooterSectionChanges ||
    hasSocialLinksChanges;

  // We'll use hasAnyChanges to control the save button

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch data from Convex
  const footerData = useQuery(api.footer.getFooter);
  const saveFooter = useMutation(api.footer.saveFooter);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Load data when available
  useEffect(() => {
    if (footerData) {
      const initialData = {
        storeName: footerData.storeName || "",
        description: footerData.description || "",
        socialLinks: footerData.socialLinks || [],
        footerLinks: footerData.footerLinks || [],
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [footerData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Process pending image changes first
      let updatedSocialLinks = [...formData.socialLinks];

      // Handle image uploads
      if (pendingImageChanges.length > 0) {
        for (const { index, file } of pendingImageChanges) {
          const uploadUrl = await generateUploadUrl();
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await result.json();

          // Update the link with the actual storage ID
          updatedSocialLinks[index] = {
            ...updatedSocialLinks[index],
            image: storageId,
          };

          // Remove temporary preview field
          delete updatedSocialLinks[index]._previewImage;
        }
      }

      // No need to handle deletions here as they're handled immediately in the UI

      // Update order after deletions
      updatedSocialLinks = updatedSocialLinks.map((link, index) => ({
        ...link,
        order: index,
      }));

      // Save all changes to the database
      await saveFooter({
        storeName: formData.storeName,
        description: formData.description,
        socialLinks: updatedSocialLinks,
        footerLinks: formData.footerLinks.map((section, index) => ({
          ...section,
          order: index,
          links: section.links.map((link, linkIndex) => {
            // Create a new object without the image property if it's null
            const { image, ...rest } = link;
            const linkData: {
              label: string;
              href: string;
              order: number;
              image?: Id<"_storage">;
            } = {
              ...rest,
              order: linkIndex,
            };

            // Only add the image property if it exists and is a valid storage ID
            if (image && typeof image === "string" && image.startsWith(":")) {
              linkData.image = image as Id<"_storage">;
            }

            return linkData;
          }),
        })),
      });

      // Update the form data with the processed changes
      setFormData({
        ...formData,
        socialLinks: updatedSocialLinks,
      });

      // Update original data to match current state
      setOriginalData({
        storeName: formData.storeName,
        description: formData.description,
        socialLinks: updatedSocialLinks,
        footerLinks: formData.footerLinks,
      });

      // Clear pending changes
      setPendingImageChanges([]);

      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("Error saving footer:", error);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Handle social links drag and drop
      if (active.id.toString().startsWith("social-")) {
        const oldIndex = formData.socialLinks.findIndex(
          (item) => `social-${item.order}` === active.id
        );
        const newIndex = formData.socialLinks.findIndex(
          (item) => `social-${item.order}` === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newSocialLinks = arrayMove(
            formData.socialLinks,
            oldIndex,
            newIndex
          ).map((link, index) => ({
            ...link,
            order: index,
          }));

          setFormData({
            ...formData,
            socialLinks: newSocialLinks,
          });

          // Save the reordering directly to the database
          try {
            setLoading(true);
            await saveFooter({
              storeName: formData.storeName,
              description: formData.description,
              socialLinks: newSocialLinks.map((link, index) => ({
                name: link.name,
                image: link.image,
                url: link.url,
                order: index,
              })),
              footerLinks: formData.footerLinks.map(
                (section, sectionIndex) => ({
                  title: section.title,
                  order: sectionIndex,
                  links: section.links.map((link, linkIndex) => {
                    const { image, ...rest } = link;
                    const linkData: {
                      label: string;
                      href: string;
                      order: number;
                      image?: Id<"_storage">;
                    } = {
                      ...rest,
                      order: linkIndex,
                    };
                    if (
                      image &&
                      typeof image === "string" &&
                      image.startsWith(":")
                    ) {
                      linkData.image = image as Id<"_storage">;
                    }
                    return linkData;
                  }),
                })
              ),
            });
            // Update original data
            setOriginalData({
              ...originalData,
              socialLinks: newSocialLinks,
            });
            toast.success("تم إعادة ترتيب روابط التواصل بنجاح");
          } catch (error) {
            console.error("Error saving social links reordering:", error);
            toast.error("حدث خطأ أثناء حفظ الترتيب الجديد");
          } finally {
            setLoading(false);
          }
        }
      }

      // Handle links within sections drag and drop
      if (active.id.toString().includes("link-")) {
        // Extract section and link indices from the ID format "link-sectionIndex-linkIndex"
        const idParts = active.id.toString().split("-");
        if (idParts.length === 3) {
          const sectionIndex = parseInt(idParts[1]);
          const linkIndex = parseInt(idParts[2]);
          const section = formData.footerLinks[sectionIndex];

          if (section) {
            const overIdParts = over.id.toString().split("-");
            if (overIdParts.length === 3) {
              const overSectionIndex = parseInt(overIdParts[1]);
              const overLinkIndex = parseInt(overIdParts[2]);

              // Only handle if in the same section
              if (sectionIndex === overSectionIndex) {
                const newLinks = arrayMove(
                  section.links,
                  linkIndex,
                  overLinkIndex
                ).map((link, index) => ({
                  ...link,
                  order: index,
                }));

                const newFooterLinks = [...formData.footerLinks];
                newFooterLinks[sectionIndex] = {
                  ...section,
                  links: newLinks,
                };

                setFormData({
                  ...formData,
                  footerLinks: newFooterLinks,
                });

                // Save the reordering directly to the database
                try {
                  setLoading(true);
                  await saveFooter({
                    storeName: formData.storeName,
                    description: formData.description,
                    socialLinks: formData.socialLinks.map((link, index) => ({
                      name: link.name,
                      image: link.image,
                      url: link.url,
                      order: index,
                    })),
                    footerLinks: newFooterLinks.map((section, index) => ({
                      title: section.title,
                      order: index,
                      links: section.links.map((link, linkIndex) => {
                        const { image, ...rest } = link;
                        const linkData: {
                          label: string;
                          href: string;
                          order: number;
                          image?: Id<"_storage">;
                        } = {
                          ...rest,
                          order: linkIndex,
                        };
                        if (
                          image &&
                          typeof image === "string" &&
                          image.startsWith(":")
                        ) {
                          linkData.image = image as Id<"_storage">;
                        }
                        return linkData;
                      }),
                    })),
                  });
                  // Update original data
                  setOriginalData({
                    ...originalData,
                    footerLinks: newFooterLinks,
                  });
                  toast.success("تم إعادة ترتيب الروابط بنجاح");
                } catch (error) {
                  console.error("Error saving footer links reordering:", error);
                  toast.error("حدث خطأ أثناء حفظ الترتيب الجديد");
                } finally {
                  setLoading(false);
                }
              }
            }
          }
        }
      }
    }
  };

  const handleAddSocialLink = async (image: File, index?: number) => {
    try {
      // If index is provided, store the pending image change
      if (typeof index === "number") {
        // Create a temporary preview URL for the image
        const previewUrl = URL.createObjectURL(image);

        // Add to pending changes
        setPendingImageChanges((prev) => [
          ...prev.filter((item) => item.index !== index), // Remove any existing pending change for this index
          { index, file: image },
        ]);

        // Update the UI with the preview image
        const newSocialLinks = [...formData.socialLinks];
        newSocialLinks[index] = {
          ...newSocialLinks[index],
          // We're not changing the actual image yet, just showing a preview
          _previewImage: previewUrl, // This is a temporary field for UI only
        };
        setFormData({ ...formData, socialLinks: newSocialLinks });
      } else {
        // This is for adding a new social link
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        const { storageId } = await result.json();

        // Show a dialog with the image preview
        const name = prompt("أدخل اسم الرابط", "رابط جديد");
        if (!name) return; // User cancelled

        const url = prompt("أدخل رابط الموقع", "https://");
        if (!url) return; // User cancelled

        const newSocialLinks = [
          ...formData.socialLinks,
          {
            name,
            image: storageId,
            url,
            order: formData.socialLinks.length,
          },
        ];
        setFormData({ ...formData, socialLinks: newSocialLinks });
        setOriginalData({
          ...originalData,
          socialLinks: newSocialLinks,
        });
      }
    } catch (error) {
      console.error("Error adding social link:", error);
      toast.error("حدث خطأ أثناء إضافة الرابط");
    }
  };

  const handleUpdateSocialLink = (
    index: number,
    data: { name: string; url: string }
  ) => {
    const newSocialLinks = [...formData.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], ...data };
    setFormData({ ...formData, socialLinks: newSocialLinks });
  };

  const handleDeleteSocialLink = (index: number) => {
    // Remove the link from the UI immediately
    const newSocialLinks = formData.socialLinks.filter((_, i) => i !== index);

    // Update the form data
    setFormData({ ...formData, socialLinks: newSocialLinks });

    // Don't save to the database yet - let the user click the save button
  };

  // This function is no longer used as we're getting icons from the API

  // Function to add a new empty social link
  function handleAddNewSocialLink() {
    const newSocialLinks = [
      ...formData.socialLinks,
      {
        name: "",
        image: null, // Use null instead of empty string
        url: "",
        order: formData.socialLinks.length,
      },
    ];
    setFormData({ ...formData, socialLinks: newSocialLinks });

    // Debug log
    console.log("Added new social link", newSocialLinks);
  }

  const handleAddFooterSection = () => {
    const newFooterLinks = [
      ...formData.footerLinks,
      {
        title: "قسم جديد",
        links: [],
        order: formData.footerLinks.length,
      },
    ];
    setFormData({ ...formData, footerLinks: newFooterLinks });
  };

  const handleUpdateFooterSection = async (
    index: number,
    data: {
      title: string;
      links: FooterLink[];
      _isReordering?: boolean;
    }
  ) => {
    const newFooterLinks = [...formData.footerLinks];
    newFooterLinks[index] = { ...newFooterLinks[index], ...data };
    setFormData({ ...formData, footerLinks: newFooterLinks });

    // Check if this is a reordering change that should be saved directly to the database
    // Only reordering should be saved directly, other changes require the save button

    // Log the data for debugging
    console.log("handleUpdateFooterSection called:", {
      index,
      dataLinks: data.links.map((l) => ({ label: l.label, order: l.order })),
      originalLinks:
        formData.footerLinks[index]?.links.map((l) => ({
          label: l.label,
          order: l.order,
        })) || [],
    });

    // Use the special flag to detect reordering
    const isReorderingChange = data._isReordering === true;

    // Log the flag
    console.log("Special reordering flag:", data._isReordering);

    console.log("isReorderingChange:", isReorderingChange);

    if (isReorderingChange) {
      try {
        setLoading(true);
        await saveFooter({
          storeName: formData.storeName,
          description: formData.description,
          socialLinks: formData.socialLinks.map((link, i) => ({
            name: link.name,
            image: link.image,
            url: link.url,
            order: i,
          })),
          footerLinks: newFooterLinks.map((section, i) => ({
            title: section.title,
            order: i,
            links: section.links.map((link, linkIndex) => {
              const { image, ...rest } = link;
              const linkData: {
                label: string;
                href: string;
                order: number;
                image?: Id<"_storage">;
              } = {
                ...rest,
                order: linkIndex,
              };
              if (image && typeof image === "string" && image.startsWith(":")) {
                linkData.image = image as Id<"_storage">;
              }
              return linkData;
            }),
          })),
        });

        // Update original data
        setOriginalData({
          ...originalData,
          footerLinks: newFooterLinks,
        });

        // Show toast notification for successful reordering
        toast.success("تم إعادة ترتيب الروابط بنجاح");
      } catch (error) {
        console.error("Error saving footer section update:", error);
        toast.error("حدث خطأ أثناء حفظ التغييرات");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteFooterSection = (index: number) => {
    const newFooterLinks = formData.footerLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, footerLinks: newFooterLinks });
  };

  const handleAddLink = (sectionIndex: number) => {
    const newFooterLinks = [...formData.footerLinks];
    const section = newFooterLinks[sectionIndex];

    if (section) {
      section.links = [
        ...section.links,
        {
          label: "",
          href: "",
          order: section.links.length,
        },
      ];
      setFormData({ ...formData, footerLinks: newFooterLinks });
    }
  };

  const handleDeleteLink = (sectionIndex: number, linkIndex: number) => {
    const newFooterLinks = [...formData.footerLinks];
    const section = newFooterLinks[sectionIndex];

    if (section) {
      // We're removing a link, which should enable the save button

      // Remove the link
      section.links = section.links.filter((_, idx) => idx !== linkIndex);

      // Update order for remaining links
      section.links.forEach((link, idx) => {
        link.order = idx;
      });

      // Update the form data
      setFormData({ ...formData, footerLinks: newFooterLinks });

      // Don't save directly - let the user click the save button
      // This will enable the save button since we've modified the links
    }
  };

  // If data is loading, show skeleton
  if (!footerData) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading
            title="تخصيص الفوتر"
            description="قم بتخصيص محتوى وروابط الفوتر"
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto gap-2"
              onClick={() => {
                const previewWindow = window.open("/", "_blank");
                if (previewWindow) {
                  previewWindow.postMessage(
                    { type: "PREVIEW_DATA", data: formData },
                    "*"
                  );
                }
              }}
            >
              <Eye className="h-4 w-4" />
              معاينة
            </Button>
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto gap-2"
              disabled={loading || !hasAnyChanges}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="general" className="w-full sm:w-auto">
            عام
          </TabsTrigger>
          <TabsTrigger value="social" className="w-full sm:w-auto relative">
            روابط التواصل
          </TabsTrigger>
          <TabsTrigger value="links" className="w-full sm:w-auto relative">
            روابط الفوتر
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6 border">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:align-baseline justify-between">
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <Save className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">الإعدادات العامة</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">
                      اسم المتجر
                    </label>
                    <Input
                      value={formData.storeName}
                      onChange={(e) =>
                        setFormData({ ...formData, storeName: e.target.value })
                      }
                      placeholder="أدخل اسم المتجر"
                    />
                    <p className="text-xs text-muted-foreground">
                      سيظهر اسم المتجر في الفوتر وحقوق النشر
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">
                      وصف المتجر
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="أدخل وصف المتجر"
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      سيظهر وصف المتجر في الفوتر أسفل اسم المتجر
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card className="p-6 border">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:align-baseline justify-between">
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    روابط التواصل الاجتماعي
                  </h2>
                  <Badge variant="outline" className="ml-2">
                    {formData.socialLinks.length} روابط
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto hover:bg-primary/5 mt-5 sm:mt-0"
                  onClick={handleAddNewSocialLink}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة رابط
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[]}
              >
                <SortableContext
                  items={formData.socialLinks.map(
                    (link) => `social-${link.order}`
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {formData.socialLinks.map((link, index) => (
                      <SocialLinkItem
                        key={link.order}
                        link={link}
                        index={index}
                        onUpdate={handleUpdateSocialLink}
                        onImageUpdate={(index, file) =>
                          handleAddSocialLink(file, index)
                        }
                        onDelete={() => handleDeleteSocialLink(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {formData.socialLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد روابط تواصل اجتماعي حاليا</p>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={handleAddNewSocialLink}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      إضافة رابط جديد
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card className="p-6 border">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:align-baseline justify-between">
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">أقسام روابط الفوتر</h2>
                  <Badge variant="outline" className="ml-2">
                    {formData.footerLinks.length} أقسام
                  </Badge>
                </div>
                <Button
                  onClick={handleAddFooterSection}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto hover:bg-primary/5 mt-5 sm:mt-0"
                >
                  <Plus className="h-4 w-4" />
                  إضافة قسم جديد
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={async (event) => {
                  const { active, over } = event;
                  if (over && active.id !== over.id) {
                    // Extract section indices from the ID format "section-index"
                    const oldIndex = parseInt(
                      active.id.toString().split("-")[1]
                    );
                    const newIndex = parseInt(over.id.toString().split("-")[1]);

                    // Reorder the sections
                    const newFooterLinks = arrayMove(
                      formData.footerLinks,
                      oldIndex,
                      newIndex
                    ).map((section, index) => ({
                      ...section,
                      order: index,
                    }));

                    // Add a special flag to indicate this is a reordering operation
                    const dataWithFlag = {
                      ...formData,
                      footerLinks: newFooterLinks.map((section) => ({
                        ...section,
                        _isReordering: true, // Special flag
                      })),
                    };

                    // Update the UI
                    setFormData(dataWithFlag);

                    // Save directly to the database
                    try {
                      setLoading(true);
                      await saveFooter({
                        storeName: formData.storeName,
                        description: formData.description,
                        socialLinks: formData.socialLinks.map((link, i) => ({
                          name: link.name,
                          image: link.image,
                          url: link.url,
                          order: i,
                        })),
                        footerLinks: newFooterLinks.map((section, i) => ({
                          title: section.title,
                          order: i,
                          links: section.links.map((link, linkIndex) => {
                            const { image, ...rest } = link;
                            const linkData: {
                              label: string;
                              href: string;
                              order: number;
                              image?: Id<"_storage">;
                            } = {
                              ...rest,
                              order: linkIndex,
                            };
                            if (
                              image &&
                              typeof image === "string" &&
                              image.startsWith(":")
                            ) {
                              linkData.image = image as Id<"_storage">;
                            }
                            return linkData;
                          }),
                        })),
                      });

                      // Update original data
                      setOriginalData({
                        ...originalData,
                        footerLinks: newFooterLinks,
                      });

                      toast.success("تم إعادة ترتيب الأقسام بنجاح");
                    } catch (error) {
                      console.error(
                        "Error saving footer sections reordering:",
                        error
                      );
                      toast.error("حدث خطأ أثناء حفظ الترتيب الجديد");
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
              >
                <SortableContext
                  items={formData.footerLinks.map(
                    (_, index) => `section-${index}`
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {formData.footerLinks.map((section, index) => (
                      <FooterSectionItem
                        key={`section-${index}`}
                        section={section}
                        index={index}
                        onUpdate={handleUpdateFooterSection}
                        onDeleteSection={() => handleDeleteFooterSection(index)}
                        onAddLink={handleAddLink}
                        onDeleteLink={handleDeleteLink}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {formData.footerLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد أقسام روابط حاليا</p>
                  <Button
                    variant="link"
                    onClick={handleAddFooterSection}
                    className="mt-2 text-primary hover:text-primary/80"
                  >
                    إضافة قسم جديد
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
