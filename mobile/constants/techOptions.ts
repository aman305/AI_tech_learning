import { Field } from '../types';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export const techOptions: Record<Field, string[]> = {
  'Software Development': [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go',
    'Rust', 'Flutter', 'React', 'Node.js', 'React Native', 'Swift',
  ],
  'QA': [
    'Selenium', 'Cypress', 'Playwright', 'Appium', 'JMeter',
    'Postman', 'Rest Assured', 'TestNG',
  ],
  'Data & AI': [
    'ML Fundamentals', 'TensorFlow', 'PyTorch', 'Pandas',
    'NumPy', 'SQL', 'Power BI', 'Tableau', 'Scikit-learn',
  ],
  'DevOps': [
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP',
    'Terraform', 'Linux', 'Jenkins', 'Ansible',
  ],
};

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const fieldIcons: Record<Field, IoniconName> = {
  'Software Development': 'code-slash',
  'QA': 'bug',
  'Data & AI': 'analytics',
  'DevOps': 'cloud-upload',
};

export const fieldIconColors: Record<Field, { bg: string; fg: string }> = {
  'Software Development': { bg: '#dbeafe', fg: '#2563eb' },
  'QA': { bg: '#f3e8ff', fg: '#9333ea' },
  'Data & AI': { bg: '#fef3c7', fg: '#d97706' },
  'DevOps': { bg: '#d1fae5', fg: '#059669' },
};
