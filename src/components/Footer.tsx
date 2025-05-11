import { BotMessageSquare } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-background/50 border-t border-accent/10 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BotMessageSquare className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <a href="/">AIGuard</a>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform AI content into natural, human-like text while preserving the original message.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#docs" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-accent/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by <a href="https://github.com/prathamesh-mutkure" className="text-primary hover:text-accent transition-colors">Pratham Darji</a>
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AIGuard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer