import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart3, Database, Sparkles, MessageSquare } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 z-0 bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex justify-center mb-6"
        >
          <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Introducing PromptBI
          </Badge>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl font-extrabold text-5xl md:text-7xl tracking-tight mb-8"
        >
          Talk to your data. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            Get answers in seconds.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-xl text-muted-foreground mb-10"
        >
          PromptBI transforms natural language into complex SQL queries and beautiful charts instantly. Perfect for data analysts and non-technical users alike.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-blue-500/20">
              Start Chatting with Data
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
            View Live Demo
          </Button>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.5 }}
           className="mt-20 relative max-w-5xl mx-auto"
        >
           <div className="rounded-2xl border bg-card text-card-foreground shadow-2xl overflow-hidden hidden sm:flex h-[400px]">
              {/* Mock Chat Interface */}
              <div className="w-1/3 border-r bg-muted/30 p-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6 font-semibold">
                   <Database className="w-5 h-5 text-blue-500" />
                   Sales Database
                </div>
                <div className="space-y-3">
                   <div className="h-10 rounded bg-background w-full"></div>
                   <div className="h-10 rounded bg-background w-[80%]"></div>
                   <div className="h-10 rounded bg-primary/20 text-primary flex items-center px-3 text-sm font-medium">Show me Q3 Revenue</div>
                </div>
              </div>
              <div className="w-2/3 p-6 bg-background flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                   <MessageSquare className="w-5 h-5 text-indigo-500" />
                   <span className="font-semibold text-lg">AI Analyst</span>
                </div>
                <div className="bg-muted p-4 rounded-xl text-sm mb-6 inline-block w-fit">
                  Sure! Here is the revenue breakdown for Q3, showing a 15% increase compared to Q2.
                </div>
                {/* Mock Chart */}
                <div className="flex-1 flex items-end gap-4 px-4 pb-4">
                  <div className="w-1/4 bg-blue-500 rounded-t-md h-[40%]"></div>
                  <div className="w-1/4 bg-blue-500 rounded-t-md h-[70%]"></div>
                  <div className="w-1/4 bg-blue-500 rounded-t-md h-[55%]"></div>
                  <div className="w-1/4 bg-indigo-500 rounded-t-md h-[95%]"></div>
                </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
