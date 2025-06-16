"use client";

import { useState } from "react";
import BuilderForm from "./components/builder/BuilderForm";

export default function Home() {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <BuilderForm />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center mt-12 mb-4">Create a Professional Portfolio with AI</h1>
      <p className="text-lg text-center mb-8 max-w-2xl">
        Build a stunning portfolio in minutes with our AI-powered builder. Perfect for developers, designers, and professionals.
      </p>
      <button
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition mb-12"
        onClick={() => setShowBuilder(true)}
      >
        Create My Portfolio
      </button>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="rounded-lg shadow p-6 flex flex-col items-center bg-background text-foreground border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">AI-Powered Content</h3>
          <p className="text-center">Let our AI help you write compelling content for your portfolio sections.</p>
        </div>
        <div className="rounded-lg shadow p-6 flex flex-col items-center bg-background text-foreground border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Beautiful Templates</h3>
          <p className="text-center">Choose from a variety of professionally designed templates that showcase your work.</p>
        </div>
        <div className="rounded-lg shadow p-6 flex flex-col items-center bg-background text-foreground border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Easy Export</h3>
          <p className="text-center">Export your portfolio as a static site or deploy directly to your preferred platform.</p>
        </div>
      </section>
    </div>
  );
} 