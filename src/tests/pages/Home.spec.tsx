import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';


jest.mock('next-auth/react', () => {
    return {
        useSession() {
            return {
                data: null,
                status: 'unauthenticated'
            }
        }
    }
});

jest.mock('next/router');
jest.mock('../../services/stripe');

describe('Home Page', () => {
    it('renders correctly', () => {
        render(<Home product={{ priceId: 'fakePrice', amount: 'R$100.00' }} />);
        expect(screen.getByText('for R$100.00 month')).toBeInTheDocument();
    });

    it('loads initial data', async () => {
        const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);
        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000
        } as any);
        const response = await getStaticProps({});
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