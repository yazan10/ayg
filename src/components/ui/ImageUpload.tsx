import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { compressImage, validateImageFile } from '../../lib/imageCompress';

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  previewSize?: 'sm' | 'md' | 'lg';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'صورة',
  placeholder = 'اختر صورة من جهازك',
  required = false,
  previewSize = 'md',
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; originalSize: number; compressedSize: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsCompressing(true);

    try {
      const compressed = await compressImage(file, 1024, 0.72);
      const imageLink = compressed.dataUrl; // compressed image ready as data URL
      onChange(imageLink);
      setFileInfo({
        name: file.name,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
      });
    } catch (err: any) {
      setError(err?.message || 'فشل ضغط الصورة');
    } finally {
      setIsCompressing(false);
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileInfo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-[#323232] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div
        onClick={() => !isCompressing && inputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white hover:bg-neutral-50 ${
          error ? 'border-red-300 bg-red-50' : value ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#323232] shadow-[3px_3px_#323232]'
        } ${isCompressing ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          required={required && !value}
        />

        {isCompressing ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-blue-700">جاري الضغط والحفظ...</span>
            <span className="text-[11px] text-neutral-500">سيتم ضغط الصورة وتحويلها لرابط</span>
          </>
        ) : value ? (
          <>
            <div className={`relative ${sizeClasses[previewSize]} rounded-xl overflow-hidden border-2 border-[#323232] shadow-[2px_2px_#323232] shrink-0`}>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">تم الرفع والضغط بنجاح ✓</span>
            {fileInfo && (
              <span className="text-[11px] text-neutral-500 font-mono">
                {fileInfo.name} • {formatSize(fileInfo.originalSize)} → {formatSize(fileInfo.compressedSize)} • تم الحفظ
              </span>
            )}
            <span className="text-[11px] text-blue-600 font-bold hover:underline">اضغط لتغيير الصورة</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-[#323232] text-white flex items-center justify-center shadow-[2px_2px_#323232]">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-[#323232]">{placeholder}</span>
            <span className="text-[11px] text-neutral-500 text-center leading-relaxed">
              JPG, PNG, WebP — حتى 15MB<br />
              سيتم الضغط تلقائياً وحفظ الصورة
            </span>
            <span className="text-xs font-bold text-white bg-[#323232] px-3 py-1.5 rounded-full shadow-[2px_2px_#323232]">
              اختيار من الجهاز
            </span>
          </>
        )}
      </div>

      {value && (
        <button
          type="button"
          onClick={handleRemove}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 hover:bg-red-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          إزالة الصورة
        </button>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-[#323232] rounded-lg shadow-[2px_2px_#323232] p-2.5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <span className="text-xs font-bold text-red-700">{error}</span>
        </div>
      )}

      <p className="text-[11px] text-neutral-500 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        الرفع من الجهاز فقط — ممنوع الروابط الخارجية
      </p>
    </div>
  );
};
