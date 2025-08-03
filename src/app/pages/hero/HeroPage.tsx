import React from 'react'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-8'
import IntegrationsSection from '@/components/integrations-7'
import ContentSection from '@/components/content-2'
import WallOfLoveSection from '@/components/testimonials'
import Pricing from '@/components/pricing'
import FAQsTwo from '@/components/faqs-2'
import ContactSection from '@/components/contact'
import FooterSection from '@/components/footer'

const HeroPage = () => {
  return (
    <div>
        <HeroSection />
        <FeaturesSection />
        <IntegrationsSection />
        <ContentSection />
        <Pricing />
        <WallOfLoveSection />
        <FAQsTwo />
        {/* <ContactSection /> */}
        <FooterSection />
    </div>
  )
}

export default HeroPage