'use client';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import MenuSection from '@/components/MenuSection';
import ReservationSection from '@/components/ReservationSection';
import GallerySection from '@/components/GallerySection';
import AwardsSection from '@/components/AwardsSection';
import PressSection from '@/components/PressSection';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <MobileNav />
      <HeroSlider />
      <AboutSection />
      <MenuSection />
      <ReservationSection />
      <GallerySection />
      <AwardsSection />
      <PressSection />
      <Footer />
    </main>
  );
}

