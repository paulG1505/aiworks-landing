'use client';

import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { Card } from '@/shared/components/ui/Card';
import { useContactForm } from '../hooks/useContactForm';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { CheckCircle } from 'lucide-react';

export function ContactForm() {
  const { t, locale } = useTranslation();
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit
  } = useContactForm();

  if (isSuccess) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h3 className="text-2xl font-bold text-white">
          {locale === 'en' ? 'Message sent!' : '¡Mensaje enviado!'}
        </h3>
        <p className="text-gray-400 text-center">
          {locale === 'en' ? 'We will contact you soon.' : 'Nos pondremos en contacto contigo pronto.'}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-6">{t.cta.form.title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label={t.cta.form.name}
          name="name"
          type="text"
          required
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <FormField
          label={t.cta.form.email}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormField
          label={t.cta.form.message}
          name="message"
          as="textarea"
          autoComplete="off"
          value={formData.message}
          onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (locale === 'en' ? 'Sending...' : 'Enviando...') : t.cta.form.submit}
        </Button>
      </form>
    </Card>
  );
}
