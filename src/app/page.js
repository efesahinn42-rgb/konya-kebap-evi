'use client';
import { useState } from 'react';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import ReservationSection from '@/components/ReservationSection';
import GallerySection from '@/components/GallerySection';
import AwardsSection from '@/components/AwardsSection';
import PressSection from '@/components/PressSection';
import SocialResponsibilitySection from '@/components/SocialResponsibilitySection';
import HRSection from '@/components/HRSection';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import MenuModal from '@/components/MenuModal';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Expose function globally for MenuSidebar to call
  if (typeof window !== 'undefined') {
    window.openMenuModal = () => setIsMenuOpen(true);
  }

  return (
    <main className="w-full overflow-x-hidden">
      <MobileNav />
      <HeroSlider />
      <AboutSection />
      <ReservationSection />
      <GallerySection />
      <AwardsSection />
      <PressSection />
      <SocialResponsibilitySection />
      <HRSection />
      <Footer />
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </main>
  );
}

