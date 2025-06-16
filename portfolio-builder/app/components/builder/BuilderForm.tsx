'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StepTracker } from './StepTracker';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SkillsSection } from './sections/SkillsSection';
import { PortfolioPreview } from './PortfolioPreview';
import Button from '../ui/Button';
import { EducationSection } from './sections/EducationSection';
import { AwardsSection } from './sections/AwardsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ContactSection } from './sections/ContactSection';

const steps = [
  { id: 1, title: 'About', description: 'Basic information' },
  { id: 2, title: 'Experience', description: 'Work history' },
  { id: 3, title: 'Education', description: 'Academic background' },
  { id: 4, title: 'Skills', description: 'Technical abilities' },
  { id: 5, title: 'Awards', description: 'Achievements' },
  { id: 6, title: 'Testimonials', description: 'Client feedback' },
  { id: 7, title: 'Contact', description: 'Contact information' },
];

export default function BuilderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioData, setPortfolioData] = useState({
    name: '',
    role: '',
    bio: '',
    experience: [],
    education: [],
    skills: [],
    awards: [],
    testimonials: [],
    contact: {},
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Lock scroll when modal is open (mobile)
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalOpen]);

  const handleUpdate = (sectionData: any) => {
    setPortfolioData(prev => ({
      ...prev,
      ...sectionData,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = () => {
    const jsonString = JSON.stringify(portfolioData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AboutSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      case 2:
        return (
          <ExperienceSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      case 3:
        return (
          <EducationSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      case 4:
        return (
          <SkillsSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      case 5:
        return (
          <AwardsSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      case 6:
        return (
          <TestimonialsSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      case 7:
        return (
          <ContactSection
            onUpdate={handleUpdate}
            initialData={portfolioData}
          />
        );
      default:
        return <div>Section coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[90vw] lg:max-w-7xl mx-auto mt-12 mb-16 p-4 sm:p-8 bg-background text-foreground rounded-xl shadow-lg">
        <StepTracker steps={steps} currentStep={currentStep} />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-start w-full">
          <div className="w-full min-h-[600px] flex flex-col justify-start">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {renderStepContent()}
            </motion.div>
            <div className="mt-8 flex justify-between">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400"
              >
                Back
              </Button>
              {currentStep === steps.length ? (
                <Button onClick={handleSave} className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400">Save Portfolio</Button>
              ) : (
                <Button onClick={handleNext} className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400">Next</Button>
              )}
            </div>
          </div>
          <div className="w-full min-h-[600px] flex flex-col justify-start">
            <div className="w-full">
              <PortfolioPreview portfolioData={portfolioData} theme="light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 