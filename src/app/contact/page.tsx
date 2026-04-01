"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    toast.success("Message sent! We'll be in touch soon.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          OptiFlow
        </Link>
        <Button variant="ghost" render={<Link href="/login" />}>
          Sign In
        </Button>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-gray-600 mb-8">
          Interested in trying OptiFlow for your shop? Fill out the form below
          and we&apos;ll get back to you with a demo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Shop Name
            </label>
            <Input
              id="shopName"
              name="shopName"
              placeholder="Optique Centrale"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contact@yourshop.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your shop and what you're looking for..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </main>
    </div>
  );
}
