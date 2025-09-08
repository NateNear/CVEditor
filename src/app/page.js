"use client"

import Link from "next/link"
import { ArrowRight, FileText, Users, Zap, Shield } from "lucide-react"
import ShaderBackground from "@/components/shaderBackground"

export default function HomePage() {
  return (
    <ShaderBackground>
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full z-30 px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-white/80" />
          <span className="text-sm font-light tracking-wide">Resume Editor</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="px-5 py-2 rounded-full bg-transparent border border-white/30 text-xs text-white/80 transition hover:bg-white/10 hover:border-white/50"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-medium transition hover:bg-white/90"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex items-center justify-center min-h-screen px-6">
        <div className="max-w-2xl text-center z-20">
          <div
            className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-6 relative"
            style={{ filter: "url(#glass-effect)" }}
          >
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            <span className="text-white/90 text-xs font-light relative z-10">
              ✨ Build Professional Resumes
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl tracking-tight font-light mb-4">
            <span className="font-medium italic">Build</span> Your Perfect{" "}
            <span className="text-indigo-300">Resume</span>
          </h1>
          <p className="text-sm md:text-base font-light text-white/70 mb-6 leading-relaxed">
            Create professional resumes in minutes with our intuitive editor.
            Choose from elegant templates, customize every section, and export
            instantly to PDF.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/auth/signup"
              className="px-8 py-3 rounded-full bg-white text-black text-xs font-medium transition hover:bg-white/90 flex items-center"
            >
              Build Your Resume
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white/80 text-xs transition hover:bg-white/10 hover:border-white/50"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Background Illustration */}
        <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center opacity-20">
          <FileText className="w-72 h-72 text-white" />
        </div>
      </header>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-sm font-light tracking-widest text-indigo-300 uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl font-light tracking-tight">
            Everything you need to create the perfect resume
          </p>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto text-sm leading-relaxed">
            Our resume builder is designed to help you create professional
            resumes quickly and easily.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {[
            {
              icon: FileText,
              title: "Drag & Drop Editor",
              desc: "Easily reorder sections and customize your resume layout with our intuitive drag-and-drop interface.",
            },
            {
              icon: Zap,
              title: "Live Preview",
              desc: "See your changes in real-time as you edit. No more guessing how your resume will look.",
            },
            {
              icon: Users,
              title: "Easy Sharing",
              desc: "Share your resume with a simple link or export to PDF for offline use.",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              desc: "Your data is secure and private. You control who can see your resume.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition"
              style={{ filter: "url(#glass-effect)" }}
            >
              <div className="flex items-center gap-4 mb-3">
                <Icon className="w-6 h-6 text-indigo-300" />
                <h3 className="text-lg font-light">{title}</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-light mb-4">
          <span className="font-medium italic">Ready</span> to build your resume?
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Join thousands of professionals who have already created their perfect
          resume.
        </p>
        <Link
          href="/auth/signup"
          className="px-8 py-3 rounded-full bg-white text-black text-xs font-medium transition hover:bg-white/90"
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white/40 text-xs">
        &copy; 2024 Resume Editor. All rights reserved.
      </footer>

      {/* SVG Filters for Glass Effect */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
        </defs>
      </svg>
    </div>
    </ShaderBackground>
  )
}
