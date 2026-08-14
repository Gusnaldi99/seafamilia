"use client";

import { useState, ImgHTMLAttributes } from "react";

export function ImageSlot({ src, alt, className = "img-slot h-full w-full object-cover", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [error, setError] = useState(!src);
  
  if (error) return null;
  
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
      {...props}
    />
  );
}
