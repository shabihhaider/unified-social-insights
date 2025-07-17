import React from 'react';
import Hero from '../components/Hero';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import WaitlistModal from '../components/WaitlistModal';
import Navbar from '../components/Navbar';
import FeatureSection from '../components/FeatureSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

const LandingPage = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <main className="
        min-h-screen
        bg-gradient-to-br
        from-brand-pure via-brand-frost/5 to-brand-frost/10
        dark:from-brand-void dark:via-brand-carbon/50 dark:to-brand-carbon
        text-brand-void dark:text-brand-frost
        font-sans antialiased
        transition-colors duration-300
    ">
      <Navbar onJoinWaitlist={() => setShowModal(true)} />
      
      <div className="relative overflow-hidden">
        {/* Enhanced decorative glassy background blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-5%] left-[20%] w-72 h-72 bg-brand-electric/10 dark:bg-brand-neon/5 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute top-[30%] right-[15%] w-96 h-96 bg-brand-neon/10 dark:bg-brand-electric/10 rounded-full blur-[160px] animate-pulse-slow"></div>
          <div className="absolute bottom-[20%] left-[30%] w-80 h-80 bg-brand-violet/10 dark:bg-brand-violet/5 rounded-full blur-[140px] animate-bounce-subtle"></div>
          <div className="absolute top-[60%] right-[40%] w-64 h-64 bg-brand-lime/10 dark:bg-brand-lime/5 rounded-full blur-[100px] animate-float"></div>
        </div>

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-brand-radial opacity-5 dark:opacity-10 -z-10 pointer-events-none"></div>

        {/* Core sections */}
        <div className="relative z-10">
          <Hero onJoinWaitlist={() => setShowModal(true)} />
          <AboutSection />
          {/* Optional: Uncomment if using Testimonials */}
          {/* <Testimonials /> */}
          <FeatureSection />
          <FAQSection />
          <CTA onJoinWaitlist={() => setShowModal(true)} />
        </div>
      </div>
      
      <Footer />
      
      {/* Modal for Waitlist */}
      <WaitlistModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </main>
  );
};

export default LandingPage;