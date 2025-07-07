"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Shield, MessageSquare, Github } from "lucide-react";
import CheckLogo from "@/public/logo.png";

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI‑Powered Prioritization",
      description:
        "Your tasks get ranked by urgency so you always know what to tackle first.",
    },
    {
      icon: MessageSquare,
      title: "Context Capture",
      description:
        "Bring in notes, messages, or emails and let the AI pull out the key details.",
    },
    {
      icon: Zap,
      title: "Deadline Suggestions",
      description:
        "Get realistic deadlines based on how much you’ve got on your plate.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your data stays yours—secure, encrypted, and no funny business.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-radial from-cream-blush via-warm-beige to-dusty-rose">
      {/* Navigation */}
      <nav className="bg-cream-blush/90 backdrop-blur-sm border-b border-soft-mauve sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
              <Image src={CheckLogo} alt="Logo" width={16} height={16} />
            </div>
            <div className="flex flex-col ">
              <span className="text-2xl font-bold text-deep-plum">Smart Todo AI</span>
              <span className="text-xs font-light text-rich-mauve">Your Smart Todo Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/register">
              <Button
                variant="outline"
                className="
                  text-deep-plum 
                  border-deep-plum 
                  hover:bg-deep-plum 
                  hover:text-cream-blush 
                  transition
                "
              >
                Get Started
              </Button>
            </Link>
            <Link
              href="https://github.com/shk-khalid/NotSoSmart"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                className="
                  bg-gradient-to-r from-rich-mauve to-deep-plum 
                  text-cream-blush
                  hover:from-deep-plum 
                  hover:to-rich-mauve 
                  transition
                "
              >
                <Github className="mr-2 h-5 w-5" /> GitHub
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-deep-plum">
            Smart Todo List with AI
          </h1>
          <p className="text-xl text-rich-mauve leading-relaxed">
            A portfolio project that uses AI to prioritize tasks, suggest deadlines,
            and capture context—so you actually get things done.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-cream-blush">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-bold text-deep-plum text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Card
                key={i}
                className="bg-white/80 backdrop-blur-sm border-soft-mauve hover:shadow-md transition"
              >
                <CardHeader className="flex flex-col items-center pt-6">
                  <div className="w-12 h-12 mb-3 bg-gradient-to-br from-warm-beige to-dusty-rose rounded-md flex items-center justify-center">
                    <f.icon className="h-6 w-6 text-deep-plum" />
                  </div>
                  <CardTitle className="text-lg text-deep-plum">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rich-mauve">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-plum text-cream-blush py-8">
        <div className="container mx-auto px-6 lg:px-8 text-center space-y-2">
          <p>© 2025 Khalid Shaikh. Built as a portfolio project.</p>
          <Link href="mailto:shk.khalid18@gmail.com">
            <Button variant="outline" className="text-cream-blush mt-2">
              Got Questions? Email me
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
