"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form);
    setForm({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <main className="pb-20 pt-10 sm:pb-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <SectionHeading
              eyebrow="Contact"
              title="Let’s talk about your next travel experience"
              text="Use the form to reach out for inquiries, bookings, partnerships, or support."
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <input
                className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <input
              className="mt-5 h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            <textarea
              className="mt-5 min-h-[160px] w-full rounded-2xl border border-black/10 px-4 py-4 outline-none"
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <div className="mt-6">
              <Button type="submit">Send message</Button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}