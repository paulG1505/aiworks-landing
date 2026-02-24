import { ProcessStep as ProcessStepType } from '@/shared/types';

interface ProcessStepProps {
  step: ProcessStepType;
  isLast: boolean;
}

export function ProcessStep({ step, isLast }: ProcessStepProps) {
  const { number, title, description } = step;

  return (
    <div className="flex gap-6 group">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        {/* Circle with gradient number */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--primary-blue)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--primary-blue)]/30 group-hover:scale-110 transition-transform">
          <span className="text-2xl font-bold text-white">{number}</span>
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-[var(--primary-blue)] to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--primary-cyan)] transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
