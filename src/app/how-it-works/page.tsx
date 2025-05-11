"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BotMessageSquare, Wand2, FileText, RefreshCw, Shield, UserCheck } from 'lucide-react'

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Input Your Content",
      description: "Simply paste your text content into our intuitive interface. We support various content types and lengths."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "AI Detection",
      description: "Our advanced algorithms analyze the content to detect AI-generated patterns and characteristics."
    },
    {
      icon: <Wand2 className="h-8 w-8 text-primary" />,
      title: "Smart Analysis",
      description: "We evaluate the content's structure, tone, and patterns to determine if humanization is needed."
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-primary" />,
      title: "Content Transformation",
      description: "If needed, our AI transforms the content while preserving the original message and intent."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "Human-like Output",
      description: "Receive your transformed content that sounds natural and authentically human."
    }
  ]

  return (
    <div className="min-h-screen container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BotMessageSquare className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            How It Works
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform AI-generated content into natural, human-like text in just a few simple steps
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={index} className="relative hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                {step.icon}
                <CardTitle className="text-2xl">{step.title}</CardTitle>
              </div>
              <CardDescription className="text-base">{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Step {index + 1}</span>
                <span className="text-primary">→</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default HowItWorksPage