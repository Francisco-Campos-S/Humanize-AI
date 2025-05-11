import { BotMessageSquare } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-lg border-b border-accent/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <BotMessageSquare className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                <a href="/">AIGuard</a>
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar