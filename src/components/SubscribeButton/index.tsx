import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ priceId }) => {
  const { status, data } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (status !== "authenticated") return signIn("github");

    if (data.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const {
        data: { sessionId },
      } = await api.post("/subscribe");

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  );
};
export default SubscribeButton;
