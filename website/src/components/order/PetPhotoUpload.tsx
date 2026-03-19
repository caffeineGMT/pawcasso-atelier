import Image from "next/image";

/**
 * Props for PetPhotoUpload component
 */
export interface PetPhotoUploadProps {
  /** Preview URL for selected image */
  previewUrl: string | null;
  /** Whether upload is in progress */
  uploading: boolean;
  /** Upload progress percentage (0-100) */
  uploadProgress: number;
  /** Whether photo has been successfully uploaded */
  uploadedPhotoUrl: string | null;
  /** Selected file object */
  selectedFile: File | null;
  /** Whether drag is over drop zone */
  dragOver: boolean;
  /** Upload error message */
  uploadError: string | null;
  /** Additional form validation error */
  formError?: string;
  /** Handle file input change */
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handle drag over event */
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handle drag leave event */
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handle drop event */
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * Pet photo upload component with drag-and-drop support
 *
 * Displays upload progress, preview, success/error states
 */
export default function PetPhotoUpload({
  previewUrl,
  uploading,
  uploadProgress,
  uploadedPhotoUrl,
  selectedFile,
  dragOver,
  uploadError,
  formError,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
}: PetPhotoUploadProps) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
        Pet Photo
      </label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border border-dashed transition-all rounded-2xl text-center cursor-pointer relative group min-h-[200px] sm:min-h-[320px] flex flex-col items-center justify-center ${
          dragOver
            ? 'border-gold bg-gold/5'
            : uploadedPhotoUrl
            ? 'border-green-500/40 bg-green-500/5'
            : 'border-white/[0.12] hover:border-gold/40'
        } ${uploading ? 'pointer-events-none' : ''}`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          required
          onChange={onFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Preview with uploaded state */}
        {previewUrl && uploadedPhotoUrl ? (
          <div className="relative w-full h-full p-4">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden">
              <Image
                src={previewUrl}
                alt="Pet photo preview"
                fill
                className="object-cover"
                sizes="600px"
              />
              {/* Success overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <svg className="w-12 h-12 text-green-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-sm font-semibold">Uploaded successfully</p>
                  <p className="text-white/60 text-xs mt-1">Click to replace photo</p>
                </div>
              </div>
            </div>
          </div>
        ) : uploading ? (
          /* Upload progress */
          <div className="p-10 sm:p-12 w-full">
            <svg className="w-12 h-12 mx-auto text-gold mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gold text-lg font-medium mb-4">Uploading...</p>
            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto">
              <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gold h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2 text-center">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        ) : selectedFile && !uploadedPhotoUrl ? (
          /* File selected but not uploaded yet */
          <div className="p-10 sm:p-12">
            <svg className="w-12 h-12 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gold text-lg font-medium">{selectedFile.name}</p>
          </div>
        ) : (
          /* Empty state */
          <div className="p-10 sm:p-12">
            <svg className="w-16 h-16 mx-auto text-white/20 group-hover:text-gold/60 transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-text-secondary text-lg font-medium">
              {dragOver ? 'Drop photo here' : 'Drag photo here or click to browse'}
            </p>
            <p className="text-white/20 text-xs mt-2">JPG, PNG, HEIC up to 10MB</p>
          </div>
        )}
      </div>
      {(uploadError || formError) && (
        <p className="text-red-400 text-sm mt-3 text-center font-medium animate-shake">{uploadError || formError}</p>
      )}
    </div>
  );
}
