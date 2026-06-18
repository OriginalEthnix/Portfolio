'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/stores/useStudioStore';
import HeroSection from './HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificatesSection from './sections/CertificatesSection';
import ExperienceSection from './sections/ExperienceSection';
import LeadershipSection from './sections/LeadershipSection';
import SkillsSection from './sections/SkillsSection';
import HobbiesSection from './sections/HobbiesSection';
import MusicSection from './sections/MusicSection';
import ContactSection from './sections/ContactSection';
import AchievementsSection from './sections/AchievementsSection';

const sections = {
  hero: HeroSection,
  projects: ProjectsSection,
  certificates: CertificatesSection,
  experience: ExperienceSection,
  leadership: LeadershipSection,
  skills: SkillsSection,
  hobbies: HobbiesSection,
  music: MusicSection,
  achievements: AchievementsSection,
  contact: ContactSection,
};

export default function WorkspaceLayout() {
  const activeSection = useStudioStore((s) => s.activeSection);
  const isBrowserOpen = useStudioStore((s) => s.isBrowserOpen);

  const CurrentSection = sections[activeSection] || HeroSection;

  return (
    <div className="flex-1 flex overflow-hidden relative" style={{ background: '#05070D' }}>
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="flex-1 p-2 md:p-4 overflow-hidden flex justify-center">
        <motion.div
          layout
          className="w-full max-w-[1400px] h-full rounded-xl border flex flex-col overflow-hidden relative bg-[#0a0f1a]"
          style={{
            borderColor: '#1e293b',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <CurrentSection />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
