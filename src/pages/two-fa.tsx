import { MessageForm } from "../components/MessageForm";
import { Header } from "../components/layout/Header";

export default function TwoFAPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <MessageForm messageType="TwoFA" />
      </main>
    </>
  );
}
