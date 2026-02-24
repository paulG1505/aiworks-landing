import { LucideIcon } from 'lucide-react';

export interface Service {
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  benefit: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message?: string;
}

export interface Industry {
  icon: LucideIcon;
  name: string;
}

export interface TechStack {
  category: string;
  technologies: string[];
}

export interface Project {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address?: string;
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}
