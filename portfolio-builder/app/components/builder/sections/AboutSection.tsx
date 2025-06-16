'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';

interface AboutSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const AboutSection = ({ onUpdate, initialData }: AboutSectionProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    onUpdate({ ...formData, [name]: value });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const input = `Name: ${formData.name}\nRole: ${formData.role}\nBio: ${formData.bio}`;
      const generated = await generateContent('about', input);
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
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-foreground">
          Professional Role
        </label>
        <input
          type="text"
          name="role"
          id="role"
          value={formData.role}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-foreground">
          Short Bio
        </label>
        <textarea
          name="bio"
          id="bio"
          rows={4}
          value={formData.bio}
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
            <h4 className="text-sm font-medium text-foreground">AI Generated Bio</h4>
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
              setFormData(prev => ({ ...prev, bio: extractMeaningfulContent(aiGenerated) }));
              onUpdate({ ...formData, bio: extractMeaningfulContent(aiGenerated) });
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