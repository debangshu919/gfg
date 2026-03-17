import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart3, Database, Sparkles, MessageSquare } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 z-0 bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
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
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 border-0">
              Start Chatting with Data
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto backdrop-blur-sm border-border hover:bg-muted transition-all duration-300">
            View Live Demo
          </Button>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.5 }}
           className="mt-20 relative max-w-5xl mx-auto"
        >
           <div className="rounded-2xl border border-white/10 bg-card/30 backdrop-blur-md text-card-foreground shadow-2xl overflow-hidden hidden sm:flex h-[450px] ring-1 ring-white/20">
              {/* Mock Chat Interface */}
              <div className="w-1/3 border-r border-white/10 bg-muted/20 p-6">
                <div className="flex items-center gap-2 mb-8 font-semibold text-lg">
                   <div className="p-2 bg-blue-500/10 rounded-lg">
                     <Database className="w-5 h-5 text-blue-500" />
                   </div>
                   Sales DB
                </div>
                <div className="space-y-4">
                   <div className="h-2 rounded bg-muted/40 w-full"></div>
                   <div className="h-2 rounded bg-muted/40 w-[80%]"></div>
                   <div className="mt-8 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center px-4 text-sm font-medium">Show revenue by region</div>
                </div>
              </div>
              <div className="w-2/3 p-8 bg-background/20 flex flex-col">
                <div className="mb-6 flex items-center gap-2">
                   <div className="p-2 bg-indigo-500/10 rounded-lg">
                     <Sparkles className="w-5 h-5 text-indigo-500" />
                   </div>
                   <span className="font-semibold text-lg">AI Analyst</span>
                </div>
                <div className="bg-muted/40 backdrop-blur-sm p-4 rounded-2xl text-sm mb-8 inline-block w-fit border border-white/5">
                  Analyzing data... Here's the revenue breakdown by region for 2024.
                </div>
                {/* Mock Chart */}
                <div className="flex-1 flex items-end gap-6 px-6 pb-4">
                  <div className="w-1/4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl h-[40%] shadow-lg shadow-blue-500/20"></div>
                  <div className="w-1/4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl h-[70%] shadow-lg shadow-blue-500/20"></div>
                  <div className="w-1/4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl h-[55%] shadow-lg shadow-blue-500/20"></div>
                  <div className="w-1/4 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl h-[95%] shadow-lg shadow-indigo-500/20"></div>
                </div>
              </div>
           </div>
           {/* Decorative elements */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
}
