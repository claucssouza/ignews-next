import { render, screen, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';
import { Button } from '.';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('Subscribe Button Component', () => {
    it('rendering correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });
        render(<Button />);
        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to sign in when not authenticated', () => {
        const signInMocked = mocked(signIn);
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });
        render(<Button />);
        const button = screen.getByText('Subscribe now');
        fireEvent.click(button);
        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);
        const pushMock = jest.fn();
        useSessionMocked.mockReturnValueOnce({ data: { user: { name: 'John Doe', email: 'claudia.devsp@gmail.com' }, expires: 'fake-expires', activeSubscription: true }, status: 'authenticated' });
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any);
        render(<Button />);
        const button = screen.getByText('Subscribe now');
        fireEvent.click(button);
        expect(pushMock).toHaveBeenCalledWith('/posts');
    })
});