// Image compression for Vercel storage - compress to data URL
export interface CompressedImage {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  type: string;
}

/**
 * Compress image file to data URL
 * @param file - original file from device
 * @param maxWidth - max width (default 1024)
 * @param quality - 0-1 (default 0.72)
 */
export const compressImage = (file: File, maxWidth = 1024, quality = 0.72): Promise<CompressedImage> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف ليس صورة'));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error('الصورة كبيرة جداً — الحد 15MB'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة الصورة'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('صورة غير صالحة'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        // Also limit height
        const maxHeight = 1024;
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل الضغط'));
          return;
        }
        // White background for transparent PNGs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed data URL (webp if supported, else jpeg)
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          // Fallback if webp not supported (dataUrl will be png)
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const compressedSize = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize,
          width,
          height,
          type: file.type,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Helper to generate Vercel-like link (simulated)
// In production, you would upload dataUrl to Vercel Blob via API and get back a https://... URL
export const generateVercelLink = (dataUrl: string): string => {
  // For demo, we keep dataUrl as "link" but mark it as vercel-stored
  // In real Vercel Blob, you'd POST to /api/upload and get url
  return dataUrl;
};

// Validate file
export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith('image/')) return 'يُسمح بالصور فقط (JPG, PNG, WebP)';
  if (file.size > 15 * 1024 * 1024) return 'حجم الصورة يجب أن يكون أقل من 15MB';
  return null;
};

export const validateVideoFile = (): string => {
  return 'رفع الفيديوهات مغلق حالياً — سيُفتح قريباً';
};
