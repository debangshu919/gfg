import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-background z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Ready to converse with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">your data?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Join analysts and product managers who are getting instant answers without writing a single line of SQL.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="h-16 px-10 text-xl w-full sm:w-auto shadow-2xl shadow-blue-500/25 bg-primary hover:scale-105 transition-all duration-300">
            Go to Dashboard <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
