'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';

interface ContactSectionProps {
  onUpdate: (data: { contact: any }) => void;
  initialData?: { contact: any };
}

export const ContactSection = ({ onUpdate, initialData }: ContactSectionProps) => {
  const [formData, setFormData] = useState({
    email: initialData?.contact?.email || '',
    phone: initialData?.contact?.phone || '',
    linkedin: initialData?.contact?.linkedin || '',
    website: initialData?.contact?.website || '',
    intro: initialData?.contact?.intro || '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Ensure at least one contact form is open by default
  useEffect(() => {
    if (!formData.email && !formData.phone && !formData.linkedin && !formData.website && !formData.intro) {
      setFormData({ email: '', phone: '', linkedin: '', website: '', intro: '' });
      onUpdate({ contact: { email: '', phone: '', linkedin: '', website: '', intro: '' } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    onUpdate({ contact: { ...formData, [name]: value } });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const input = `Email: ${formData.email}\nPhone: ${formData.phone}\nLinkedIn: ${formData.linkedin}\nWebsite: ${formData.website}\nIntro: ${formData.intro}`;
      const generated = await generateContent('contact', input);
      setAiGenerated(generated);
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
      <div>
        <label className="block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">LinkedIn</label>
        <input
          type="text"
          name="linkedin"
          id="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Website</label>
        <input
          type="text"
          name="website"
          id="website"
          value={formData.website}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Intro/Summary</label>
        <textarea
          name="intro"
          id="intro"
          rows={3}
          value={formData.intro}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="ml-3"
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
      {aiGenerated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-background text-foreground rounded-lg border border-border"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-foreground">AI Generated Contact</h4>
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
    </motion.div>
  );
}; 