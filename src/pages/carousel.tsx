import { MessageForm } from "../components/MessageForm";
import { Header } from "../components/layout/Header";

export default function CarouselPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <MessageForm messageType="Carousel" />
      </main>
    </>
  );
}
