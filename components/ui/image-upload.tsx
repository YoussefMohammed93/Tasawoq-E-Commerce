import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export function ImageUpload({ onFileSelect, className }: ImageUploadProps) {
  const [isLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={handleButtonClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        اختر صورة
      </Button>
    </div>
  );
}
