'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginHref: string;
}

export function AuthModal({ isOpen, onClose, loginHref }: AuthModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleSignIn() {
    onClose();
    router.push(loginHref);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 m-auto w-full max-w-sm rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 text-xl">
          🔒
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Authentication Required</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Please authenticate to browse the product&apos;s details.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSignIn}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </dialog>
  );
}
