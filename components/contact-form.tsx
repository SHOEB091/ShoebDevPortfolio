"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `${form.subject}\n\n${form.message}`,
        }),
      })
      if (res.ok) {
        toast({
          title: 'Message Sent!',
          description: "Thank you for reaching out! I'll get back to you soon.",
          className:
            'bg-gradient-miami text-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-full data-[state=closed]:fade-out-80',
          duration: 5000,
        })
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again later.',
          className:
            'bg-gradient-to-r from-red-600 to-[var(--grad-to)] text-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-full data-[state=closed]:fade-out-80',
          duration: 5000,
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        className:
          'bg-gradient-to-r from-red-600 to-[var(--grad-to)] text-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-full data-[state=closed]:fade-out-80',
        duration: 5000,
      })
    }
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 transition-all duration-300 hover:border-primary/50">
        <div className="absolute -inset-1 bg-gradient-miami rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

        <div className="relative">
          <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                required
                className="bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-miami border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Sending...</>
              ) : (
                <>
                  Send Message <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
