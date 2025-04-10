/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  PlusIcon,
  GripVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import LoadingSkeleton from "../../products/loading-skeleton";

interface ContactItem {
  title: string;
  description: string;
  image: Id<"_storage">;
  order: number;
}

interface SortableContactItemProps {
  item: ContactItem & { _id: string };
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (item: ContactItem & { _id: string }) => void;
}

function SortableContactItem({
  item,
  onDelete,
  onEdit,
}: SortableContactItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const imageUrl = useQuery(
    api.files.getImageUrl,
    item.image ? { storageId: item.image } : "skip"
  );

  // Debug log for image URL
  useEffect(() => {
    if (item.image) {
      console.log(`SortableContactItem image ID: ${item._id}`, {
        imageId: item.image,
        imageUrl: imageUrl,
      });
    }
  }, [item._id, item.image, imageUrl]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
    position: "relative" as const,
  };

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      // Call onEdit with the item
      onEdit(item);
      // Success will be handled in the dialog
    } catch (error) {
      console.error(`Error editing item ${item._id}:`, error);
      toast.error("حدث خطأ أثناء تحرير عنصر الاتصال");
    } finally {
      // We'll set isEditing to false when the dialog is closed
      setTimeout(() => setIsEditing(false), 500); // Short delay for better UX
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Call onDelete and wait for it to complete
      const result = await onDelete(item._id);

      // Only close dialog and show success if deletion was successful
      if (result) {
        // Success toast is shown in the onDelete function
        setShowDeleteDialog(false);
      } else {
        // If onDelete returned false, there was an issue but no exception
        toast.error("لم يتم حذف العنصر. حاول مرة أخرى");
      }
    } catch (error) {
      console.error(`Error deleting item ${item._id}:`, error);
      toast.error("حدث خطأ أثناء حذف عنصر الاتصال");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <Card className="border p-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "cursor-move shrink-0 transition-all duration-300",
                  "hover:bg-primary/10 hover:text-primary"
                )}
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <div className="flex-1 space-y-2 sm:space-y-4">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Image rendering */}
                    {typeof imageUrl === "string" && imageUrl ? (
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-xl overflow-hidden ring-2 ring-border/50 transition-all duration-300">
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover p-1 sm:p-2"
                            sizes="(max-width: 640px) 48px, 64px"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-muted/50 ring-2 ring-border/50 flex items-center justify-center">
                        <Image
                          src="/placeholder-image.png"
                          alt={item.title}
                          width={40}
                          height={40}
                          className="h-8 w-8 sm:h-10 sm:w-10 object-cover opacity-50"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base sm:text-xl tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "size-8 sm:size-9 transition-colors duration-200",
                        isEditing
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => handleEdit()}
                      disabled={isDeleting || isEditing}
                    >
                      {isEditing ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "size-8 sm:size-9 transition-colors duration-200",
                        isDeleting
                          ? "bg-destructive/20 text-destructive"
                          : "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                      )}
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                    <Separator
                      orientation="vertical"
                      className="mx-0.5 sm:mx-1 h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (isDeleting) return; // Prevent closing while deleting
          setShowDeleteDialog(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا العنصر؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف هذا العنصر نهائيًا من
              قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            {isDeleting && (
              <div className="mr-auto flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                جاري حذف العنصر...
              </div>
            )}
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحذف...
                </>
              ) : (
                "حذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ContactPage() {
  const contactBannerData = useQuery(api.contact.getContactBanner);
  const saveContactBanner = useMutation(api.contact.saveContactBanner);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteStorageId = useMutation(api.files.deleteStorageId);
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Track original values for change detection
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalContactItems, setOriginalContactItems] = useState<
    (ContactItem & { _id: string })[]
  >([]);

  // Contact items state
  const [contactItems, setContactItems] = useState<
    (ContactItem & { _id: string })[]
  >([]);

  // Debug log for contact items
  useEffect(() => {
    console.log("Current contact items:", contactItems);
  }, [contactItems]);
  const [editingItem, setEditingItem] = useState<
    (ContactItem & { _id: string }) | null
  >(null);
  const [showItemDialog, setShowItemDialog] = useState(false);

  // Form state for adding/editing contact items
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    image: null as Id<"_storage"> | null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Get image URL for the item being edited
  const itemImageUrl = useQuery(
    api.files.getImageUrl,
    itemFormData.image ? { storageId: itemFormData.image } : "skip"
  );

  // Debug log for item image URL
  useEffect(() => {
    if (itemFormData.image) {
      console.log("Item form data image:", {
        imageId: itemFormData.image,
        imageUrl: itemImageUrl,
      });
    }
  }, [itemFormData.image, itemImageUrl]);

  // Load data when available
  useEffect(() => {
    if (contactBannerData) {
      const titleValue = contactBannerData.title || "تواصل معنا";
      const descriptionValue =
        contactBannerData.description ||
        "نحن هنا لمساعدتك! راسلنا للحصول على المزيد من المعلومات حول منتجاتنا وخدماتنا.";
      const isVisibleValue = contactBannerData.isVisible ?? true;

      // Set current values
      setTitle(titleValue);
      setDescription(descriptionValue);
      setIsVisible(isVisibleValue);

      // Set original values for change detection
      setOriginalTitle(titleValue);
      setOriginalDescription(descriptionValue);

      let itemsArray: (ContactItem & { _id: string })[] = [];

      if (
        contactBannerData.contactItems &&
        contactBannerData.contactItems.length > 0
      ) {
        itemsArray = contactBannerData.contactItems.map((item, index) => ({
          ...item,
          _id: `item-${index}`,
        }));
        setContactItems(itemsArray);
        setOriginalContactItems(itemsArray);
      } else {
        // Default items if none exist
        setContactItems([]);
        setOriginalContactItems([]);
      }
    }
  }, [contactBannerData]);

  // Handle adding or editing a contact item
  const handleSaveItem = async () => {
    if (
      !itemFormData.title ||
      !itemFormData.description ||
      (!itemFormData.image && !selectedFile)
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsItemLoading(true);
      let imageStorageId = itemFormData.image;

      if (selectedFile) {
        // Delete old image if editing and a new image is selected
        if (editingItem?.image) {
          await deleteStorageId({
            storageId: editingItem.image,
          });
        }

        // Upload new image
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload image: ${result.statusText}`);
        }

        const { storageId } = await result.json();
        if (!storageId) {
          throw new Error("Failed to get storage ID from upload response");
        }

        imageStorageId = storageId;
      }

      // Log the image storage ID for debugging
      console.log("Image storage ID:", imageStorageId);

      let updatedItems: (ContactItem & { _id: string })[] = [];

      if (editingItem) {
        // Update existing item
        updatedItems = contactItems.map((item) =>
          item._id === editingItem._id
            ? {
                ...item,
                title: itemFormData.title,
                description: itemFormData.description,
                image: imageStorageId as Id<"_storage">,
              }
            : item
        );
        setContactItems(updatedItems);
      } else {
        // Add new item
        const newItem = {
          title: itemFormData.title,
          description: itemFormData.description,
          image: imageStorageId as Id<"_storage">,
          order: contactItems.length,
          _id: `item-${Date.now()}`,
        };
        updatedItems = [...contactItems, newItem];
        setContactItems(updatedItems);
      }

      // Log the updated items for debugging
      console.log("Updated contact items:", updatedItems);

      // Save to database immediately
      try {
        const itemsToSave = updatedItems.map(({ _id: _, ...item }) => item);

        // Save to database
        await saveContactBanner({
          title,
          description,
          isVisible,
          contactItems: itemsToSave,
        });

        // Successfully saved to database

        // Reset form
        setItemFormData({
          title: "",
          description: "",
          image: null,
        });
        setSelectedFile(null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        setEditingItem(null);
        setShowItemDialog(false);

        toast.success(
          editingItem
            ? "تم تحديث عنصر الاتصال بنجاح"
            : "تم إضافة عنصر الاتصال بنجاح"
        );
      } catch (saveError) {
        console.error("Failed to save to database:", saveError);
        toast.error("حدث خطأ أثناء حفظ التغييرات في قاعدة البيانات");
      }
    } catch (error) {
      console.error("Failed to save contact item:", error);
      toast.error("حدث خطأ أثناء حفظ عنصر الاتصال");
    } finally {
      setIsItemLoading(false);
    }
  };

  // Handle editing a contact item
  const handleEditItem = (item: ContactItem & { _id: string }) => {
    console.log("Editing item:", item);
    setEditingItem(item);
    setItemFormData({
      title: item.title,
      description: item.description,
      image: item.image,
    });
    setShowItemDialog(true);
  };

  // Handle deleting a contact item
  const handleDeleteItem = async (itemId: string) => {
    try {
      // Find the item to delete
      const itemToDelete = contactItems.find((item) => item._id === itemId);
      if (!itemToDelete) {
        console.error("Item not found for deletion:", itemId);
        toast.error("لم يتم العثور على العنصر للحذف");
        return false;
      }

      // Log the item being deleted for debugging
      console.log("Deleting contact item:", itemToDelete);

      // Delete the image if it exists
      if (itemToDelete.image) {
        try {
          await deleteStorageId({
            storageId: itemToDelete.image,
          });
          console.log("Successfully deleted image:", itemToDelete.image);
        } catch (imageError) {
          console.error("Failed to delete image:", imageError);
          // Continue with item deletion even if image deletion fails
        }
      }

      // Update the items list
      const updatedItems = contactItems.filter((item) => item._id !== itemId);

      // Update order of remaining items
      const reorderedItems = updatedItems.map((item, index) => ({
        ...item,
        order: index,
      }));

      setContactItems(reorderedItems);

      // Save to database immediately
      try {
        // Prepare contact items for saving (remove _id which is only for UI)
        const itemsToSave = reorderedItems.map(({ _id, ...item }) => item);

        // Save to database
        await saveContactBanner({
          title,
          description,
          isVisible,
          contactItems: itemsToSave,
        });

        // Successfully saved to database
        setOriginalContactItems(reorderedItems);

        toast.success("تم حذف عنصر الاتصال بنجاح");
      } catch (saveError) {
        console.error("Failed to save to database after deletion:", saveError);
        toast.error("تم حذف العنصر محليًا ولكن حدث خطأ أثناء حفظ التغييرات");
      }

      return true; // Return success for the calling function
    } catch (error) {
      console.error("Failed to delete contact item:", error);
      toast.error("حدث خطأ أثناء حذف عنصر الاتصال");
      throw error;
    }
  };

  // Check if there are changes to save
  const hasChanges = () => {
    if (activeTab === "general") {
      return (
        title.trim() !== originalTitle.trim() ||
        description.trim() !== originalDescription.trim()
      );
    }

    if (activeTab === "items") {
      if (contactItems.length !== originalContactItems.length) return true;

      return contactItems.some((item, index) => {
        const originalItem = originalContactItems[index];
        return (
          !originalItem ||
          item._id !== originalItem._id ||
          item.order !== originalItem.order
        );
      });
    }

    return false;
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!hasChanges()) return;

    setIsLoading(true);
    try {
      if (activeTab === "general") {
        const itemsToSave = contactItems.map(({ _id, ...item }) => item);

        await saveContactBanner({
          title,
          description,
          isVisible,
          contactItems: itemsToSave,
        });

        // Update original values
        setOriginalTitle(title);
        setOriginalDescription(description);

        toast.success("تم حفظ المعلومات العامة بنجاح");
      } else if (activeTab === "items") {
        const itemsToSave = contactItems.map(({ _id, ...item }) => item);

        await saveContactBanner({
          title,
          description,
          isVisible,
          contactItems: itemsToSave,
        });

        // Update original values
        setOriginalContactItems([...contactItems]);

        toast.success("تم حفظ ترتيب عناصر الاتصال بنجاح");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = contactItems.findIndex((item) => item._id === active.id);
      const newIndex = contactItems.findIndex((item) => item._id === over.id);

      const newItems = [...contactItems];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      // Update order property
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));

      setContactItems(reorderedItems);

      // Save to database immediately
      try {
        // Prepare contact items for saving (remove _id which is only for UI)
        const itemsToSave = reorderedItems.map(({ _id, ...item }) => item);

        // Save to database
        await saveContactBanner({
          title,
          description,
          isVisible,
          contactItems: itemsToSave,
        });

        // Successfully saved to database
        setOriginalContactItems(reorderedItems);

        // Add success toast
        toast.success("تم إعادة ترتيب العناصر بنجاح");
      } catch (saveError) {
        console.error("Failed to save reordering to database:", saveError);
        toast.error("حدث خطأ أثناء حفظ ترتيب العناصر");
      }
    }
  };

  // Reset item form when dialog is closed
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingItem(null);
      setItemFormData({
        title: "",
        description: "",
        image: null,
      });
      setSelectedFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
    setShowItemDialog(open);
  };

  // Show loading skeleton while data is being fetched
  if (contactBannerData === undefined) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading
            title="تحرير قسم تواصل معنا"
            description="قم بإدارة وتعديل قسم تواصل معنا في متجرك الإلكتروني."
          />
          <div className="flex items-center gap-4">
            <Button
              variant={isVisible ? "default" : "outline"}
              onClick={async () => {
                setIsVisible(!isVisible);

                // Save visibility change immediately
                try {
                  setIsLoading(true);
                  const itemsToSave = contactItems.map(
                    ({ _id, ...item }) => item
                  );

                  await saveContactBanner({
                    title,
                    description,
                    isVisible: !isVisible, // Use the new value
                    contactItems: itemsToSave,
                  });

                  // Successfully saved to database

                  toast.success("تم تغيير حالة الظهور بنجاح");
                } catch (error) {
                  console.error("Failed to save visibility change:", error);
                  toast.error("حدث خطأ أثناء حفظ تغيير حالة الظهور");
                  // Revert the UI change if save failed
                  setIsVisible(isVisible);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : isVisible ? (
                <>
                  <EyeIcon className="h-4 w-4" />
                  ظاهر
                </>
              ) : (
                <>
                  <EyeOffIcon className="h-4 w-4" />
                  مخفي
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        dir="rtl"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">المعلومات العامة</TabsTrigger>
          <TabsTrigger value="items">عناصر الاتصال</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>العنوان والوصف</CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium block">
                  العنوان
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان قسم التواصل"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium block"
                >
                  الوصف
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصف قسم التواصل"
                  rows={3}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSaveChanges}
                  disabled={isLoading || !hasChanges()}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
              <div>
                <h3 className="text-lg font-semibold">عناصر الاتصال</h3>
                <p className="text-sm text-muted-foreground">
                  أضف وعدل عناصر الاتصال التي ستظهر في القسم
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setItemFormData({
                    title: "",
                    description: "",
                    image: null,
                  });
                  setShowItemDialog(true);
                }}
                className="gap-2 w-full sm:w-auto"
                variant="outline"
              >
                <PlusIcon className="h-4 w-4" />
                إضافة عنصر جديد
              </Button>
            </CardHeader>
            <CardContent>
              {contactItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                      <rect width="18" height="12" x="3" y="4" rx="2" />
                      <circle cx="12" cy="10" r="2" />
                      <line x1="8" x2="8" y1="2" y2="4" />
                      <line x1="16" x2="16" y1="2" y2="4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    لا توجد عناصر اتصال
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ابدأ بإضافة عناصر اتصال جديدة لقسم التواصل
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={contactItems.map((item) => item._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {contactItems.map((item) => (
                        <SortableContactItem
                          key={item._id}
                          item={item}
                          onDelete={handleDeleteItem}
                          onEdit={handleEditItem}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for adding/editing contact items */}
      <Dialog
        open={showItemDialog}
        onOpenChange={(open) => {
          if (isItemLoading) return; // Prevent closing while loading
          handleDialogClose(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "تعديل عنصر اتصال" : "إضافة عنصر اتصال جديد"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveItem();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">العنوان</label>
              <Input
                value={itemFormData.title}
                onChange={(e) =>
                  setItemFormData({ ...itemFormData, title: e.target.value })
                }
                placeholder="مثال: اتصل بنا"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف</label>
              <Input
                value={itemFormData.description}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    description: e.target.value,
                  })
                }
                placeholder="مثال: نستجيب لرسائلك خلال 24 ساعة."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الصورة</label>
              {/* Image URL debugging handled in useEffect */}

              {(imagePreview || itemFormData.image) && (
                <div className="relative mb-4">
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-muted/50 ring-2 ring-border/50 flex items-center justify-center relative">
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={
                          imagePreview ||
                          (typeof itemImageUrl === "string" && itemImageUrl
                            ? itemImageUrl
                            : "/placeholder-image.png")
                        }
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 size-8 rounded-full"
                    onClick={() => {
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                      }
                      setSelectedFile(null);
                      setItemFormData({ ...itemFormData, image: null });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!imagePreview && !itemFormData.image && (
                <ImageUpload
                  onFileSelect={(file: File) => {
                    const previewUrl = URL.createObjectURL(file);
                    setImagePreview(previewUrl);
                    setSelectedFile(file);
                  }}
                  className="w-full h-[96px]"
                />
              )}
            </div>
            <div className="flex items-center justify-between mt-6">
              {isItemLoading && (
                <div className="text-sm text-muted-foreground">
                  {editingItem
                    ? "جاري تحديث العنصر..."
                    : "جاري إضافة العنصر..."}
                </div>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  disabled={isItemLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isItemLoading ||
                    !itemFormData.title ||
                    !itemFormData.description ||
                    (!itemFormData.image && !selectedFile)
                  }
                  className={isItemLoading ? "bg-primary/80" : ""}
                >
                  {isItemLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      {editingItem ? "تحديث..." : "إضافة..."}
                    </>
                  ) : editingItem ? (
                    "تحديث"
                  ) : (
                    "إضافة"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
