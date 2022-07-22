import { GetStaticProps } from "next";
import Head from "next/head";
import SubscribeButton from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default ({ product }: HomeProps) => (
  <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>
          News about the <span>React</span> World
        </h1>
        <p>
          Get access to all the publicantions
          <br />
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton />
      </section>
      <img src="/images/avatar.svg" alt="Girl Coding" />
    </main>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KOBiSHnu8XF6HJF0UYZBcED");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};
