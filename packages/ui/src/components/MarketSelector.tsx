'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MARKETS } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';

interface MarketSelectorProps {
  market: Market;
}

function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" width="20" height="10" className="rounded-sm shrink-0">
      <clipPath id="gb"><path d="M0 0v30h60V0z" /></clipPath>
      <g clipPath="url(#gb)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb)" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function FlagCA() {
  return (
    <svg viewBox="0 0 60 30" width="20" height="10" className="rounded-sm shrink-0">
      <rect width="60" height="30" fill="#fff" />
      <rect width="15" height="30" fill="#FF0000" />
      <rect x="45" width="15" height="30" fill="#FF0000" />
      <path
        d="M30 5l-1.5 4.5-3-1.5.5 3.5-3.5.5 2.5 2.5-2 3h4l-.5 3 3.5-2 3.5 2-.5-3h4l-2-3 2.5-2.5-3.5-.5.5-3.5-3 1.5z"
        fill="#FF0000"
      />
    </svg>
  );
}

const marketConfig: Record<Market, { Flag: () => React.JSX.Element; label: string }> = {
  en: { Flag: FlagGB, label: 'EN' },
  ca: { Flag: FlagCA, label: 'CA' },
};

function isProductDetailPage(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  // matches /[market]/product/[slug]
  return segments.length >= 3 && segments[1] === 'product';
}

export function MarketSelector({ market }: MarketSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const disabled = isProductDetailPage(pathname);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectMarket(newMarket: Market) {
    setOpen(false);
    if (newMarket !== market) {
      const newPath = pathname.replace(`/${market}`, `/${newMarket}`);
      router.push(newPath);
    }
  }

  const current = marketConfig[market];

  if (disabled) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-400">
        <current.Flag />
        <span>{current.label}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <current.Flag />
        <span>{current.label}</span>
        <span className="text-gray-400 text-[10px]">▼</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden min-w-[100px]">
          {MARKETS.map((m) => {
            const cfg = marketConfig[m];
            const isActive = m === market;
            return (
              <button
                key={m}
                type="button"
                onClick={() => selectMarket(m)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <cfg.Flag />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
