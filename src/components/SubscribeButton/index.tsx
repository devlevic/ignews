import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

const SubscribeButton: React.FC = () => {
  const { status, data } = useSession() as any;
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
