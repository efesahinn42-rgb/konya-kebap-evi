'use client';
import { useState, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { GallerySkeleton, MenuSkeleton } from '@/components/SkeletonLoader';
import { RestaurantStructuredData } from '@/components/StructuredData';

// Lazy load sections with dynamic imports
const HeroSlider = dynamic(() => import('@/components/HeroSlider'), {
  loading: () => <div className="h-screen bg-black animate-pulse" />,
});

const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  loading: () => <div className="min-h-screen bg-[#0a0a0a] animate-pulse" />,
});

const ReservationSection = dynamic(() => import('@/components/ReservationSection'), {
  loading: () => <div className="min-h-screen bg-[#0a0a0a] animate-pulse" />,
});

const GallerySection = dynamic(() => import('@/components/GallerySection'), {
  loading: () => (
    <section className="min-h-screen bg-[#0a0a0a] p-8">
      <GallerySkeleton />
    </section>
  ),
});

const AwardsSection = dynamic(() => import('@/components/AwardsSection'), {
  loading: () => <div className="min-h-screen bg-[#0a0a0a] animate-pulse" />,
});

const PressSection = dynamic(() => import('@/components/PressSection'), {
  loading: () => <div className="min-h-screen bg-[#0a0a0a] animate-pulse" />,
});

const SocialResponsibilitySection = dynamic(() => import('@/components/SocialResponsibilitySection'), {
  loading: () => <div className="min-h-screen bg-[#0a0a0a] animate-pulse" />,
});

const HRSection = dynamic(() => import('@/components/HRSection'), {
  loading: () => <div className="min-h-screen bg-[#0a0a0a] animate-pulse" />,
});

const Footer = dynamic(() => import('@/components/Footer'));
const MenuModal = dynamic(() => import('@/components/MenuModal'));
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'));

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Expose function globally for Navbar to call
  if (typeof window !== 'undefined') {
    window.openMenuModal = () => setIsMenuOpen(true);
  }

  return (
    <ErrorBoundary>
      <RestaurantStructuredData />
      <main className="w-full overflow-x-hidden">
        <Navbar />
        <SectionErrorBoundary sectionName="Hero Slider">
          <HeroSlider />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Hakkımızda">
          <AboutSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Rezervasyon">
          <ReservationSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Galeri">
          <GallerySection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Ödüller">
          <AwardsSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Basında Biz">
          <PressSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Sosyal Sorumluluk">
          <SocialResponsibilitySection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="İnsan Kaynakları">
          <HRSection />
        </SectionErrorBoundary>
        <Footer />
        <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <ScrollToTop />
      </main>
    </ErrorBoundary>
  );
}
