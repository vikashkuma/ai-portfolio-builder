'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';

interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
}

interface AwardsSectionProps {
  onUpdate: (data: { awards: Award[] }) => void;
  initialData?: { awards: Award[] };
}

export const AwardsSection = ({ onUpdate, initialData }: AwardsSectionProps) => {
  const [awards, setAwards] = useState<Award[]>(initialData?.awards || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Ensure at least one award form is open by default
  useEffect(() => {
    if (awards.length === 0) {
      const newAward: Award = {
        id: Date.now().toString(),
        title: '',
        issuer: '',
        year: '',
        description: '',
      };
      setAwards([newAward]);
      onUpdate({ awards: [newAward] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      year: '',
      description: '',
    };
    setAwards([...awards, newAward]);
    onUpdate({ awards: [...awards, newAward] });
  };

  const handleUpdateAward = (id: string, field: keyof Award, value: string) => {
    const updatedAwards = awards.map(award =>
      award.id === id ? { ...award, [field]: value } : award
    );
    setAwards(updatedAwards);
    onUpdate({ awards: updatedAwards });
  };

  const handleRemoveAward = (id: string) => {
    const updatedAwards = awards.filter(award => award.id !== id);
    setAwards(updatedAwards);
    onUpdate({ awards: updatedAwards });
  };

  const handleGenerateAI = async (id: string) => {
    setIsGenerating(true);
    try {
      const award = awards.find(award => award.id === id);
      if (award) {
        const input = `Title: ${award.title}\nIssuer: ${award.issuer}\nYear: ${award.year}\nDescription: ${award.description}`;
        const generated = await generateContent('awards', input);
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
        <h2 className="text-2xl font-bold text-gray-900">Awards & Recognitions</h2>
        <Button onClick={handleAddAward}>Add Award</Button>
      </div>

      {awards.map((award) => (
        <div
          key={award.id}
          className="p-4 border border-gray-200 rounded-lg space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={award.title}
                onChange={(e) => handleUpdateAward(award.id, 'title', e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Issuer</label>
              <input
                type="text"
                value={award.issuer}
                onChange={(e) => handleUpdateAward(award.id, 'issuer', e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Year</label>
            <input
              type="text"
              value={award.year}
              onChange={(e) => handleUpdateAward(award.id, 'year', e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={award.description}
              onChange={(e) => handleUpdateAward(award.id, 'description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => handleGenerateAI(award.id)}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
            <Button
              onClick={() => handleRemoveAward(award.id)}
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
                <h4 className="text-sm font-medium text-foreground">AI Generated Description</h4>
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