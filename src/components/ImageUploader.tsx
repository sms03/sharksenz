
import { useState, useRef, DragEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Upload, ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  userId: string;
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

const ImageUploader = ({ userId, onImageUploaded, currentImageUrl }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the file
      const { data } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />
      
      {currentImageUrl ? (
        <div className="mb-4 flex justify-center">
          <img 
            src={currentImageUrl} 
            alt="Current profile" 
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
      ) : (
        <ImagePlus className="h-12 w-12 mx-auto mb-2 text-gray-400" />
      )}
      
      <p className="text-sm text-gray-600 mb-2">
        {isUploading ? "Uploading..." : "Drag and drop your profile image here"}
      </p>
      <p className="text-xs text-gray-500 mb-3">or</p>
      <Button 
        variant="outline" 
        type="button"
        disabled={isUploading}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <Upload className="h-4 w-4 mr-2" />
        Browse Files
      </Button>
    </div>
  );
};

export default ImageUploader;
