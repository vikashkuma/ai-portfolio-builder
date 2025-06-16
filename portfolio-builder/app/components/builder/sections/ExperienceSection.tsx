'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaRobot } from 'react-icons/fa';

interface ExperienceSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const ExperienceSection = ({ onUpdate, initialData }: ExperienceSectionProps) => {
  const [experiences, setExperiences] = useState<Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>>(initialData?.experiences || [{ title: '', company: '', startDate: '', endDate: '', description: '' }]);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Pure validation function
  const validateExperienceEntryPure = useCallback((entry: typeof experiences[0], index: number) => {
    const newErrors: { [key: string]: string | null } = {};

    if (!entry.title.trim()) {
      newErrors[`experience-${index}-title`] = 'Job Title is required.';
    } else if (entry.title.length < 3) {
      newErrors[`experience-${index}-title`] = 'Job Title must be at least 3 characters long.';
    } else if (entry.title.length > 100) {
      newErrors[`experience-${index}-title`] = 'Job Title must not exceed 100 characters.';
    }

    if (!entry.company.trim()) {
      newErrors[`experience-${index}-company`] = 'Company is required.';
    } else if (entry.company.length < 2) {
      newErrors[`experience-${index}-company`] = 'Company name must be at least 2 characters long.';
    } else if (entry.company.length > 100) {
      newErrors[`experience-${index}-company`] = 'Company name must not exceed 100 characters.';
    }

    if (!entry.startDate.trim()) {
      newErrors[`experience-${index}-startDate`] = 'Start Date is required.';
    } else {
      const dateRegex = /^\d{4}(-\d{2})?$/;
      if (!dateRegex.test(entry.startDate)) {
        newErrors[`experience-${index}-startDate`] = 'Date must be in YYYY or YYYY-MM format.';
      }
    }

    if (!entry.endDate.trim()) {
      newErrors[`experience-${index}-endDate`] = 'End Date is required.';
    } else if (entry.endDate.toLowerCase() !== 'present') {
      const dateRegex = /^\d{4}(-\d{2})?$/;
      if (!dateRegex.test(entry.endDate)) {
        newErrors[`experience-${index}-endDate`] = 'Date must be in YYYY or YYYY-MM format, or \'Present\'.';
      }
    }

    if (entry.startDate && entry.endDate && entry.endDate.toLowerCase() !== 'present') {
      const startYear = parseInt(entry.startDate.split('-')[0], 10);
      const startMonth = entry.startDate.split('-')[1] ? parseInt(entry.startDate.split('-')[1], 10) - 1 : 0;
      const start = new Date(startYear, startMonth, 1);

      const endYear = parseInt(entry.endDate.split('-')[0], 10);
      const endMonth = entry.endDate.split('-')[1] ? parseInt(entry.endDate.split('-')[1], 10) - 1 : 0;
      const end = new Date(endYear, endMonth, 1);

      if (start.getTime() > end.getTime()) {
        newErrors[`experience-${index}-endDate`] = 'End Date cannot be before Start Date.';
      }
    }

    if (!entry.description.trim()) {
      newErrors[`experience-${index}-description`] = 'Description is required.';
    } else if (entry.description.length < 50) {
      newErrors[`experience-${index}-description`] = 'Description must be at least 50 characters long.';
    } else if (entry.description.length > 1000) {
      newErrors[`experience-${index}-description`] = 'Description must not exceed 1000 characters.';
    }

    return newErrors;
  }, []);

  const validateAllExperiences = useCallback((experiencesList: typeof experiences) => {
    let allErrors: { [key: string]: string | null } = {};
    experiencesList.forEach((experience, index) => {
      allErrors = { ...allErrors, ...validateExperienceEntryPure(experience, index) };
    });
    return allErrors;
  }, [validateExperienceEntryPure]);

  // Effect to re-validate all experiences whenever they change
  useEffect(() => {
    const newErrors = validateAllExperiences(experiences);
    setErrors(newErrors);
  }, [experiences, validateAllExperiences]);

  const handleExperienceChange = (index: number, field: keyof typeof experiences[0], value: string) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setExperiences(newExperiences);
    setTouched(prev => ({ ...prev, [`experience-${index}-${field}`]: true }));
    onUpdate({ experiences: newExperiences });
  };

  const handleAddExperience = () => {
    const newExperiences = [...experiences, { title: '', company: '', startDate: '', endDate: '', description: '' }];
    setExperiences(newExperiences);
    onUpdate({ experiences: newExperiences });
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    onUpdate({ experiences: newExperiences });

    // Clear touched state for the removed entry
    const newTouched = { ...touched };
    Object.keys(newTouched).forEach(key => {
      const parts = key.split('-');
      if (parts[0] === 'experience' && parseInt(parts[1], 10) === index) {
        delete newTouched[key];
      }
    });

    // Re-index touched state for remaining entries
    const reIndexedTouched: { [key: string]: boolean } = {};
    Object.keys(newTouched).forEach(key => {
      const parts = key.split('-');
      const entryIndex = parseInt(parts[1], 10);
      if (entryIndex > index) {
        parts[1] = (entryIndex - 1).toString();
        reIndexedTouched[parts.join('-')] = newTouched[key];
      } else {
        reIndexedTouched[key] = newTouched[key];
      }
    });
    setTouched(reIndexedTouched);
  };

  const handleGenerateAI = async (index: number) => {
    const entryErrors = validateExperienceEntryPure(experiences[index], index);
    if (Object.keys(entryErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...entryErrors }));
      (Object.keys(experiences[index]) as Array<keyof typeof experiences[0]>).forEach(key => setTouched(prev => ({ ...prev, [`experience-${index}-${key}`]: true })));
      toast.error('Please fill in all required fields for this experience before generating AI content.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI content...');
    try {
      const currentExperience = experiences[index];
      const input = `Title: ${currentExperience.title}\nCompany: ${currentExperience.company}\nStart Date: ${currentExperience.startDate}\nEnd Date: ${currentExperience.endDate}\nDescription: ${currentExperience.description}`;
      const generated = await generateContent('experience', input);
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

  const handleBlur = (index: number, field: keyof typeof experiences[0]) => {
    setTouched(prev => ({ ...prev, [`experience-${index}-${field}`]: true }));
  };

  const hasErrors = Object.values(errors).some(error => error !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      {experiences.map((experience, index) => (
        <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
          <div>
            <label htmlFor={`title-${index}`} className="block text-sm font-medium text-foreground">
              Job Title
            </label>
            <input
              type="text"
              id={`title-${index}`}
              value={experience.title}
              onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
              onBlur={() => handleBlur(index, 'title')}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${touched[`experience-${index}-title`] && errors[`experience-${index}-title`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
              `}
            />
            {touched[`experience-${index}-title`] && errors[`experience-${index}-title`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`experience-${index}-title`]}</p>
            )}
          </div>

          <div>
            <label htmlFor={`company-${index}`} className="block text-sm font-medium text-foreground">
              Company
            </label>
            <input
              type="text"
              id={`company-${index}`}
              value={experience.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              onBlur={() => handleBlur(index, 'company')}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${touched[`experience-${index}-company`] && errors[`experience-${index}-company`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
              `}
            />
            {touched[`experience-${index}-company`] && errors[`experience-${index}-company`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`experience-${index}-company`]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-foreground">
                Start Date (YYYY or YYYY-MM)
              </label>
              <input
                type="text"
                id={`startDate-${index}`}
                value={experience.startDate}
                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                onBlur={() => handleBlur(index, 'startDate')}
                placeholder="2020-01"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`experience-${index}-startDate`] && errors[`experience-${index}-startDate`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`experience-${index}-startDate`] && errors[`experience-${index}-startDate`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`experience-${index}-startDate`]}</p>
              )}
            </div>
            <div>
              <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-foreground">
                End Date (YYYY or YYYY-MM or 'Present')
              </label>
              <input
                type="text"
                id={`endDate-${index}`}
                value={experience.endDate}
                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                onBlur={() => handleBlur(index, 'endDate')}
                placeholder="2023-12 or Present"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`experience-${index}-endDate`] && errors[`experience-${index}-endDate`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`experience-${index}-endDate`] && errors[`experience-${index}-endDate`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`experience-${index}-endDate`]}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`description-${index}`} className="block text-sm font-medium text-foreground">
              Description
              <span className="text-sm text-foreground/60 ml-2">
                ({experience.description.length}/1000 characters)
              </span>
            </label>
            <textarea
              id={`description-${index}`}
              value={experience.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              onBlur={() => handleBlur(index, 'description')}
              rows={5}
              maxLength={1000}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                ${touched[`experience-${index}-description`] && errors[`experience-${index}-description`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
              `}
            />
            {touched[`experience-${index}-description`] && errors[`experience-${index}-description`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`experience-${index}-description`]}</p>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handleGenerateAI(index)}
              disabled={isGenerating}
            >
              <FaRobot className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Description with AI'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveExperience(index)}
              disabled={experiences.length === 1}
            >
              <FaTrash className="h-4 w-4 mr-2" />
              Remove Experience
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
                  const newExperiences = [...experiences];
                  newExperiences[index] = { ...newExperiences[index], description: contentToSave };
                  setExperiences(newExperiences);
                  onUpdate({ experiences: newExperiences });
                  setAiGenerated(''); // Clear AI generated content after saving
                  toast.success('AI generated description saved to section!');
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

      <div className="flex justify-between mt-8">
        <Button
          onClick={handleAddExperience}
          variant="outline"
          size="sm"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
    </motion.div>
  );
}; 