import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import Head from "next/head";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4278833630932343"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <Component {...pageProps} />
        <ToastContainer
          bodyClassName="font-jetbrains tracking-tighter text-amber-400 text-sm"
          toastClassName="border border-neutral-700"
          position="bottom-right"
          autoClose={3000}
          theme="dark"
          hideProgressBar={true}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
