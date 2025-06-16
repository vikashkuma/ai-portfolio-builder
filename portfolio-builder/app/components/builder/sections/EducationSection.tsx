'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import { Listbox } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DEGREE_OPTIONS = [
  'B.Sc.', 'B.A.', 'B.Tech', 'B.Com', 'M.Sc.', 'M.A.', 'MBA', 'M.Tech', 'PhD', 'Other'
];
const FIELD_OPTIONS = [
  'Computer Science', 'Business', 'Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology', 'Other'
];

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  period: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface EducationSectionProps {
  onUpdate: (data: { education: Education[] }) => void;
  initialData?: { education: Education[] };
}

export const EducationSection = ({ onUpdate, initialData }: EducationSectionProps) => {
  const [educations, setEducations] = useState<Education[]>(initialData?.education || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');
  const [aiLoading, setAiLoading] = useState<{ [id: string]: { degree: boolean; field: boolean; period: boolean } }>({});

  // Ensure at least one education form is open by default
  useEffect(() => {
    if (educations.length === 0) {
      const newEducation: Education = {
        id: Date.now().toString(),
        school: '',
        degree: '',
        field: '',
        period: '',
        description: '',
        startDate: null,
        endDate: null,
      };
      setEducations([newEducation]);
      onUpdate({ education: [newEducation] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      period: '',
      description: '',
      startDate: null,
      endDate: null,
    };
    setEducations([...educations, newEducation]);
    onUpdate({ education: [...educations, newEducation] });
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    const updatedEducations = educations.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducations(updatedEducations);
    onUpdate({ education: updatedEducations });
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducations = educations.filter(edu => edu.id !== id);
    setEducations(updatedEducations);
    onUpdate({ education: updatedEducations });
  };

  const handleGenerateAI = async (id: string) => {
    setIsGenerating(true);
    try {
      const education = educations.find(edu => edu.id === id);
      if (education) {
        const input = `School: ${education.school}\nDegree: ${education.degree}\nField: ${education.field}\nPeriod: ${education.period}\nDescription: ${education.description}`;
        const generated = await generateContent('education', input);
        setAiGenerated(generated);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Suggestion Handlers
  const handleAISuggestDegree = async (id: string) => {
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], degree: true } }));
    const education = educations.find(edu => edu.id === id);
    try {
      const prompt = `Suggest the most likely degree for a student at ${education?.school || 'this school'}. Only return the degree name.`;
      const aiResult = await generateContent('education', prompt);
      const suggestion = aiResult.split('\n')[0].trim();
      if (suggestion) handleUpdateEducation(id, 'degree', suggestion);
    } catch (e) {}
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], degree: false } }));
  };
  const handleAISuggestField = async (id: string) => {
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], field: true } }));
    const education = educations.find(edu => edu.id === id);
    try {
      const prompt = `Suggest the most likely field of study for a student with degree ${education?.degree || ''} at ${education?.school || 'this school'}. Only return the field name.`;
      const aiResult = await generateContent('education', prompt);
      const suggestion = aiResult.split('\n')[0].trim();
      if (suggestion) handleUpdateEducation(id, 'field', suggestion);
    } catch (e) {}
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], field: false } }));
  };
  const handleAISuggestPeriod = async (id: string) => {
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], period: true } }));
    const education = educations.find(edu => edu.id === id);
    try {
      const prompt = `Suggest the most likely start and end years for a ${education?.degree || ''} in ${education?.field || ''} at ${education?.school || 'this school'}. Format: YYYY-YYYY.`;
      const aiResult = await generateContent('education', prompt);
      const match = aiResult.match(/(\d{4})\D+(\d{4})/);
      if (match) {
        const start = new Date(Number(match[1]), 0, 1);
        const end = new Date(Number(match[2]), 0, 1);
        handleUpdateEducation(id, 'startDate', start);
        handleUpdateEducation(id, 'endDate', end);
      }
    } catch (e) {}
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], period: false } }));
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
        <h2 className="text-2xl font-bold text-foreground">Education</h2>
        <Button onClick={handleAddEducation}>Add Education</Button>
      </div>

      {educations.map((education, idx) => {
        const isOtherDegree = education.degree === 'Other';
        const isOtherField = education.field === 'Other';
        return (
          <div
            key={education.id}
            className="p-4 border border-border rounded-lg space-y-4 bg-background"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">School</label>
                <input
                  type="text"
                  value={education.school}
                  onChange={(e) => handleUpdateEducation(education.id, 'school', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground flex items-center gap-2">Degree
                  <Button size="xs" variant="outline" className="ml-2" onClick={() => handleAISuggestDegree(education.id)} disabled={aiLoading[education.id]?.degree}>
                    {aiLoading[education.id]?.degree ? 'Suggesting...' : 'Suggest with AI'}
                  </Button>
                </label>
                <Listbox
                  value={education.degree || DEGREE_OPTIONS[0]}
                  onChange={(val) => handleUpdateEducation(education.id, 'degree', val)}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="w-full rounded-md border border-border bg-background text-foreground py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      {education.degree || DEGREE_OPTIONS[0]}
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {DEGREE_OPTIONS.map((option) => (
                        <Listbox.Option
                          key={option}
                          value={option}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-foreground'}`
                          }
                        >
                          {option}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                {isOtherDegree && (
                  <input
                    type="text"
                    placeholder="Enter your degree"
                    value={education.degree !== 'Other' ? education.degree : ''}
                    onChange={(e) => handleUpdateEducation(education.id, 'degree', e.target.value)}
                    className="mt-2 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground flex items-center gap-2">Field of Study
                  <Button size="xs" variant="outline" className="ml-2" onClick={() => handleAISuggestField(education.id)} disabled={aiLoading[education.id]?.field}>
                    {aiLoading[education.id]?.field ? 'Suggesting...' : 'Suggest with AI'}
                  </Button>
                </label>
                <Listbox
                  value={education.field || FIELD_OPTIONS[0]}
                  onChange={(val) => handleUpdateEducation(education.id, 'field', val)}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="w-full rounded-md border border-border bg-background text-foreground py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      {education.field || FIELD_OPTIONS[0]}
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {FIELD_OPTIONS.map((option) => (
                        <Listbox.Option
                          key={option}
                          value={option}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-foreground'}`
                          }
                        >
                          {option}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                {isOtherField && (
                  <input
                    type="text"
                    placeholder="Enter your field of study"
                    value={education.field !== 'Other' ? education.field : ''}
                    onChange={(e) => handleUpdateEducation(education.id, 'field', e.target.value)}
                    className="mt-2 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground flex items-center gap-2">Period
                  <Button size="xs" variant="outline" className="ml-2" onClick={() => handleAISuggestPeriod(education.id)} disabled={aiLoading[education.id]?.period}>
                    {aiLoading[education.id]?.period ? 'Suggesting...' : 'Suggest with AI'}
                  </Button>
                </label>
                <div className="flex gap-2 items-center">
                  <DatePicker
                    selected={education.startDate}
                    onChange={(date) => handleUpdateEducation(education.id, 'startDate', date)}
                    dateFormat="yyyy"
                    showYearPicker
                    placeholderText="Start Year"
                    className="w-1/2 rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                  />
                  <span className="mx-1">-</span>
                  <DatePicker
                    selected={education.endDate}
                    onChange={(date) => handleUpdateEducation(education.id, 'endDate', date)}
                    dateFormat="yyyy"
                    showYearPicker
                    placeholderText="End Year"
                    className="w-1/2 rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Description</label>
              <textarea
                value={education.description}
                onChange={(e) => handleUpdateEducation(education.id, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => handleGenerateAI(education.id)}
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
              <Button
                onClick={() => handleRemoveEducation(education.id)}
                variant="danger"
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}; 