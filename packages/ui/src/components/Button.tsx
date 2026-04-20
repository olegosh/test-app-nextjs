'use client';

import { useBrand } from '../context/BrandContext';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  green: {
    background: '#22c55e',
    hoverBackground: '#16a34a',
  },
  red: {
    background: '#dc2626',
    hoverBackground: '#b91c1c',
  },
} as const;

export function Button({ label, onClick, className = '' }: ButtonProps) {
  const { productCard } = useBrand();
  const style = variantStyles[productCard.buttonVariant];

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg font-semibold text-sm text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer ${className}`}
      style={{ backgroundColor: style.background }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = style.hoverBackground;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = style.background;
      }}
    >
      {label}
    </button>
  );
}
