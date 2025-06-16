'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import { FaPlus, FaRobot, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface SkillsSectionProps {
  onUpdate: (data: { skills: string[] }) => void;
  initialData?: { skills: string[] };
}

// Extraction logic for skills
const extractSkills = (aiContent: string): string[] => {
  let content = aiContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  content = content.replace(/^#+.*$/gm, '');
  content = content.replace(/^[\-*\s]*([A-Za-z\s]+:)[\s]*$/gm, '');
  const lines = content
    .split(/\n|,/)
    .map(line => line.replace(/^[-*\s]+/, '').trim())
    .filter(line =>
      line &&
      !line.match(/^#+/) &&
      !line.match(/:$/) &&
      line.toLowerCase() !== 'skills'
    );
  return Array.from(new Set(lines));
};

export const SkillsSection = ({ onUpdate, initialData }: SkillsSectionProps) => {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillError, setNewSkillError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState<string[]>([]);
  const [domain, setDomain] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      setNewSkillError('Skill name cannot be empty.');
      toast.error('Skill name cannot be empty.');
      return;
    }
    if (skills.includes(newSkill.trim())) {
      setNewSkillError('Skill already exists.');
      toast.error('Skill already exists.');
      return;
    }
    setNewSkillError(null);
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    onUpdate({ skills: updatedSkills });
    setNewSkill('');
    toast.success(`'${newSkill.trim()}' added to your skills.`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    onUpdate({ skills: updatedSkills });
    toast.success(`'${skillToRemove}' removed from your skills.`);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const aiToastId = toast.loading('Generating AI content...');
    try {
      const input = skills.join(', ');
      const generated = await generateContent('skills', input);
      const suggestedSkills = extractSkills(generated);
      setAiGenerated(suggestedSkills);
      toast.success('AI content generated successfully!', { id: aiToastId });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content.', { id: aiToastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchSkills = async () => {
    setSuggestedSkills([]);
    setError('');
    setDomainError(null);
    if (!domain.trim()) {
      setDomainError('Please enter a domain to get suggestions.');
      toast.error('Please enter a domain to get suggestions.');
      return;
    }

    setIsLoading(true);
    const skillsToastId = toast.loading('Fetching AI skill suggestions...');
    try {
      const aiResponse = await generateContent('skills', `${domain} related skills`);
      const skills = extractSkills(aiResponse);
      setSuggestedSkills(skills);
      if (skills.length === 0) {
        setError('No skills found for this domain. Try a different keyword.');
        toast.error('No skills found for this domain.', { id: skillsToastId });
      } else {
        toast.success('Skill suggestions loaded!', { id: skillsToastId });
      }
    } catch (err) {
      setSuggestedSkills([]);
      setError('Failed to fetch skills. Please try again.');
      toast.error('Failed to fetch skills. Please try again.', { id: skillsToastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    setDomainError(null);
  };

  const handleDomainKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchSkills();
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const addSelectedSkillsToPortfolio = () => {
    if (selectedSkills.length === 0) {
      toast.error('No skills selected to add.');
      return;
    }
    const updatedSkills = Array.from(new Set([...skills, ...selectedSkills]));
    setSkills(updatedSkills);
    onUpdate({ skills: updatedSkills });
    setSelectedSkills([]);
    toast.success(`${selectedSkills.length} selected skills added to your portfolio.`);
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-background rounded-2xl shadow-lg p-8 max-w-2xl mx-auto space-y-8 border border-border"
    >
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <span>Skills</span>
        </h2>
      </div>
      {/* Skill Input */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <FaPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                if (newSkillError) setNewSkillError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill and press Enter"
              className={`w-full pl-10 pr-20 py-2 rounded-full border shadow-sm focus:border-blue-500 focus:ring-blue-500 transition
                ${newSkillError ? 'border-red-500 bg-red-550/10 text-red-700' : 'border-border bg-background text-foreground'}
              `}
            />
            <Button
              onClick={handleAddSkill}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ minWidth: 60 }}
            >
              Add
            </Button>
          </div>
        </div>
        {newSkillError && <p className="text-red-500 text-sm mt-1">{newSkillError}</p>}
        {/* Current Skills */}
        <div className="flex flex-wrap gap-2">
          {skills.filter(skill => skill.trim() !== '').map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm transition-all"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </motion.span>
          ))}
        </div>
      </div>
      {/* Domain Input */}
      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-foreground mb-1">
          Enter your technology domain (e.g., Frontend, Backend, DevOps, AI, Data Science, Business)
        </label>
        <div className="flex gap-2 items-end">
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={handleDomainInput}
            onKeyDown={handleDomainKeyDown}
            placeholder="Type a tech or business domain..."
            className={`w-full rounded-full border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2
              ${domainError ? 'border-red-500 bg-red-550/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={fetchSkills}
            disabled={isLoading || !domain.trim()}
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-1"><FaRobot className="animate-spin" /> Loading...</span>
            ) : 'Get Suggestions'}
          </button>
        </div>
        {domainError && <p className="text-red-500 text-sm mt-1">{domainError}</p>}
        <p className="text-xs text-foreground/60 mt-1">
          Type a tech or business domain like 'Frontend', 'Backend', 'AI', or 'Business' to get a list of relevant skills. Click on the skill chips to select them.
        </p>
      </div>
      {/* AI-Powered Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2"
      >
        <div className="flex items-center gap-2 mb-2">
          <FaRobot className="text-blue-500" />
          <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">AI Suggestions</span>
          {suggestedSkills.length > 0 && (
            <Button
              size="xs"
              variant="outline"
              className="ml-2 px-2 py-0.5 rounded-full border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={addSelectedSkillsToPortfolio}
            >
              Add All
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-blue-500"><FaRobot className="animate-spin" /> Loading skills...</div>
        ) : error ? (
          <p className="text-red-500 text-sm italic">{error}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {suggestedSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <motion.button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-1.5 rounded-full shadow-sm border transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium flex items-center gap-1
                      ${selected
                        ? 'bg-blue-600 text-white border-blue-700 scale-105'
                        : 'bg-background text-foreground border-border hover:bg-blue-50'}
                    `}
                    aria-pressed={selected}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {skill}
                    {selected && <FaCheck className="text-white ml-1" />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Your Selected Skills</h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedSkills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm transition-all"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <Button
            onClick={addSelectedSkillsToPortfolio}
            className="mt-4 px-4 py-2 rounded-full bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Selected Skills
          </Button>
        </div>
      )}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => { /* Navigate back */ }}>Back</Button>
        <Button onClick={() => { /* Navigate next */ }}>Next</Button>
      </div>
    </motion.div>
  );
}; 