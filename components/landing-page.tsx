'use client';

import { motion } from 'framer-motion';
import { ArrowRight, FileText, Share2, Layers, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen font-sans overflow-hidden relative selection:bg-[var(--color-marker-red)] selection:text-white">
      
      {/* Floating Header */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
        <div className="hand-card px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-[4px_4px_0_0_#2d2d2d] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-marker-red)] text-white rounded-full flex items-center justify-center font-heading font-bold text-lg border-2 border-[var(--color-pencil)] rotate-3">
              QF
            </div>
            <span className="text-3xl font-heading font-bold tracking-tight">QuoteFlow</span>
          </div>
          <Link href="/builder">
            <button className="hand-button h-11 px-6 text-sm text-center !py-0">
              Enter Workspace
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Window */}
      <main className="relative z-10 pt-40 pb-20 px-6 w-full max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Hero Section */}
        <section className="relative p-1 lg:p-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Decorative arrow */}
            <div className="hidden md:block absolute -left-32 top-20 rotate-12 opacity-80">
              <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="var(--color-pen-blue)" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round">
                <path d="M10 70 Q 30 10 90 20" />
                <path d="M70 10 L 95 22 L 80 40" strokeDasharray="none" />
              </svg>
            </div>
            
            <div className="inline-block bg-[var(--color-postit)] px-4 py-1 border-2 border-[var(--color-pencil)] -rotate-3 mb-8 font-heading text-xl shadow-[4px_4px_0_0_#2d2d2d]" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
              The Frictionless Deal 📌
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading mb-8 text-balance leading-tight max-w-5xl mx-auto">
              Stop sending PDFs. <br />
              <span className="text-[var(--color-marker-red)] relative inline-block">
                Start closing deals
                <div className="absolute -bottom-4 left-0 w-full h-4 scribble-underline"></div>
              </span>
              <span className="inline-block rotate-12 origin-bottom-left text-[var(--color-pen-blue)] ml-2">!</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-pencil)] mb-12 text-balance max-w-3xl mx-auto leading-relaxed opacity-90">
              Your clients don't want to read a static 10-page document. They want to see exactly what they're paying for, adjust the scope, and agree on the spot. QuoteFlow turns rigid quotes into living, interactive agreements.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/builder">
                <button className="hand-button hover:-rotate-2 text-xl px-12 py-4 flex items-center justify-center">
                  Build a Proposal Now 
                  <ArrowRight className="ml-3 w-6 h-6 stroke-[3px]" />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* The Problem / Purpose */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hand-card p-10 md:p-14 flex flex-col justify-center rotate-1"
          >
            <div className="deco-tape"></div>
            <h2 className="text-4xl lg:text-5xl font-heading mb-6">Traditional quotes kill momentum.</h2>
            <p className="text-xl leading-relaxed mb-6 opacity-80">
              When you send a PDF, you lose control. If the client wants to change the quantity or remove a feature, they have to email you back, you have to revise the file, and the deal loses urgency.
            </p>
            <p className="text-xl leading-relaxed opacity-80">
              QuoteFlow changes the psychology of the sale. By giving the client an interactive interface, you invite them to collaboratively shape the scope instead of fighting over a fixed price.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hand-card-alt p-10 md:p-14 flex items-center justify-center -rotate-1 bg-[var(--color-paper)]"
          >
            <div className="deco-tack"></div>
            <div className="space-y-6 w-full mt-4">
              {[
                { title: "Static PDFs", desc: "Take hours to revise", color: "text-[var(--color-pencil)] border-dashed" },
                { title: "Email Chains", desc: "Lose context and urgency", color: "text-[var(--color-pencil)] border-dashed" },
                { title: "QuoteFlow", desc: "Close instantly via live negotiation", color: "text-white bg-[var(--color-marker-red)] border-solid font-bold transform hover:rotate-2 shadow-[4px_4px_0_0_#2d2d2d]" }
              ].map((item, i) => (
                <div key={i} className={`p-6 border-2 border-[var(--color-pencil)] transition-transform duration-200 flex justify-between items-center ${item.color} bg-white`} style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
                  <span className="font-heading text-2xl">{item.title}</span>
                  <span className="text-lg hidden sm:block">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="hand-card p-12 lg:p-20 mt-12 bg-[var(--color-postit)]">
          <div className="text-center mb-16 relative">
            <h2 className="text-5xl md:text-6xl font-heading mb-6 relative inline-block">
              The Architecture of Agreement
              <div className="absolute -bottom-2 left-10 right-10 h-3 scribble-underline"></div>
            </h2>
            <p className="text-2xl opacity-80 max-w-2xl mx-auto mt-6">
              A psychological workflow designed to guide your client toward a definitive "Yes."
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Layers,
                title: "1. Build the Blueprint",
                desc: "Map out products and services visually. Define what is fixed and what is negotiable.",
                rotate: "-rotate-2"
              },
              {
                icon: Share2,
                title: "2. Share the Link",
                desc: "Send a stunning, immersive link. No logins, no friction. Just your premium brand.",
                rotate: "rotate-1"
              },
              {
                icon: CheckCircle,
                title: "3. Seal the Deal",
                desc: "The client adjusts quantities to fit their budget and agrees instantly on the page.",
                rotate: "-rotate-1"
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
                  className={`bg-white border-[3px] border-[var(--color-pencil)] p-8 text-center flex flex-col items-center hover:shadow-[6px_6px_0_0_#2d2d2d] transition-all duration-300 hover:-translate-y-2 ${step.rotate}`}
                  style={{ borderRadius: '255px 25px 225px 25px / 25px 225px 25px 255px', boxShadow: '4px 4px 0 0 var(--color-pencil)' }}
                >
                  <div className="w-20 h-20 border-[3px] border-[var(--color-pencil)] border-dashed rounded-full flex items-center justify-center mb-6 text-[var(--color-marker-red)] -rotate-6">
                    <Icon className="w-10 h-10 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-3xl font-heading mb-4">{step.title}</h3>
                  <p className="text-xl opacity-90 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="hand-card p-16 text-center mt-12 bg-[var(--color-pen-blue)] text-white">
          <div className="deco-tape bg-white/30 backdrop-blur-md"></div>
          <h2 className="text-5xl font-heading mb-6">Stop waiting. Start closing.</h2>
          <p className="text-2xl opacity-90 mb-12 max-w-2xl mx-auto">Step into the workspace and architect your first dynamic proposal today.</p>
          <Link href="/builder">
            <button className="hand-button hover:-rotate-2 text-2xl px-12 py-5 shadow-[4px_4px_0_0_#fff]">
              Open the Workspace
            </button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 pb-6 font-heading text-xl opacity-60">
          <p>© 2026 QuoteFlow. Crafted with ☕ and <span className="text-[var(--color-marker-red)]">♥</span></p>
        </footer>

      </main>
    </div>
  );
}
