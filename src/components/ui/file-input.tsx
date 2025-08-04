import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, X, FileText } from 'lucide-react';

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange?: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  label?: string;
  description?: string;
  error?: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileChange, maxFiles = 5, accept, label, description, error, ...props }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const fileArray = Array.from(e.target.files);
        const newFiles = [...files, ...fileArray].slice(0, maxFiles);
        setFiles(newFiles);
        if (onFileChange) {
          onFileChange(newFiles);
        }
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files) {
        const fileArray = Array.from(e.dataTransfer.files);
        const newFiles = [...files, ...fileArray].slice(0, maxFiles);
        setFiles(newFiles);
        if (onFileChange) {
          onFileChange(newFiles);
        }
      }
    };

    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      if (onFileChange) {
        onFileChange(newFiles);
      }
    };

    return (
      <div className="space-y-2">
        {label && <div className="text-sm font-medium">{label}</div>}
        <div
          className={cn(
            "border-2 border-dashed rounded-md p-6 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            error ? "border-red-500" : "",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={props.id || "file-upload"}
                className="cursor-pointer text-sm font-medium text-primary hover:underline"
              >
                点击上传文件
                <input
                  ref={ref}
                  type="file"
                  id={props.id || "file-upload"}
                  className="sr-only"
                  onChange={handleFileChange}
                  accept={accept}
                  multiple={maxFiles > 1}
                  {...props}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                {description || `支持上传最多 ${maxFiles} 个文件`}
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}
        
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";