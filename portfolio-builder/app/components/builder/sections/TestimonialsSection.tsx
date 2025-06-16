'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';

interface Testimonial {
  id: string;
  name: string;
  feedback: string;
  company: string;
  role: string;
}

interface TestimonialsSectionProps {
  onUpdate: (data: { testimonials: Testimonial[] }) => void;
  initialData?: { testimonials: Testimonial[] };
}

export const TestimonialsSection = ({ onUpdate, initialData }: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData?.testimonials || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Ensure at least one testimonial form is open by default
  useEffect(() => {
    if (testimonials.length === 0) {
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        name: '',
        feedback: '',
        company: '',
        role: '',
      };
      setTestimonials([newTestimonial]);
      onUpdate({ testimonials: [newTestimonial] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      feedback: '',
      company: '',
      role: '',
    };
    setTestimonials([...testimonials, newTestimonial]);
    onUpdate({ testimonials: [...testimonials, newTestimonial] });
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
    );
    setTestimonials(updatedTestimonials);
    onUpdate({ testimonials: updatedTestimonials });
  };

  const handleRemoveTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    setTestimonials(updatedTestimonials);
    onUpdate({ testimonials: updatedTestimonials });
  };

  const handleGenerateAI = async (id: string) => {
    setIsGenerating(true);
    try {
      const testimonial = testimonials.find(testimonial => testimonial.id === id);
      if (testimonial) {
        const input = `Name: ${testimonial.name}\nRole: ${testimonial.role}\nCompany: ${testimonial.company}\nFeedback: ${testimonial.feedback}`;
        const generated = await generateContent('testimonials', input);
        setAiGenerated(generated);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const extractMeaningfulContent = (aiContent: string) => {
    // Remove <think>...</think> blocks
    let content = aiContent.replace(/<think>[\s\S]*?<\/think>/g, '');
    return content.trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
        <Button onClick={handleAddTestimonial}>Add Testimonial</Button>
      </div>

      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="p-4 border border-border rounded-lg space-y-4 bg-background text-foreground"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => handleUpdateTestimonial(testimonial.id, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Company</label>
              <input
                type="text"
                value={testimonial.company}
                onChange={(e) => handleUpdateTestimonial(testimonial.id, 'company', e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Role</label>
            <input
              type="text"
              value={testimonial.role}
              onChange={(e) => handleUpdateTestimonial(testimonial.id, 'role', e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Feedback</label>
            <textarea
              value={testimonial.feedback}
              onChange={(e) => handleUpdateTestimonial(testimonial.id, 'feedback', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => handleGenerateAI(testimonial.id)}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
            <Button
              onClick={() => handleRemoveTestimonial(testimonial.id)}
              variant="danger"
            >
              Remove
            </Button>
          </div>
          {aiGenerated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-background text-foreground rounded-lg border border-border"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-foreground">AI Generated Feedback</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(extractMeaningfulContent(aiGenerated))}
                >
                  Copy
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-foreground/80 mb-2">{extractMeaningfulContent(aiGenerated)}</pre>
              <Button
                onClick={() => {
                  // Save to section logic
                  setAiGenerated('');
                }}
                variant="secondary"
                size="sm"
              >
                Save to Section
              </Button>
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
}; 