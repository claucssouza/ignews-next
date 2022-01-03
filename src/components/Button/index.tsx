import styles from './styles.module.scss';

interface Button {
    priceId: string;
}

const Button = ({ priceId }: Button) => {
    return (
        <button
            type="button"
            className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    )
}

export { Button };