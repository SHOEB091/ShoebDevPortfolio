import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Basic in-memory per-IP rate limiting (best-effort on serverless)
type Counter = { count: number; resetAt: number };
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5);
const ipCounters = new Map<string, Counter>();

function getClientIp(req: NextApiRequest): string {
  const xfwd = (req.headers['x-forwarded-for'] || '') as string;
  if (xfwd) return xfwd.split(',')[0].trim();
  // Fallbacks
  return (req.socket.remoteAddress || 'unknown');
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounters.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounters.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function isOriginAllowed(req: NextApiRequest): boolean {
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (allowed.length === 0) return true; // If not configured, allow all
  const origin = ((req.headers.origin || req.headers.referer || '') as string).toLowerCase();
  return allowed.some(a => origin.includes(a));
}

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!isOriginAllowed(req)) {
    return res.status(403).json({ message: 'Forbidden: invalid origin' });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  const parseResult = ContactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parseResult.error.flatten() });
  }
  const { name, email, message } = parseResult.data;

  // Use environment variables for security
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // your gmail address
      pass: process.env.GMAIL_PASS, // your gmail app password
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // or any recipient
      subject: `Portfolio Contact Form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
