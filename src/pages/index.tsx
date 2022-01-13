import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Button } from '../components/Button';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

const Home = ({ product }: HomeProps) => {
  return (
    <>
      <Head>
        <title>Home IgNews</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <Button />
        </section>
        <img src="/assets/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}
export default Home;

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1KDvADAvEHB88E8JJ5AqCwon');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
