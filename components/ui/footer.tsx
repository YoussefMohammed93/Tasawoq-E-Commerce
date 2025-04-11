"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { useMemo } from "react";

export function Footer() {
  // Always fetch the footer data
  const footerData = useQuery(api.footer.getFooter);

  // Extract storage IDs for social links - this is safe because we're not using hooks inside
  const storageIds = useMemo(() => {
    if (!footerData?.socialLinks?.length) return [] as Id<"_storage">[];

    return footerData.socialLinks
      .filter(
        (link) =>
          link.image &&
          typeof link.image === "string" &&
          // Check for both formats: with or without ':' prefix
          (link.image.startsWith(":") ||
            (!link.image.startsWith("http") &&
              !link.image.startsWith("./") &&
              !link.image.startsWith("/")))
      )
      .map((link) => {
        // If it already has the ':' prefix, use it as is
        // Otherwise, treat it as a storage ID
        const imageId = link.image as string;
        return imageId.startsWith(":")
          ? (imageId as Id<"_storage">)
          : (imageId as Id<"_storage">);
      });
  }, [footerData?.socialLinks]);

  // Always call useQuery hook, but with "skip" if no IDs
  const socialImageUrls = useQuery(
    api.files.getMultipleImageUrls,
    storageIds.length > 0 ? { storageIds } : "skip"
  );

  // All hooks must be called before any conditional returns
  // Create a mapping of storage IDs to their URLs
  const imageUrlMap = useMemo(() => {
    const map: Record<string, string | null> = {};

    if (footerData?.socialLinks && socialImageUrls) {
      storageIds.forEach((storageId, index) => {
        // Store the URL with the storage ID as key
        map[storageId] = socialImageUrls[index] || null;

        // Also store with the raw ID (without ':' prefix) if it has one
        if (typeof storageId === "string" && storageId.startsWith(":")) {
          const rawId = storageId.substring(1);
          map[rawId] = socialImageUrls[index] || null;
        }
      });
    }

    return map;
  }, [footerData?.socialLinks, socialImageUrls, storageIds]);

  // Map social links with their image URLs
  const socialLinksWithImages = useMemo(() => {
    if (!footerData?.socialLinks?.length) return [];

    return footerData.socialLinks.map((link) => {
      let imageUrl = null;

      // Check if image is a valid storage ID
      if (link.image && typeof link.image === "string") {
        if (link.image.startsWith(":")) {
          // Use the image URL from our map
          imageUrl = imageUrlMap[link.image] || null;
        } else if (link.image.startsWith("http")) {
          // It's already a URL
          imageUrl = link.image;
        } else if (link.image.startsWith("./") || link.image.startsWith("/")) {
          // It's a relative path
          imageUrl = link.image.startsWith("./")
            ? link.image.replace("./", "/")
            : link.image;
        } else {
          // Treat as a storage ID without ':' prefix
          imageUrl = imageUrlMap[link.image] || null;

          // If not found in the map, it might be a direct storage ID
          if (!imageUrl && link.image) {
            // Try to use it directly as a storage ID
            const directStorageId = link.image as Id<"_storage">;
            imageUrl = imageUrlMap[directStorageId] || null;
          }
        }
      }

      return {
        ...link,
        imageUrl,
      };
    });
  }, [footerData?.socialLinks, imageUrlMap]);

  // Loading state or no footer data
  if (footerData === undefined) {
    return <FooterSkeleton />;
  }

  // Check if social links exist and are not empty
  const hasSocialLinks =
    footerData.socialLinks && footerData.socialLinks.length > 0;

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-5 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 relative">
              <span className="text-2xl font-bold text-primary">
                {footerData.storeName}
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm md:max-w-xs">
              {footerData.description}
            </p>
            {/* Only show social links if they exist */}
            {hasSocialLinks && (
              <div className="flex items-center gap-4 mt-6">
                {socialLinksWithImages
                  .sort((a, b) => a.order - b.order)
                  .map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {social.imageUrl ? (
                        <Image
                          src={social.imageUrl}
                          alt={social.name}
                          width={20}
                          height={20}
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <div className="h-5 w-5 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs">
                            {social.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="sr-only">{social.name}</span>
                    </a>
                  ))}
              </div>
            )}
          </div>
          {/* Only show footer links if they exist */}
          {footerData.footerLinks &&
            footerData.footerLinks.length > 0 &&
            footerData.footerLinks
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links
                      .sort((a, b) => a.order - b.order)
                      .map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()}{" "}
            {footerData.storeName}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Skeleton loader for the footer
function FooterSkeleton() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-5 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-4 h-20 w-full md:w-80" />
          </div>
          {[1, 2].map((section) => (
            <div key={section}>
              <Skeleton className="h-6 w-24 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((link) => (
                  <Skeleton key={link} className="h-4 w-32" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </footer>
  );
}
