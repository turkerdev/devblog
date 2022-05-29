import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default App;
