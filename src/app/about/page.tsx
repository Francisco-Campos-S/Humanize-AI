import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Check, Clock, Sparkles, Wand2 } from "lucide-react";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <main className="flex-grow container mt-5 mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center space-y-6">
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-blue-600 px-4 py-2">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Company Overview
                </Badge>
              </div>
              
              <CardTitle className="text-6xl font-bold tracking-tight text-gray-900 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
                Humanize AI
              </CardTitle>
              
              <CardDescription className="text-xl text-gray-700 max-w-2xl mx-auto">
                Bridging the gap between artificial intelligence and human authenticity through advanced content transformation
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 px-8">
              <p className="text-gray-800 text-lg leading-relaxed">
                Our platform transforms AI-generated content into natural, human-like text that maintains the original meaning while adding authentic emotional depth and personal nuance. We combine cutting-edge machine learning with linguistic expertise to deliver content that resonates with human readers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Innovation
                  </h3>
                  <p className="text-gray-700">
                    Continuously evolving algorithms with regular updates from our research team
                  </p>
                </div>
                
                <div className="p-6 bg-purple-50/50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Accuracy
                  </h3>
                  <p className="text-gray-700">
                    99.2% precision in content analysis with detailed transformation reports
                  </p>
                </div>
                
                <div className="p-6 bg-pink-50/50 rounded-xl border border-pink-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Efficiency
                  </h3>
                  <p className="text-gray-700">
                    Real-time processing with enterprise-grade performance and reliability
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/how-it-works">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Wand2 className="mr-2 h-4 w-4" />
                      How It Works
                    </Button>
                  </a>
                  <a href="/features">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <BotMessageSquare className="mr-2 h-4 w-4" />
                      Explore Features
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
};

export default page;
