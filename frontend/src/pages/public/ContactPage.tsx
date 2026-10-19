import { Clock, ShieldCheck } from "lucide-react";
import ContactForm from "@/components/shared/ContactForm";
import { FadeIn } from "@/components/shared/Motion";

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-[1fr_320px]">
      <div>
        <FadeIn className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
          <p className="mt-2 text-muted-foreground">Send us a message and our support team will get back to you by email.</p>
        </FadeIn>
        <ContactForm />
      </div>
      <FadeIn delay={0.15} className="space-y-4 text-sm lg:pt-24">
        <div className="flex gap-3"><Clock className="mt-0.5 size-5 shrink-0 text-primary" /><p><span className="font-medium">What happens next</span><br /><span className="text-muted-foreground">You will see a reference number right after sending. Keep it if you contact us again.</span></p></div>
        <div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><p><span className="font-medium">Your details are private</span><br /><span className="text-muted-foreground">We only use your name and email to respond to your request.</span></p></div>
      </FadeIn>
    </div>
  );
}
