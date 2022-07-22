import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import Home, { getStaticProps } from '../../src/pages/index'
import { stripe } from '../../src/services/stripe'

jest.mock('next-auth/react', () => {
    return {
        useSession: () =>  [null, false]
    }
})

jest.mock('../../src/services/stripe')

describe('Home page', () => {
    it('should render correctly', () => {
        render(<Home product={{ priceId: 'fake-price-id', amount: 'R$ 10,00' }} />)
        expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument()
    })

    it('should load initial data', async () => {
        const retrieveStripePricesMock = mocked(stripe.prices.retrieve)

        const stripeProps = {
            id: 'fake-price-id',
            unit_amount: 1000
        }

        retrieveStripePricesMock.mockResolvedValueOnce(stripeProps as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})