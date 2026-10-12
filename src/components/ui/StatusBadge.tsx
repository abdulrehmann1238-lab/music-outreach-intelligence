import React from 'react';
import { ProspectStatus, EvidenceConfidence } from '../../types';

interface StatusBadgeProps {
  status: ProspectStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    qualified: {
      label: 'Qualified',
      bg: 'bg-success-tint',
      text: 'text-success',
      border: 'border-success/30',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    shortlisted: {
      label: 'Shortlisted',
      bg: 'bg-primary-tint',
      text: 'text-primary',
      border: 'border-primary/30',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )
    },
    approved: {
      label: 'Approved',
      bg: 'bg-success-tint',
      text: 'text-success',
      border: 'border-success/40',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    replied: {
      label: 'Replied',
      bg: 'bg-accent-tint',
      text: 'text-accent',
      border: 'border-accent/30',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      )
    },
    needs_review: {
      label: 'Needs review',
      bg: 'bg-warning-tint',
      text: 'text-warning',
      border: 'border-warning/30',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
      )
    },
    held: {
      label: 'Held',
      bg: 'bg-warning-tint',
      text: 'text-warning',
      border: 'border-warning/40',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" />
        </svg>
      )
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-error-tint',
      text: 'text-error',
      border: 'border-error/30',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    suppressed: {
      label: 'Suppressed',
      bg: 'bg-error-tint',
      text: 'text-error',
      border: 'border-error/40',
      icon: (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  }[status];

  const sizeClasses = size === 'sm' ? 'text-[11px] py-0.5 px-2 gap-1' : 'text-xs py-1 px-2.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded-xs border ${config.bg} ${config.text} ${config.border} ${sizeClasses} select-none`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ confidence: EvidenceConfidence }> = ({ confidence }) => {
  const dots = {
    high: [true, true, true],
    medium: [true, true, false],
    low: [true, false, false],
  }[confidence];

  const label = {
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence',
  }[confidence];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary" title={`Evidence confidence: ${label}`}>
      <span className="flex items-center gap-0.5">
        {dots.map((filled, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              filled ? 'bg-primary' : 'bg-border-strong'
            }`}
          />
        ))}
      </span>
      <span className="capitalize">{confidence}</span>
    </span>
  );
};

export const NeedTypeChip: React.FC<{ type: 'explicit' | 'hypothesis' }> = ({ type }) => {
  if (type === 'explicit') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium font-sans px-2 py-0.5 rounded-xs bg-success-tint text-success border border-success/30">
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Explicit statement
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium font-sans px-2 py-0.5 rounded-xs bg-info-tint text-info border border-info/30" title="Inferred need is a hypothesis. It does not imply willingness or ability to pay.">
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
      </svg>
      Hypothesis (inferred)
    </span>
  );
};
