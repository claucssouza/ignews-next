import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/react'
import { SignInButton } from '.';

jest.mock('next-auth/react');

describe('SigninButton component', () => {
    it('render correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })
        render(<SignInButton />);
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    })

    it('render correctly when user authenticated', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: { user: { name: 'John Doe', email: 'claudia.devsp@gmail.com' }, expires: 'fake-expires'}, status: 'authenticated'})
        render(<SignInButton />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })
});