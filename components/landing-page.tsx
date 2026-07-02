'use client';

import { motion } from 'framer-motion';
import { ArrowRight, FileText, Share2, Layers, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas-light)] text-[var(--color-text-primary)] font-sans overflow-hidden relative">
      
      {/* Atmospheric Lighting Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent-jade)]/20 blur-[180px] mix-blend-normal animate-atmos-1"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-[var(--color-accent-moonstone)]/15 blur-[180px] mix-blend-normal animate-atmos-2"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[var(--color-accent-glacier)]/20 blur-[150px] mix-blend-normal animate-atmos-1" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Header */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
        <div className="glass-panel px-6 py-3 rounded-full flex items-center justify-between w-full max-w-5xl shadow-glass border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent-highlight)] text-white rounded-full flex items-center justify-center font-heading font-bold text-lg shadow-inner">
              QF
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">QuoteFlow</span>
          </div>
          <Link href="/builder">
            <button className="glass-button-primary h-11 px-6 text-sm">
              Enter Workspace
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Window */}
      <main className="relative z-10 pt-32 pb-20 px-6 w-full max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Hero Section */}
        <section className="glass-card p-12 lg:p-20 flex flex-col items-center text-center animate-glass-float">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="glass-badge mb-8 inline-block text-[var(--color-accent-highlight)]">The Frictionless Deal</div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 text-balance tracking-tight leading-[1.05]">
              Stop sending PDFs. <br />
              <span className="text-[var(--color-accent-highlight)]">Start closing deals.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-12 text-balance max-w-3xl mx-auto font-medium leading-relaxed">
              Your clients don't want to read a static 10-page document. They want to see exactly what they're paying for, adjust the scope, and agree on the spot. QuoteFlow turns rigid quotes into living, interactive agreements.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/builder">
                <button className="glass-button-primary h-16 px-10 text-lg w-full sm:w-auto">
                  Build a Proposal Now <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* The Problem / Purpose */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-12 flex flex-col justify-center"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Traditional quotes kill momentum.</h2>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-medium mb-6">
              When you send a PDF, you lose control. If the client wants to change the quantity or remove a feature, they have to email you back, you have to revise the file, and the deal loses urgency.
            </p>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-medium">
              QuoteFlow changes the psychology of the sale. By giving the client an interactive interface, you invite them to collaboratively shape the scope instead of fighting over a fixed price.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 flex items-center justify-center bg-[var(--color-accent-jade)]/10"
          >
            <div className="space-y-6 w-full">
              {[
                { title: "Static PDFs", desc: "Take hours to revise", color: "text-red-500" },
                { title: "Email Chains", desc: "Lose context and urgency", color: "text-orange-500" },
                { title: "QuoteFlow", desc: "Close instantly via live negotiation", color: "text-[var(--color-accent-highlight)] font-bold text-xl" }
              ].map((item, i) => (
                <div key={i} className="glass-secondary p-6 rounded-[24px] flex justify-between items-center">
                  <span className="font-heading font-semibold text-lg">{item.title}</span>
                  <span className={`text-sm ${item.color}`}>{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="glass-card p-12 lg:p-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">The Architecture of Agreement</h2>
            <p className="text-xl text-[var(--color-text-secondary)] font-medium max-w-2xl mx-auto">
              A psychological workflow designed to guide your client toward a definitive "Yes."
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "1. Build the Blueprint",
                desc: "Map out products and services visually. Define what is fixed and what is negotiable.",
              },
              {
                icon: Share2,
                title: "2. Share the Glass",
                desc: "Send a stunning, immersive link. No logins, no friction. Just your premium brand.",
              },
              {
                icon: CheckCircle,
                title: "3. Seal the Deal",
                desc: "The client adjusts quantities to fit their budget and agrees instantly on the page.",
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="glass-panel p-8 rounded-[32px] text-center flex flex-col items-center hover:shadow-glass-hover transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-full glass-secondary flex items-center justify-center mb-6 text-[var(--color-accent-highlight)]">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4">{step.title}</h3>
                  <p className="text-[var(--color-text-secondary)] font-medium leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="glass-panel p-16 text-center mt-12 bg-gradient-to-br from-[var(--color-accent-highlight)]/10 to-[var(--color-accent-jade)]/10">
          <h2 className="text-4xl font-heading font-bold mb-6 text-[var(--color-text-primary)]">Stop waiting. Start closing.</h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-10 font-medium">Step into the workspace and architect your first dynamic proposal.</p>
          <Link href="/builder">
            <button className="glass-button-primary h-16 px-12 text-lg mx-auto">
              Open the Workspace
            </button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 pb-6 text-[var(--color-text-muted)] font-medium text-sm">
          <p>© 2026 QuoteFlow. Crafted for the modern professional.</p>
        </footer>

      </main>
    </div>
  );
}
