/* Backdrop draws what the design's looping video would have shown. It
   needs no network, no codec support and no byte-range server; see the
   note at the top of it, and BackgroundVideo.tsx for the swap. */
import Backdrop from "./components/Backdrop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Practice from "./components/Practice";
import Plates from "./components/Plates";
import Method from "./components/Method";
import Signal from "./components/Signal";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Practice />
        <Plates />
        <Method />
        <Signal />
      </main>
      <Footer />
    </>
  );
}
