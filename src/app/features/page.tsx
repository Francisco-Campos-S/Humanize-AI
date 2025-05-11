"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const features = [
  {
    title: "AI Content Detection",
    description: "Advanced algorithms to detect AI-generated content with high accuracy",
    badge: "Core Feature"
  },
  {
    title: "Content Humanization",
    description: "Transform robotic AI text into natural, human-like writing",
    badge: "Premium"
  },
  {
    title: "Real-time Analysis",
    description: "Get instant feedback on content authenticity",
    badge: "Fast"
  },
  {
    title: "Customizable Settings",
    description: "Tailor the AI detection and humanization settings to fit your needs",
    badge: "Flexible"
  },
  {
    title: "Comprehensive Reports",
    description: "Receive detailed reports on AI detection and content transformation",
    badge: "Insightful"
  },
  {
    title: "User-Friendly Interface",
    description: "Intuitive design for easy navigation and efficient workflow",
    badge: "Accessible"
  }
]

const FeaturePage = () => {
  return (
    <div className="min-h-screen mx-auto p-12">
      <div className="text-center mb-12 mt-5">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Powerful Features
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how our AI-powered tools can help you create more authentic and engaging content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
                <Badge variant="secondary">{feature.badge}</Badge>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Learn more →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FeaturePage