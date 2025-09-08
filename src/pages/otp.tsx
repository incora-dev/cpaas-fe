import { MessageForm } from "../components/MessageForm";
import { Header } from "../components/layout/Header";

export default function OtpPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <MessageForm messageType="Otp" />
      </main>
    </>
  );
}
