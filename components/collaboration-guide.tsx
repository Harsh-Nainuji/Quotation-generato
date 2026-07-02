'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Link as LinkIcon,
  QrCode,
  FileText,
  Users,
  Clock,
} from 'lucide-react';

const collaborationSteps = [
  {
    id: 1,
    title: 'You Create the Proposal',
    icon: FileText,
    steps: [
      'Enter client details and company information',
      'Add line items with descriptions and pricing',
      'Set tax rate and payment terms',
      'Review the professional preview',
    ],
  },
  {
    id: 2,
    title: 'You Share with Client',
    icon: LinkIcon,
    steps: [
      'Click "Share" to copy shareable link',
      'Share via email, message, or QR code',
      'No login or account required for clients',
      'Link opens in their browser instantly',
    ],
  },
  {
    id: 3,
    title: 'Client Reviews Proposal',
    icon: Users,
    steps: [
      'Client receives your shared proposal link',
      'They can view it on any device',
      'See your company logo and branding',
      'Review all pricing and terms clearly',
    ],
  },
  {
    id: 4,
    title: 'Client Shares Feedback',
    icon: MessageCircle,
    steps: [
      'Client can save or print the proposal',
      'Share feedback through email or messaging',
      'Discuss any changes or modifications',
      'Request different pricing or terms',
    ],
  },
  {
    id: 5,
    title: 'You Update & Resend',
    icon: Clock,
    steps: [
      'Go back to your builder and modify details',
      'Update pricing, line items, or terms',
      'Generate a new share link',
      'Send updated version to client',
    ],
  },
];

export function CollaborationGuide() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="w-full py-16 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            How Client Negotiation Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            QuoteFlow makes it easy for you and your clients to collaborate. Here&apos;s how the
            process flows:
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {collaborationSteps.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                className="flex gap-6 md:gap-8"
                variants={itemVariants}
              >
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  {index < collaborationSteps.length - 1 && (
                    <motion.div
                      className="w-1 bg-gradient-to-b from-blue-500 to-transparent"
                      style={{ height: '120px' }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <motion.h3
                    className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
                    whileHover={{ x: 5 }}
                  >
                    {section.title}
                  </motion.h3>

                  <motion.div
                    className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6"
                    whileHover={{ y: -2 }}
                  >
                    <ul className="space-y-3">
                      {section.steps.map((step, stepIndex) => (
                        <motion.li
                          key={stepIndex}
                          className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: stepIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {step}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Key Features Box */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 border border-blue-200 dark:border-blue-800 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Why QuoteFlow for Collaboration?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'No Account Required',
                description:
                  'Clients don\'t need to sign up or create an account—they just click the link and view',
              },
              {
                title: 'Mobile Friendly',
                description:
                  'Clients can view proposals on any device, any browser—works on phone, tablet, or desktop',
              },
              {
                title: 'Instant Updates',
                description:
                  'Make changes and resend a new link instantly—no syncing delays or version confusion',
              },
              {
                title: 'Clear Communication',
                description:
                  'Use standard messaging or email to discuss changes—no need for a third-party platform',
              },
              {
                title: 'Professional Presentation',
                description:
                  'Your branded proposal impresses clients with a polished, professional look',
              },
              {
                title: 'Easy Iteration',
                description:
                  'Quickly adjust pricing, terms, or details without rebuilding from scratch',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="text-slate-700 dark:text-slate-300"
                whileHover={{ x: 5 }}
              >
                <p className="font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </p>
                <p className="text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
