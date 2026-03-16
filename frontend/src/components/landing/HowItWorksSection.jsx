import React from 'react';
import { motion } from 'framer-motion';
import { Database, MessageCircle, BarChart2 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect Database",
      description: "Securely link your SQL database using standard connection strings. We encrypt everything.",
      icon: <Database className="w-6 h-6 text-primary-foreground" />
    },
    {
      num: "02",
      title: "Ask Questions",
      description: "Type your query in plain English. For example: 'What were the total sales last month?'",
      icon: <MessageCircle className="w-6 h-6 text-primary-foreground" />
    },
    {
      num: "03",
      title: "Get Answers & Charts",
      description: "PromptBI instantly writes the SQL, fetches the data, and visualizes the results as a chart.",
      icon: <BarChart2 className="w-6 h-6 text-primary-foreground" />
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground flex justify-center items-center">
             Three simple steps to unlock your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[28%] left-[16%] right-[16%] h-0.5 bg-border -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-muted-foreground/50 text-xl">{step.num}</span> 
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
