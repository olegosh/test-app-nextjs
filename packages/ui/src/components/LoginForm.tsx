'use client';

import { useState, useTransition, useRef } from 'react';
import type { Market } from '@product-portal/constants';
import type { Credential } from '@product-portal/types';

interface LoginFormProps {
  market: Market;
  credentials: Credential[];
  action: (formData: FormData) => Promise<{ error?: string }>;
}

export function LoginForm({ market, credentials, action }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result.error) setError(result.error);
    });
  }

  function autofill(username: string, password: string) {
    if (usernameRef.current) usernameRef.current.value = username;
    if (passwordRef.current) passwordRef.current.value = password;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p
            role="alert"
            className="text-red-700 text-sm rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          >
            {error}
          </p>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Username</span>
          <input
            ref={usernameRef}
            name="username"
            type="text"
            required
            autoComplete="username"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            ref={passwordRef}
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer mt-1"
        >
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="border-t border-gray-200 pt-5">
        <p className="text-xs text-gray-400 text-center mb-3">Demo credentials</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left font-medium pb-2">Market</th>
              <th className="text-left font-medium pb-2">Username</th>
              <th className="text-left font-medium pb-2">Password</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {credentials.map((cred) => {
              const isActive = cred.role !== 'admin' && cred.market === market;
              return (
                <tr
                  key={cred.username}
                  className={
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-gray-400'
                  }
                >
                  <td className="py-1.5 px-1 rounded-l-md">{cred.market?.toUpperCase() ?? 'ALL'}</td>
                  <td className="py-1.5 font-mono">{cred.username}</td>
                  <td className="py-1.5 font-mono">{cred.password}</td>
                  <td className="py-1.5 text-right px-1 rounded-r-md">
                    <button
                      type="button"
                      onClick={() => autofill(cred.username, cred.password)}
                      className={`font-medium cursor-pointer transition-colors ${
                        isActive
                          ? 'text-blue-600 hover:text-blue-800'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Use
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
