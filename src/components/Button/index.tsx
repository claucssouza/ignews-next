import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface Button {
    priceId: string;
}

const Button = ({ priceId }: Button) => {

    const { data } = useSession();

    const handleSubscribe = async () => {
        if (!data) {
            signIn('github');
            return;
        }
        try {
            const response = await api.post('subscribe');
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}

export { Button };