import { MessageForm } from "../components/MessageForm";
import { Header } from "../components/layout/Header";

export default function FilePage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <MessageForm messageType="File" />
      </main>
    </>
  );
}
