'use client';

import Link from 'next/link';
import { useBrand } from '../context/BrandContext';
import { routes } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import type { UserRole } from '@product-portal/types';
import { MarketSelector } from './MarketSelector';

interface NavigationProps {
  market: Market;
  user?: { displayName: string; username: string; role?: UserRole } | null;
  logoutAction?: () => Promise<void>;
}

const menuPositionClasses = {
  top: 'flex flex-row items-center gap-8 w-full px-8 py-4 border-b border-gray-200 bg-white shadow-sm',
  side: 'flex flex-col gap-3 w-50 h-screen sticky top-0 px-5 py-8 border-r border-gray-200 bg-white shadow-sm',
  bottom: 'flex flex-row items-center gap-8 w-full justify-center px-8 py-4 border-t border-gray-200 bg-white shadow-sm',
} as const;

export function Navigation({ market, user, logoutAction }: NavigationProps) {
  const { theme, displayName } = useBrand();
  const isSide = theme.menuPosition === 'side';

  return (
    <nav className={menuPositionClasses[theme.menuPosition]}>
      <div className={`flex items-center gap-3 ${isSide ? '' : 'mr-auto'}`}>
        <Link
          href={routes.home(market)}
          className="text-lg font-bold tracking-tight"
          style={{ color: theme.primaryColor }}
        >
          {displayName}
        </Link>
        <MarketSelector market={market} />
      </div>

      <Link
        href={routes.home(market)}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Home
      </Link>
      <Link
        href={routes.products(market)}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Products
      </Link>
      {user?.role === 'admin' && (
        <Link
          href={routes.admin(market)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Admin
        </Link>
      )}

      {isSide && <div className="flex-1" />}

      {user ? (
        <div className={`flex gap-3 ${isSide ? 'flex-col items-start w-full pt-4 border-t border-gray-200' : 'items-center ml-auto'}`}>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
          </div>
          {logoutAction && (
            <form action={logoutAction} className={isSide ? 'w-full' : ''}>
              <button
                type="submit"
                className={`text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer ${isSide ? 'w-full text-center' : ''}`}
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      ) : (
        <Link
          href={routes.login(market)}
          className={`text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors ${isSide ? 'w-full text-center' : 'ml-auto'}`}
          style={{ backgroundColor: theme.primaryColor }}
        >
          Sign in
        </Link>
      )}
    </nav>
  );
}
