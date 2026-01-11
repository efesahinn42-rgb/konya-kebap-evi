'use client';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full">
      <HeroSlider />
      <AboutSection />
      <Footer />
    </main>
  );
}
