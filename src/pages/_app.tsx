import Header from "../components/Header";
import { SessionProvider } from "next-auth/react";
import "../styles/global.scss";

const MyApp = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
