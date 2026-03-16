import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Ready to converse with your data?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl">
          Join thousands of analysts and product managers who are getting instant answers without writing a single line of SQL.
        </p>
        <Link to="/dashboard">
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto shadow-2xl">
            Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
