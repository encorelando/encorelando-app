import BrandLogo from '../components/atoms/BrandLogo';
import BrandButton from '../components/atoms/BrandButton';
import BrandCard from '../components/atoms/BrandCard';
import BrandHeading from '../components/atoms/BrandHeading';
import MainHeader from '../components/organisms/MainHeader';
import BottomNavigation from '../components/organisms/BottomNavigation';

/**
 * BrandExamplePage demonstrates the updated EncoreLando branding
 * Shows a variety of components with the new visual identity
 */
const BrandExamplePage = () => {
  return (
    <div className="bg-background min-h-screen text-white pb-16">
      {/* Header */}
      <MainHeader />

      {/* Main content */}
      <main className="p-md space-y-lg">
        {/* Brand Showcase Section */}
        <section className="mb-xl">
          <BrandHeading level={1} gradient className="mb-md">
            Brand Showcase
          </BrandHeading>

          <p className="font-manrope mb-lg">
            This page demonstrates the updated EncoreLando branding, including colors, typography,
            and component styles.
          </p>

          {/* Logo variants */}
          <div className="grid grid-cols-3 gap-md mb-lg">
            <div className="flex flex-col items-center">
              <BrandLogo variant="white" size="md" />
              <p className="text-xs mt-xs text-center">White (Default)</p>
            </div>
            <div className="flex flex-col items-center bg-white p-md rounded">
              <BrandLogo variant="black" size="md" />
              <p className="text-xs mt-xs text-center text-black">Black</p>
            </div>
            <div className="flex flex-col items-center">
              <BrandLogo variant="gradient" size="md" />
              <p className="text-xs mt-xs text-center">Gradient</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-xl">
          <BrandHeading level={2} className="mb-md">
            Typography
          </BrandHeading>

          <div className="space-y-md">
            <div>
              <p className="text-sm text-white text-opacity-70 mb-xs">Brand Name Split:</p>
              <div className="typography-split text-2xl">
                <span className="enc font-poppins">enc</span>
                <span className="or font-manrope">or</span>
                <span className="e font-poppins">e</span>
                <span className="lando font-manrope">lando</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-white text-opacity-70 mb-xs">Headings (Poppins):</p>
              <BrandHeading level={1} className="mb-xs">
                Heading 1
              </BrandHeading>
              <BrandHeading level={2} className="mb-xs">
                Heading 2
              </BrandHeading>
              <BrandHeading level={3} className="mb-xs">
                Heading 3
              </BrandHeading>
              <BrandHeading level={4} className="mb-xs">
                Heading 4
              </BrandHeading>
            </div>

            <div>
              <p className="text-sm text-white text-opacity-70 mb-xs">Body Text (Manrope):</p>
              <p className="font-manrope mb-xs">Regular body text uses Manrope font.</p>
              <p className="font-manrope text-sm mb-xs">Smaller text is also Manrope.</p>
              <p className="font-manrope font-bold">Bold text for emphasis.</p>
            </div>

            <div>
              <p className="text-sm text-white text-opacity-70 mb-xs">Gradient Text:</p>
              <BrandHeading level={2} gradient>
                Gradient Heading
              </BrandHeading>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-xl">
          <BrandHeading level={2} className="mb-md">
            Color Palette
          </BrandHeading>

          <div className="grid grid-cols-2 gap-md">
            <div className="h-16 bg-[#0D0D0D] border border-white border-opacity-10 rounded flex items-center justify-center">
              <p className="text-sm">Background #0D0D0D</p>
            </div>
            <div className="h-16 bg-[#FF6A00] rounded flex items-center justify-center">
              <p className="text-sm">Sunset Orange</p>
            </div>
            <div className="h-16 bg-[#FF3CAC] rounded flex items-center justify-center">
              <p className="text-sm">Magenta Pink</p>
            </div>
            <div className="h-16 bg-[#7B2FF7] rounded flex items-center justify-center">
              <p className="text-sm">Deep Orchid</p>
            </div>
            <div className="h-16 bg-[#00C3FF] rounded flex items-center justify-center">
              <p className="text-sm">Neon Blue</p>
            </div>
            <div className="h-16 bg-brand-gradient rounded flex items-center justify-center">
              <p className="text-sm">Brand Gradient</p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-xl">
          <BrandHeading level={2} className="mb-md">
            Buttons
          </BrandHeading>

          <div className="space-y-md">
            <BrandButton variant="primary" className="w-full mb-md">
              Primary Button
            </BrandButton>

            <BrandButton variant="secondary" className="w-full mb-md">
              Secondary Button
            </BrandButton>

            <BrandButton variant="gradient" className="w-full mb-md">
              Gradient Button
            </BrandButton>

            <BrandButton variant="ghost" className="w-full mb-md">
              Ghost Button
            </BrandButton>

            <BrandButton variant="danger" className="w-full">
              Danger Button
            </BrandButton>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-xl">
          <BrandHeading level={2} className="mb-md">
            Cards
          </BrandHeading>

          <div className="space-y-md">
            <BrandCard>
              <BrandHeading level={3} className="mb-sm">
                Standard Card
              </BrandHeading>
              <p className="font-manrope">
                This is a standard card with white text on a semi-transparent background.
              </p>
            </BrandCard>

            <BrandCard featured>
              <BrandHeading level={3} gradient className="mb-sm">
                Featured Card
              </BrandHeading>
              <p className="font-manrope">
                This featured card has a gradient border to make it stand out.
              </p>
            </BrandCard>

            <BrandCard variant="interactive" onClick={() => alert('Card clicked')}>
              <BrandHeading level={3} className="mb-sm">
                Interactive Card
              </BrandHeading>
              <p className="font-manrope">This card is clickable and has hover/active states.</p>
            </BrandCard>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default BrandExamplePage;
