import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import SecuritySection from '../components/landing/SecuritySection';
import TermsSection from '../components/landing/TermsSection';
import PoliciesSection from '../components/landing/PoliciesSection';
import FaqSection from '../components/landing/FaqSection';
import CTASection from '../components/landing/CTASection';
import SponsorsCarousel from '../components/landing/SponsorsCarousel';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="bg-premium-light min-h-screen text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <SponsorsCarousel />
        <BenefitsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <UseCasesSection />
        <SecuritySection />
        <div className="bg-white">
          <TermsSection />
          <PoliciesSection />
        </div>
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
