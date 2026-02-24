'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { ContactFormData } from '@/shared/types';

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
}

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hoist RegExp outside function to avoid recreation (js-hoist-regexp)
  const emailRegex = useRef(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  const validateEmail = (email: string): boolean => {
    return emailRegex.current.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'La empresa es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form first - button stays enabled during validation
    if (!validateForm()) {
      return;
    }

    try {
      // Only disable button when request actually starts
      setIsSubmitting(true);

      // Simulate API call
      console.log('Form submitted:', formData);

      // In production, replace with actual API call:
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', message: '' });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ email: 'Error al enviar el formulario. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit
  };
}
