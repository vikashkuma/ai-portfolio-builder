'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import toast from 'react-hot-toast';

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
  const [nameError, setNameError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    onUpdate({ ...formData, [name]: value });

    if (name === 'name') setNameError(null);
    if (name === 'role') setRoleError(null);
    if (name === 'bio') setBioError(null);
  };

  const handleGenerateAI = async () => {
    if (!formData.name.trim()) {
      setNameError('Full Name cannot be empty.');
      toast.error('Full Name is required.');
      return;
    }
    if (!formData.role.trim()) {
      setRoleError('Professional Role cannot be empty.');
      toast.error('Professional Role is required.');
      return;
    }
    if (!formData.bio.trim()) {
      setBioError('Short Bio cannot be empty.');
      toast.error('Short Bio is required.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI content...');
    try {
      const input = `Name: ${formData.name}\nRole: ${formData.role}\nBio: ${formData.bio}`;
      const generated = await generateContent('about', input);
      setAiGenerated(generated);
      toast.success('AI content generated successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const extractMeaningfulContent = (aiContent: string) => {
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
          className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
            ${nameError ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
          `}
        />
        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
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
          className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
            ${roleError ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
          `}
        />
        {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
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
          className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
            ${bioError ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
          `}
        />
        {bioError && <p className="text-red-500 text-sm mt-1">{bioError}</p>}
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
              onClick={() => {
                navigator.clipboard.writeText(extractMeaningfulContent(aiGenerated));
                toast.success('AI generated content copied to clipboard!');
              }}
            >
              Copy
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-foreground/80 mb-2">{extractMeaningfulContent(aiGenerated)}</pre>
          <Button
            onClick={() => {
              const contentToSave = extractMeaningfulContent(aiGenerated);
              setFormData(prev => ({ ...prev, bio: contentToSave }));
              onUpdate({ ...formData, bio: contentToSave });
              toast.success('AI generated bio saved to section!');
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