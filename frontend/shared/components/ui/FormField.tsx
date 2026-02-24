import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';
import { cn } from '@/shared/lib/utils';

interface BaseFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

interface InputProps extends BaseFormFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'tel' | 'url';
  as?: 'input';
}

interface TextareaProps extends BaseFormFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

type FormFieldProps = InputProps | TextareaProps;

export function FormField({
  label,
  error,
  required,
  className,
  as = 'input',
  ...props
}: FormFieldProps) {
  // Generate unique ID for accessibility
  const generatedId = useId();
  const fieldId = props.id || generatedId;

  const baseInputStyles = cn(
    'w-full px-4 py-3 rounded-lg',
    'bg-[var(--white-5)] border border-[var(--white-15)]',
    'text-white placeholder:text-gray-500',
    'focus-visible:outline-none focus-visible:border-[var(--primary-blue)] focus-visible:ring-2 focus-visible:ring-[var(--primary-blue)]/20',
    'transition-all duration-200',
    error && 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
    className
  );

  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-2 cursor-pointer">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={fieldId}
          className={cn(baseInputStyles, 'min-h-[120px] resize-y')}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          className={baseInputStyles}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
