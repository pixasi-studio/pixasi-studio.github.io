/* Backdrop draws what the design's looping video would have shown. It
   needs no network, no codec support and no byte-range server; see the
   note at the top of it, and BackgroundVideo.tsx for the swap. */
import Backdrop from "./components/Backdrop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
