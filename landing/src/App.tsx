// Swap this for BackgroundVideo once there is a video file worth playing;
// it takes the same input. Backdrop draws the same thing instead, which
// needs no network, no codec support and no byte-range server.
import Backdrop from "./components/Backdrop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <Hero />
    </>
  );
}
