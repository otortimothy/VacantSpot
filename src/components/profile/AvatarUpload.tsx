"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadComplete: (url: string) => void;
}

const AvatarUpload = ({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setPreviewUrl(data.publicUrl);
      onUploadComplete(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary shadow-xl bg-muted group">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl bg-primary/10 text-primary font-bold">
            {userId.slice(0, 2).toUpperCase()}
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
            Uploading...
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <button
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Change Profile Picture"}
        </button>
      </div>
    </div>
  );
};

export default AvatarUpload;
