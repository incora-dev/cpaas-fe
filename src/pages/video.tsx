import { MessageForm } from "../components/MessageForm";
import { Header } from "../components/layout/Header";

export default function VideoPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <MessageForm messageType="Video" />
      </main>
    </>
  );
}
