/**
 * EXAMPLE: Enhanced Order Form with Comprehensive Error Handling
 *
 * This is a reference implementation showing best practices for:
 * - Form validation with real-time feedback
 * - API error handling with retry logic
 * - Loading states and user feedback
 * - Toast notifications
 * - File upload with progress
 *
 * DO NOT USE IN PRODUCTION - This is a reference/example only
 */

'use client';

import { useState, FormEvent } from 'react';
import { useToast } from '@/hooks/useToast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAsync } from '@/hooks/useAsync';
import { validateEmail, validateName, validatePetName, validateFile } from '@/lib/validation';
import { api } from '@/lib/api-client';
import { FormField } from '@/components/FormField';
import { Alert } from '@/components/Alert';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SuccessMessage } from '@/components/SuccessMessage';
import LoadingButton from '@/components/LoadingButton';
import { RetryButton } from '@/components/RetryButton';
import PetPhotoUpload from '@/components/order/PetPhotoUpload';

export function EnhancedOrderFormExample() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [petName, setPetName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Toast hook
  const toast = useToast();

  // Form validation hook
  const {
    errors,
    touched,
    handleBlur,
    handleChange,
    clearError,
    setFieldError,
  } = useFormValidation<{
    name: string;
    email: string;
    petName: string;
    photo: File | null;
  }>();

  // Async hook for form submission
  const {
    loading: submitting,
    error: submitError,
    execute: submitOrder,
  } = useAsync(
    async (data: { name: string; email: string; petName: string; photoUrl: string }) => {
      return api.post('/api/checkout', data, {
        timeout: 30000,
        retries: 2,
      });
    },
    {
      onSuccess: (data) => {
        toast.success('Order created successfully!', {
          description: 'Redirecting to payment...',
        });
        setSuccessMessage('Your order has been created! Redirecting...');
        // Redirect to payment
        if (data && typeof data === 'object' && 'url' in data) {
          window.location.href = data.url as string;
        }
      },
      onError: (error) => {
        toast.error(error, {
          action: {
            label: 'Retry',
            onClick: () => handleSubmit(),
          },
        });
      },
    }
  );

  // File validation and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Clear previous errors
    setUploadError(null);
    clearError('photo');
    setUploadedPhotoUrl(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      setUploadError(fileValidation.error || 'Invalid file');
      setFieldError('photo', fileValidation.error || 'Invalid file');
      toast.error(fileValidation.error || 'Invalid file');
      return;
    }

    // Set file and preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload immediately
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress (in real implementation, use XMLHttpRequest for progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload with retry logic
      const result = await api.upload('/api/upload', formData, {
        timeout: 60000, // 1 minute for large files
        retries: 3,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedPhotoUrl(result.url);

      toast.success('Photo uploaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      setUploadedPhotoUrl(null);
      setUploadProgress(0);
      toast.error('Failed to upload photo', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => uploadFile(file),
        },
      });
    } finally {
      setUploading(false);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      setFieldError('name', nameValidation.error || 'Invalid name');
      isValid = false;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setFieldError('email', emailValidation.error || 'Invalid email');
      isValid = false;
    }

    // Validate pet name
    const petNameValidation = validatePetName(petName);
    if (!petNameValidation.valid) {
      setFieldError('petName', petNameValidation.error || 'Invalid pet name');
      isValid = false;
    }

    // Validate photo upload
    if (!uploadedPhotoUrl) {
      setUploadError('Please upload a photo of your pet');
      setFieldError('photo', 'Please upload a photo of your pet');
      isValid = false;
    }

    return isValid;
  };

  // Form submission
  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    // Clear previous messages
    setSuccessMessage(null);

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Submit order
    await submitOrder({
      name,
      email,
      petName,
      photoUrl: uploadedPhotoUrl!,
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileChange(syntheticEvent);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-semibold tracking-tight mb-8 text-center">
        Enhanced Order Form <span className="text-gradient">Example</span>
      </h1>

      {/* Global error alert */}
      {submitError && (
        <Alert
          variant="error"
          title="Submission Failed"
          className="mb-6"
          onClose={() => {}}
        >
          {submitError.userMessage}
          {submitError.recoverable && (
            <div className="mt-3">
              <RetryButton onRetry={handleSubmit} className="text-sm">
                Retry Submission
              </RetryButton>
            </div>
          )}
        </Alert>
      )}

      {/* Success message */}
      {successMessage && (
        <Alert variant="success" className="mb-6">
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field with validation */}
        <FormField
          id="name"
          label="Your Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleChange('name', e.target.value);
          }}
          onBlur={() => handleBlur('name', name)}
          error={touched.name ? errors.name : undefined}
          placeholder="John Doe"
          required
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        {/* Email field with validation */}
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleChange('email', e.target.value);
          }}
          onBlur={() => handleBlur('email', email)}
          error={touched.email ? errors.email : undefined}
          placeholder="john@example.com"
          helperText="We'll send your portrait to this email"
          required
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Pet name field */}
        <FormField
          id="petName"
          label="Pet's Name"
          type="text"
          value={petName}
          onChange={(e) => {
            setPetName(e.target.value);
            handleChange('petName', e.target.value);
          }}
          onBlur={() => handleBlur('petName', petName)}
          error={touched.petName ? errors.petName : undefined}
          placeholder="Fluffy"
          required
        />

        {/* Pet photo upload with progress */}
        <div>
          <PetPhotoUpload
            previewUrl={previewUrl}
            uploading={uploading}
            uploadProgress={uploadProgress}
            uploadedPhotoUrl={uploadedPhotoUrl}
            selectedFile={selectedFile}
            dragOver={dragOver}
            uploadError={uploadError}
            formError={touched.photo ? errors.photo : undefined}
            onFileChange={handleFileChange}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />

          {uploadedPhotoUrl && (
            <SuccessMessage message="Photo uploaded successfully!" />
          )}
        </div>

        {/* Submit button */}
        <LoadingButton
          type="submit"
          isLoading={submitting}
          loadingText="Creating order..."
          disabled={uploading}
          className="w-full"
        >
          Create Order - $9
        </LoadingButton>

        <p className="text-xs text-white/40 text-center">
          By placing an order, you agree to our terms of service
        </p>
      </form>

      {/* Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs font-semibold text-blue-300 mb-2">Dev Info:</p>
          <pre className="text-xs text-blue-400 font-mono overflow-auto">
            {JSON.stringify(
              {
                formValid: !Object.values(errors).some((e) => e),
                errors,
                touched,
                uploadedPhotoUrl,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
