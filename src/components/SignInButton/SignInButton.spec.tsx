import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { mocked } from 'jest-mock'
import SignInButton from '.'

jest.mock('next-auth/react')

describe('Header component', () => {
    it('should render correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

        render(<SignInButton />)
    
        expect(screen.getByText("Sign in with Github")).toBeInTheDocument()
    })

    it('should render correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: { session: { user: { name: 'John Doe' }}, expires: 'fake-expires' }, status: 'authenticated' })

        render(<SignInButton />)

        expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    it('should call function signOut when is authenticated', () => {
        const useSessionMocked = mocked(useSession)
        const signOutMocked = mocked(signOut)

        useSessionMocked.mockReturnValueOnce({ data: { session: { user: { name: 'John Doe' }}, expires: 'fake-expires' }, status: 'authenticated' })

        render(<SignInButton />)
    
        const signOutButton = screen.getByText('John Doe')
        fireEvent.click(signOutButton)

        expect(screen.getByText("John Doe")).toBeInTheDocument()
        expect(signOutMocked).toHaveBeenCalled()
    })
    
    it('should call function signIn when is not authenticated', () => {
        const useSessionMocked = mocked(useSession)
        const signInMocked = mocked(signIn)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

        render(<SignInButton />)
    
        const signOutButton = screen.getByText('Sign in with Github')
        fireEvent.click(signOutButton)

        expect(screen.getByText("Sign in with Github")).toBeInTheDocument()
        expect(signInMocked).toHaveBeenCalled()
    })
})