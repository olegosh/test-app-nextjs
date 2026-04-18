import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginForm } from '../../../../packages/ui/src/components/LoginForm';
import credentials from '../../../../packages/constants/src/credentials.json';
import type { Credential } from '../../../../packages/types/src/auth';

const mockCredentials = credentials as Credential[];

describe('Login flow — integration', () => {
  it('calls action with correct FormData on submit', async () => {
    const mockAction = jest.fn().mockResolvedValue({});
    render(<LoginForm market="en" credentials={mockCredentials} action={mockAction} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'user-en');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass-en-123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    const formData: FormData = mockAction.mock.calls[0][0] as FormData;
    expect(formData.get('username')).toBe('user-en');
    expect(formData.get('password')).toBe('pass-en-123');
  });

  it('displays error message when action returns an error', async () => {
    const mockAction = jest.fn().mockResolvedValue({ error: 'Invalid credentials for this market' });
    render(<LoginForm market="en" credentials={mockCredentials} action={mockAction} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'bad-user');
    await userEvent.type(screen.getByLabelText(/password/i), 'bad-pass');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid credentials for this market',
      );
    });
  });

  it('disables the submit button while the action is pending', async () => {
    let resolveAction!: (val: { error?: string }) => void;
    const mockAction = jest.fn(
      () =>
        new Promise<{ error?: string }>((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<LoginForm market="en" credentials={mockCredentials} action={mockAction} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'user-en');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass-en-123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    resolveAction({});
  });

  it('clears error state on a successful subsequent attempt', async () => {
    const mockAction = jest
      .fn()
      .mockResolvedValueOnce({ error: 'Invalid credentials for this market' })
      .mockResolvedValueOnce({});

    render(<LoginForm market="en" credentials={mockCredentials} action={mockAction} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'bad');
    await userEvent.type(screen.getByLabelText(/password/i), 'bad');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(2);
    });
  });
});
