'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Edit, Share2, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Create',
    description: 'Fill in your proposal details',
    icon: Edit,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Customize',
    description: 'Add line items and pricing',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    title: 'Share',
    description: 'Get QR code or share link',
    icon: Share2,
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 4,
    title: 'Track',
    description: 'Client views and responds',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600',
  },
];

export function WorkflowFlowchart() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.3 },
    },
  };

  const pulseVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            How QuoteFlow Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Create professional proposals in minutes and share with clients instantly
          </p>
        </motion.div>

        {/* Desktop Flowchart */}
        <motion.div
          className="hidden md:flex items-center justify-between gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div key={step.id} className="flex items-center flex-1" variants={itemVariants}>
              {/* Step Card */}
              <motion.div
                className={`flex-1 bg-gradient-to-br ${step.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
                variants={pulseVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="flex items-center gap-3 mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <step.icon className="w-6 h-6" />
                  <h3 className="text-lg font-bold">{step.title}</h3>
                </motion.div>
                <p className="text-sm opacity-90">{step.description}</p>
              </motion.div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="px-2 flex justify-center"
                  variants={arrowVariants}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Flowchart - Vertical */}
        <motion.div
          className="md:hidden space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div key={step.id} className="relative" variants={itemVariants}>
              {/* Step Card */}
              <motion.div
                className={`bg-gradient-to-br ${step.color} rounded-lg p-6 text-white shadow-lg`}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="flex items-center gap-3 mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <step.icon className="w-6 h-6" />
                  <h3 className="text-lg font-bold">{step.title}</h3>
                </motion.div>
                <p className="text-sm opacity-90">{step.description}</p>
              </motion.div>

              {/* Vertical Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex justify-center py-2"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600 rotate-90" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className="mt-12 grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { title: 'Client Collaboration', description: 'Share via link, QR code, or email' },
            { title: 'Real-time Updates', description: 'Auto-save drafts as you type' },
            { title: 'Professional Output', description: 'Download PDF or print instantly' },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg text-center"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                {benefit.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
