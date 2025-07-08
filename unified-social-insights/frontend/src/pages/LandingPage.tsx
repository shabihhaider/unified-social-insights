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
    <main className="bg-white dark:bg-gray-900">
      <Navbar onJoinWaitlist={() => setShowModal(true)} />
      <Hero onJoinWaitlist={() => setShowModal(true)} />
      <AboutSection />
      <Testimonials />
      <FeatureSection /> 
      <FAQSection />
      <CTA onJoinWaitlist={() => setShowModal(true)} />
      <Footer />
      <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </main>
  );
};

export default LandingPage;
