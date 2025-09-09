import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import TextPage from "./pages/text";
import ImagePage from "./pages/image";
import AudioPage from "./pages/audio"
import VideoPage from "./pages/video";
import FilePage from "./pages/file";
import StickerPage from "./pages/sticker"
import LocationPage from "./pages/location";
import ListPage from "./pages/list";
// import OtpPage from "./pages/otp";
import ContactPage from "./pages/contact"
import CardPage from "./pages/card"
import CarouselPage from "./pages/carousel"
import TwoFAPage from "./pages/two-fa"

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<TextPage />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/audio" element={<AudioPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/file" element={<FilePage />} />
          <Route path="/sticker" element={<StickerPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/list" element={<ListPage />} />
          {/* <Route path="/otp" element={<OtpPage />} /> */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/card" element={<CardPage />} />
          <Route path="/carousel" element={<CarouselPage />} />
          <Route path="/2fa" element={<TwoFAPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
