import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Mail, Instagram, Facebook, MessageCircle, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import data from '../../data/data.json';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = data.siteConfig.email?.trim();

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the email is still visible/selectable.
    }
  };

  const channels = [
    { label: 'Instagram', handle: '@andres_fonollosaa', href: data.siteConfig.social.instagram, Icon: Instagram },
    { label: 'Facebook', handle: 'Chubekhon', href: data.siteConfig.social.facebook, Icon: Facebook },
    { label: 'Zalo', handle: '0703 023 595', href: data.siteConfig.social.zalo, Icon: MessageCircle },
  ];

  return (
    <section
      id="contact"
      className="py-32 relative overflow-hidden"
      style={{ background: 'var(--color-space-near)' }}
    >
      {/* Contact atmosphere — accent glow from below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 120%, rgba(255,61,0,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 100% 40% at 50% 0%,  rgba(80,120,255,0.04) 0%, transparent 60%)
          `,
        }}
      />
      {/* Noise for texture consistency */}
      <div className="absolute inset-0 env-noise pointer-events-none" style={{ opacity: 0.02 }} />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {data.siteConfig.availability && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 mb-8 glass-light px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent ambient-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-foreground/80">
              {data.siteConfig.availability}
            </span>
          </motion.div>
        )}

        {/* Heading + intro sit side by side on desktop, so the section reads
            as one deliberate header instead of a headline followed by a
            disconnected paragraph further down the page. */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <SectionHeading title="Contact" subtitle="Let's Create Something Together" index={4} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm lg:text-right lg:pt-2 shrink-0"
          >
            Have a project in mind? Let's talk about your vision — reach me on whichever platform is easiest for you.
          </motion.p>
        </div>

        {/* Primary CTA — bordered card so the email reads as one deliberate
            block rather than a loose full-bleed text row. */}
        {email && (
          <motion.button
            type="button"
            onClick={copyEmail}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full text-left mb-6 cursor-pointer border border-border/60 glass-light hover:glass depth-1 px-6 py-8 md:px-10 md:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-colors duration-300"
            aria-label="Copy email address"
          >
            <div className="flex items-center gap-5 min-w-0">
              <span className="hidden sm:flex items-center justify-center w-12 h-12 shrink-0 rounded-full border border-border/60 text-accent group-hover:border-accent/50 transition-colors duration-300">
                <Mail size={20} strokeWidth={1.5} />
              </span>
              <span
                className="block text-2xl sm:text-4xl md:text-5xl font-display tracking-tight break-all text-foreground group-hover:text-accent transition-colors duration-300"
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
              >
                {email}
              </span>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {copied ? (
                <>
                  <Check size={14} className="text-accent" /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Click to copy
                </>
              )}
            </span>
          </motion.button>
        )}

        {/* Secondary channels — a card grid instead of stacked outline
            buttons, so socials feel like peers of the email card rather
            than an afterthought list underneath it. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channels.map(({ label, handle, href, Icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between gap-8 border border-border/60 glass-light hover:glass depth-1 px-6 py-6 transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-foreground/70 group-hover:text-accent group-hover:border-accent/50 transition-colors duration-300">
                  <Icon size={17} strokeWidth={1.5} />
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-muted-foreground/50 group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-sm tracking-widest uppercase text-foreground group-hover:text-accent transition-colors duration-300">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground truncate">{handle}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}