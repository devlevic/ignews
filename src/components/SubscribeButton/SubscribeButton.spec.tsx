import { render, screen, fireEvent } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/react'
import { mocked } from 'jest-mock'
import { useRouter } from 'next/router'
import SubscribeButton from '.'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import { act } from 'react-dom/test-utils'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/api')
jest.mock('../../services/stripe-js')

describe('SubscribeButton component', () => {
    it('should render correctly ', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

        render(<SubscribeButton />)
    
        expect(screen.getByText("Subscribe Now")).toBeInTheDocument()
    })
   
    it('should redirect user to sign in when not authenticated ', () => {
        const useSessionMocked = mocked(useSession)
        const signInMocked = mocked(signIn)
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)
    
        expect(signInMocked).toHaveBeenCalled()
    })

    it('should redirect user to posts if user already has a subscription', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ data: { session: { user: { name: 'John Doe' }}, activeSubscription: 'fake-active-subscription', expires: 'fake-expires' }, status: 'authenticated' })
        
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)
    
        expect(pushMock).toHaveBeenCalled()
    })

    it('should create subscribe and redirect to checkout page', async () => {
        const useSessionMocked = mocked(useSession)
        const apiPostMocked = jest.spyOn(api, 'post')
        const getStripeJsMocked = mocked(getStripeJs)

        const redirectToCheckoutMocked = jest.fn()
        
        useSessionMocked.mockReturnValueOnce({ data: { session: { user: { name: 'John Doe' }}, expires: 'fake-expires' }, status: 'authenticated' })
        apiPostMocked.mockResolvedValueOnce({
            data: {
                sessionId: 'fake-session-id'
            }
        })
        getStripeJsMocked.mockResolvedValueOnce({
            redirectToCheckout: redirectToCheckoutMocked
        } as any)

        render(<SubscribeButton />)
        const subscribeButton = screen.getByText('Subscribe Now')

        
        await act(async () => {
            fireEvent.click(subscribeButton)
        })
        expect(apiPostMocked).toHaveBeenCalledWith('/subscribe')
        expect(getStripeJs).toHaveBeenCalledWith() 
        expect(redirectToCheckoutMocked).toHaveBeenCalledWith({ sessionId: 'fake-session-id' }) 
    })

    it('should create to try subscribe, be rejected and show in screen the error message', async () => {
        const useSessionMocked = mocked(useSession)
        const apiPostMocked = jest.spyOn(api, 'post')
        const getStripeJsMocked = mocked(getStripeJs)
        const consoleLogMocked = jest.spyOn(console, 'log')

        const redirectToCheckoutMocked = jest.fn()
        
        useSessionMocked.mockReturnValueOnce({ data: { session: { user: { name: 'John Doe' }}, expires: 'fake-expires' }, status: 'authenticated' })
        apiPostMocked.mockRejectedValueOnce({ message: 'Não foi possível realizar inscrição'})
        getStripeJsMocked.mockResolvedValueOnce({
            redirectToCheckout: redirectToCheckoutMocked
        } as any)

        render(<SubscribeButton />)
        const subscribeButton = screen.getByText('Subscribe Now')

        
        await act(async () => {
            fireEvent.click(subscribeButton)
        })
        expect(apiPostMocked).toHaveBeenCalledWith('/subscribe')
        expect(getStripeJs).not.toHaveBeenCalledWith() 
        expect(redirectToCheckoutMocked).not.toHaveBeenCalledWith({ sessionId: 'fake-session-id' }) 
        expect(consoleLogMocked).toHaveBeenCalledWith({ message: 'Não foi possível realizar inscrição' })
    })
})