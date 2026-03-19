/**
 * Form validation utilities
 * Provides consistent validation rules and error messages
 */

import { ERROR_MESSAGES } from './errors';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { valid: true };
}

// Name validation
export function validateName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters.' };
  }

  return { valid: true };
}

// Pet name validation
export function validatePetName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  if (name.trim().length < 1) {
    return { valid: false, error: "Please enter your pet's name." };
  }

  if (name.trim().length > 50) {
    return { valid: false, error: 'Pet name must be less than 50 characters.' };
  }

  return { valid: true };
}

// File validation
export function validateFile(file: File | null): ValidationResult {
  if (!file) {
    return { valid: false, error: ERROR_MESSAGES.NO_PHOTO };
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  return { valid: true };
}

// Style selection validation
export function validateStyle(style: string): ValidationResult {
  if (!style || !style.trim()) {
    return { valid: false, error: ERROR_MESSAGES.NO_STYLE };
  }

  return { valid: true };
}

// Tier selection validation
export function validateTier(tier: string): ValidationResult {
  if (!tier || !tier.trim()) {
    return { valid: false, error: ERROR_MESSAGES.NO_TIER };
  }

  const validTiers = ['basic', 'premium', 'deluxe', 'bundle'];
  if (!validTiers.includes(tier)) {
    return { valid: false, error: 'Invalid package selection.' };
  }

  return { valid: true };
}

// Gift card code validation
export function validateGiftCardCode(code: string): ValidationResult {
  if (!code || !code.trim()) {
    return { valid: false, error: 'Please enter a gift card code.' };
  }

  // Gift card codes are typically 12-16 characters
  const trimmedCode = code.trim();
  if (trimmedCode.length < 8 || trimmedCode.length > 20) {
    return { valid: false, error: 'Invalid gift card code format.' };
  }

  return { valid: true };
}

// Notes validation (optional field)
export function validateNotes(notes: string): ValidationResult {
  if (notes && notes.length > 500) {
    return { valid: false, error: 'Notes must be less than 500 characters.' };
  }

  return { valid: true };
}

// Validate entire order form
export interface OrderFormData {
  name: string;
  email: string;
  petName: string;
  style: string;
  tier: string;
  file: File | null;
  uploadedPhotoUrl: string | null;
  notes?: string;
}

export interface OrderFormErrors {
  name?: string;
  email?: string;
  petName?: string;
  style?: string;
  tier?: string;
  file?: string;
  notes?: string;
}

export function validateOrderForm(data: OrderFormData): { valid: boolean; errors: OrderFormErrors } {
  const errors: OrderFormErrors = {};

  // Validate name
  const nameResult = validateName(data.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error;
  }

  // Validate pet name
  const petNameResult = validatePetName(data.petName);
  if (!petNameResult.valid) {
    errors.petName = petNameResult.error;
  }

  // Validate style
  const styleResult = validateStyle(data.style);
  if (!styleResult.valid) {
    errors.style = styleResult.error;
  }

  // Validate tier
  const tierResult = validateTier(data.tier);
  if (!tierResult.valid) {
    errors.tier = tierResult.error;
  }

  // Validate file or uploaded photo URL
  if (!data.uploadedPhotoUrl) {
    const fileResult = validateFile(data.file);
    if (!fileResult.valid) {
      errors.file = fileResult.error;
    }
  }

  // Validate notes (optional)
  if (data.notes) {
    const notesResult = validateNotes(data.notes);
    if (!notesResult.valid) {
      errors.notes = notesResult.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Real-time field validation
export function validateField(fieldName: keyof OrderFormData, value: unknown): string | undefined {
  switch (fieldName) {
    case 'name':
      return validateName(value as string).error;
    case 'email':
      return validateEmail(value as string).error;
    case 'petName':
      return validatePetName(value as string).error;
    case 'style':
      return validateStyle(value as string).error;
    case 'tier':
      return validateTier(value as string).error;
    case 'file':
      return validateFile(value as File | null).error;
    case 'notes':
      return validateNotes(value as string).error;
    default:
      return undefined;
  }
}
