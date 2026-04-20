'use client';

import { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { theme } = useBrand();

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-10 h-10 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
      style={{ backgroundColor: theme.primaryColor }}
      aria-label="Scroll to top"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V4M4 7l4-4 4 4" />
      </svg>
    </button>
  );
}
