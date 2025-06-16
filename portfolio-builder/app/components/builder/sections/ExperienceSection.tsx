'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface ExperienceSectionProps {
  onUpdate: (data: { experience: Experience[] }) => void;
  initialData?: { experience: Experience[] };
}

export const ExperienceSection = ({ onUpdate, initialData }: ExperienceSectionProps) => {
  const [experiences, setExperiences] = useState<Experience[]>(
    initialData?.experience || []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Ensure at least one experience form is open by default
  useEffect(() => {
    if (experiences.length === 0) {
      const newExperience: Experience = {
        id: Date.now().toString(),
        title: '',
        company: '',
        period: '',
        description: '',
      };
      setExperiences([newExperience]);
      onUpdate({ experience: [newExperience] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      period: '',
      description: '',
    };
    setExperiences([...experiences, newExperience]);
    onUpdate({ experience: [...experiences, newExperience] });
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: string) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
    onUpdate({ experience: updatedExperiences });
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    onUpdate({ experience: updatedExperiences });
  };

  const handleGenerateAI = async (id: string) => {
    setIsGenerating(true);
    try {
      const experience = experiences.find(exp => exp.id === id);
      if (experience) {
        const input = `Title: ${experience.title}\nCompany: ${experience.company}\nPeriod: ${experience.period}\nDescription: ${experience.description}`;
        const generated = await generateContent('experience', input);
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
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        <Button onClick={handleAddExperience}>Add Experience</Button>
      </div>

      {experiences.map((experience) => (
        <div
          key={experience.id}
          className="p-4 border border-gray-200 rounded-lg space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Job Title
              </label>
              <input
                type="text"
                value={experience.title}
                onChange={(e) =>
                  handleUpdateExperience(experience.id, 'title', e.target.value)
                }
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Company
              </label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) =>
                  handleUpdateExperience(experience.id, 'company', e.target.value)
                }
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Period
            </label>
            <input
              type="text"
              value={experience.period}
              onChange={(e) =>
                handleUpdateExperience(experience.id, 'period', e.target.value)
              }
              className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={experience.description}
              onChange={(e) =>
                handleUpdateExperience(experience.id, 'description', e.target.value)
              }
              rows={4}
              className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => handleGenerateAI(experience.id)}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
            <Button
              onClick={() => handleRemoveExperience(experience.id)}
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
                  // For experience, you may want to update the description field
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