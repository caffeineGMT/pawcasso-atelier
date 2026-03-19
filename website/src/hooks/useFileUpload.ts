import { useState } from 'react';

/**
 * Configuration options for file upload validation
 */
export interface FileUploadConfig {
  /** Maximum file size in bytes (default: 10MB) */
  maxSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
}

/**
 * State and handlers for file upload functionality
 */
export interface UseFileUploadReturn {
  /** Currently selected file */
  selectedFile: File | null;
  /** Preview URL for the selected file */
  previewUrl: string | null;
  /** Upload progress percentage (0-100) */
  uploadProgress: number;
  /** Upload error message if any */
  uploadError: string | null;
  /** Uploaded file URL from server */
  uploadedPhotoUrl: string | null;
  /** Whether upload is in progress */
  uploading: boolean;
  /** Whether drag is currently over drop zone */
  dragOver: boolean;
  /** Handle file input change */
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** Handle drag over event */
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handle drag leave event */
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handle drop event */
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => Promise<void>;
  /** Reset upload state */
  resetUpload: () => void;
}

const DEFAULT_CONFIG: Required<FileUploadConfig> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};

/**
 * Custom hook for handling file upload with drag-and-drop support
 *
 * @param uploadEndpoint - API endpoint for uploading files
 * @param config - Optional configuration for file validation
 * @param onUploadSuccess - Optional callback when upload succeeds
 *
 * @example
 * ```tsx
 * const {
 *   selectedFile,
 *   handleFileChange,
 *   uploading
 * } = useFileUpload('/api/upload-pet-photo', {
 *   maxSize: 5 * 1024 * 1024 // 5MB
 * });
 * ```
 */
export function useFileUpload(
  uploadEndpoint: string,
  config: FileUploadConfig = {},
  onUploadSuccess?: (url: string) => void
): UseFileUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  /**
   * Validates file size and type
   */
  const validateFile = (file: File): string | null => {
    if (file.size > finalConfig.maxSize) {
      const maxSizeMB = finalConfig.maxSize / (1024 * 1024);
      return `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller image.`;
    }

    if (!finalConfig.allowedTypes.includes(file.type)) {
      return "Invalid file type. Please upload JPG, PNG, HEIC, or WebP.";
    }

    return null;
  };

  /**
   * Uploads file to server with progress tracking
   */
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.error || 'Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', uploadEndpoint);
      xhr.send(formData);
    });
  };

  /**
   * Handles file input change event
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];

    // Clear previous errors and state
    setUploadError(null);
    setUploadedPhotoUrl(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      return;
    }

    // Validate file
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Set the file and generate preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload immediately
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrl = await uploadFile(file);
      setUploadedPhotoUrl(uploadedUrl);
      setUploadProgress(100);
      onUploadSuccess?.(uploadedUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setUploadError(errorMessage);
      setUploadedPhotoUrl(null);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handles drag over event
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  /**
   * Handles drop event
   */
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse handleFileChange logic
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileChange(syntheticEvent);
    }
  };

  /**
   * Resets upload state
   */
  const resetUpload = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedPhotoUrl(null);
    setUploading(false);
    setDragOver(false);
  };

  return {
    selectedFile,
    previewUrl,
    uploadProgress,
    uploadError,
    uploadedPhotoUrl,
    uploading,
    dragOver,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetUpload,
  };
}
