'use client';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <MobileNav />
      <HeroSlider />
      <AboutSection />
      <Footer />
    </main>
  );
}
