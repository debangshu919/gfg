import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                 PromptBI
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Making data accessible for everyone. Transform natural language to SQL and charts in seconds.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PromptBI (GFG Analytics). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
