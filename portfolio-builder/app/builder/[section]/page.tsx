import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { StepTracker } from '../../components/builder/StepTracker';
import { AboutSection } from '../../components/builder/sections/AboutSection';
import { ExperienceSection } from '../../components/builder/sections/ExperienceSection';
import { EducationSection } from '../../components/builder/sections/EducationSection';
import { SkillsSection } from '../../components/builder/sections/SkillsSection';
import { AwardsSection } from '../../components/builder/sections/AwardsSection';
import { TestimonialsSection } from '../../components/builder/sections/TestimonialsSection';
import { ContactSection } from '../../components/builder/sections/ContactSection';
import { ThemeSelector } from '../../components/builder/ThemeSelector';
import { PortfolioPreview } from '../../components/builder/PortfolioPreview';
import Button from '../../components/ui/Button';

const steps = [
  { id: 1, key: 'about', title: 'About', description: 'Basic information' },
  { id: 2, key: 'experience', title: 'Experience', description: 'Work history' },
  { id: 3, key: 'education', title: 'Education', description: 'Academic background' },
  { id: 4, key: 'skills', title: 'Skills', description: 'Technical abilities' },
  { id: 5, key: 'awards', title: 'Awards', description: 'Achievements' },
  { id: 6, key: 'testimonials', title: 'Testimonials', description: 'Client feedback' },
  { id: 7, key: 'contact', title: 'Contact', description: 'Contact information' },
  { id: 8, key: 'theme', title: 'Theme', description: 'Choose your theme' },
  { id: 9, key: 'preview', title: 'Preview', description: 'Preview your portfolio' },
];

const sectionComponents: Record<string, any> = {
  about: AboutSection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  awards: AwardsSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

export default function BuilderSectionPage() {
  const router = useRouter();
  const params = useParams();
  const section = params?.section as string;
  const stepIndex = steps.findIndex((s) => s.key === section);
  const { portfolio, updatePortfolio } = usePortfolioStore();
  const theme = portfolio?.theme || 'light';
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showDeviceModal, setShowDeviceModal] = useState(section === 'preview');

  useEffect(() => {
    if (!section || (!(section in sectionComponents) && section !== 'theme' && section !== 'preview')) {
      router.replace('/builder/about');
    }
    // Always open the modal when entering preview step
    if (section === 'preview') {
      setShowDeviceModal(true);
    }
  }, [section, router]);

  const handleUpdate = (data: any) => {
    updatePortfolio(data);
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      router.push(`/builder/${steps[stepIndex + 1].key}`);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      router.push(`/builder/${steps[stepIndex - 1].key}`);
    }
  };

  let SectionComponent = null;
  if (section in sectionComponents) {
    SectionComponent = sectionComponents[section];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Tracker always at the top */}
        <StepTracker steps={steps} currentStep={stepIndex + 1} />
        {/* Preview always below steps except in preview step */}
        {section !== 'preview' && (
          <div className="my-8">
            <PortfolioPreview portfolioData={portfolio || {}} theme={theme} />
          </div>
        )}
        {/* Section Form, Theme Selector, or Preview Tab */}
        <div className="bg-white rounded-lg shadow p-6">
          {section === 'theme' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Choose Your Theme</h2>
              <ThemeSelector
                onSelect={(theme: string) => updatePortfolio({ theme })}
                selectedTheme={theme}
              />
              <div className="mt-8 flex justify-end">
                <Button onClick={handleBack} variant="outline" className="mr-2">Back</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          ) : section === 'preview' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Preview Your Portfolio</h2>
              <Button onClick={() => setShowDeviceModal(true)} variant="outline" className="mb-4">Change Device</Button>
              {showDeviceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 relative">
                    <h3 className="text-lg font-semibold mb-4">Select Device View</h3>
                    <div className="flex gap-4 mb-6">
                      <Button
                        variant={device === 'desktop' ? 'primary' : 'outline'}
                        onClick={() => setDevice('desktop')}
                      >
                        Desktop
                      </Button>
                      <Button
                        variant={device === 'tablet' ? 'primary' : 'outline'}
                        onClick={() => setDevice('tablet')}
                      >
                        Tablet
                      </Button>
                      <Button
                        variant={device === 'mobile' ? 'primary' : 'outline'}
                        onClick={() => setDevice('mobile')}
                      >
                        Mobile
                      </Button>
                    </div>
                    <Button onClick={() => setShowDeviceModal(false)} className="w-full">Close</Button>
                  </div>
                </div>
              )}
              {!showDeviceModal && (
                <>
                  <PortfolioPreview portfolioData={portfolio || {}} theme={theme} device={device} />
                  <div className="mt-8 flex justify-between">
                    <Button onClick={handleBack} variant="outline">Back</Button>
                    <Button onClick={handleNext}>Finish</Button>
                  </div>
                </>
              )}
            </div>
          ) : SectionComponent ? (
            <>
              <SectionComponent onUpdate={handleUpdate} initialData={portfolio || {}} />
              <div className="mt-8 flex justify-between">
                <Button
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  variant="outline"
                  className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400"
                >
                  Back
                </Button>
                <Button onClick={handleNext} className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400">
                  Next
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
} 