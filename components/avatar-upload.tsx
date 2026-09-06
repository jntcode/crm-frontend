"use client";

import { useRef, useState } from "react";

const AVATAR_KEY = "crm-avatar";

const sizeMap = {
  sm: 40,
  md: 64,
  lg: 96,
};

export function getAvatar(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AVATAR_KEY);
}

function getInitial(name: string): string {
  return name?.charAt(0)?.toUpperCase() ?? "?";
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, 128, 128);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

interface AvatarUploadProps {
  name?: string;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({ name = "?", size = "md" }: AvatarUploadProps) {
  const [src, setSrc] = useState<string | null>(() => getAvatar());
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      localStorage.setItem(AVATAR_KEY, dataUrl);
      setSrc(dataUrl);
    } catch {
      // silently ignore bad files
    }
  }

  const px = sizeMap[size];
  const fontSize = size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-3xl";

  return (
    <div
      className="relative group cursor-pointer"
      style={{ width: px, height: px }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {src ? (
        <img
          src={src}
          alt="Avatar"
          className="w-full h-full rounded-full border-2 border-[var(--border)] object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full border-2 border-[var(--border)] bg-[var(--soft)] flex items-center justify-center">
          <span className={`${fontSize} font-semibold text-[var(--accent)]`}>
            {getInitial(name)}
          </span>
        </div>
      )}

      {hovering && (
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
