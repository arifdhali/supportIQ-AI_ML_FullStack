import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MessageSquare, Route, Mail, Wrench, CreditCard, KeyRound, LifeBuoy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/Motion";

const STEPS = [
  { icon: MessageSquare, title: "Tell us what happened", text: "Send a message through the contact form with as much detail as you can." },
  { icon: Route, title: "We route it to the right team", text: "Your request becomes a ticket and goes to the department best placed to help." },
  { icon: Mail, title: "Get a reply", text: "Our support team replies to the email address you provided." },
];
const TEAMS = [
  { icon: Wrench, name: "Technical Support", text: "Bugs, errors and product problems" },
  { icon: CreditCard, name: "Billing and Payments", text: "Invoices, payments and refunds" },
  { icon: KeyRound, name: "Account and Access", text: "Login and account questions" },
  { icon: LifeBuoy, name: "General Support", text: "Anything else" },
];
const FAQ = [
  ["What happens after I send a message?", "We create a support ticket with a reference number and send it to the right team."],
  ["What should I include?", "Describe the problem, what you expected to happen, and any error messages you saw."],
  ["Do I need an account?", "No. Just fill in the contact form with your name and email address."],
];

export default function HomePage() {
  return (
    <>
      <section className="bg-linear-to-b from-accent/60 to-background">
        <FadeIn className="mx-auto max-w-3xl px-4 py-24 text-center">
          <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-primary">Customer support</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Smarter support. Faster resolution.</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Tell us what you need and our support team will take it from there.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/contact" className={buttonVariants({ size: "lg" })}>Contact us</Link>
            <a href="#how" className={buttonVariants({ size: "lg", variant: "outline" })}>How it works</a>
          </div>
        </FadeIn>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full gap-2 p-6">
                <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary"><Icon className="size-5" /></div>
                <h3 className="mt-2 font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">Our support teams</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map(({ icon: Icon, name, text }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}>
              <Card className="h-full gap-1 p-5"><Icon className="mb-2 size-5 text-primary" /><div className="font-medium">{name}</div><p className="text-sm text-muted-foreground">{text}</p></Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-20">
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
          {FAQ.map(([q, a], i) => (
            <AccordionItem key={q} value={`faq-${i}`}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center"><Link to="/contact" className={buttonVariants()}>Still need help? Contact us</Link></div>
      </section>
    </>
  );
}
