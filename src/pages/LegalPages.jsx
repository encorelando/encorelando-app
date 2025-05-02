// File: src/pages/LegalPages.jsx

import PageLayout from '../components/templates/PageLayout';
import Typography from '../components/atoms/Typography';

/**
 * Legal pages for Encorelando, a product of Starbright Lab.
 * If you re‑brand or add new products under the same parent company,
 * keep COMPANY_NAME constant and change PRODUCT_NAME per product‑site.
 */

const PRODUCT_NAME = 'encorelando';
const COMPANY_NAME = 'Starbright Lab LLC';
const CONTACT_EMAIL = 'hello@encorelando.com';
const CURRENT_YEAR = 2025;
const MAILING_ADDRESS = '123 Main St. Orlando FL 33896, USA';

/* -------------------------------------------------------------------------- */
/*                               Privacy Policy                               */
/* -------------------------------------------------------------------------- */

export const PrivacyPolicy = () => (
  <PageLayout>
    <div className="px-md py-lg space-y-md">
      <Typography variant="h1">Privacy Policy</Typography>

      <Typography variant="body1" color="medium-gray">
        Last updated: May&nbsp;1,&nbsp;2025
      </Typography>

      {/* 1. Introduction */}
      <Typography variant="h2">1. Introduction</Typography>
      <Typography variant="body1">
        {PRODUCT_NAME} (&quot;<strong>we</strong>&quot;, &quot;<strong>us</strong>&quot;, &quot;
        <strong>our</strong>&quot;) is a live‑events discovery platform for theme‑park performances
        in Florida and is operated by {COMPANY_NAME}. This Policy explains how we collect, use, and
        safeguard your personal information when you use our website or apps.
      </Typography>

      {/* 2. Information we collect */}
      <Typography variant="h2">2. Information we collect</Typography>
      <ul className="list-disc list-inside space-y-xxs">
        <li>Email address and display name when you create an account or subscribe to updates.</li>
        <li>
          Basic log data (IP address, browser type, referring pages) generated automatically by our
          hosting provider.
        </li>
        <li>
          Usage data (e.g.&nbsp;searches and favorites) so we can personalize your experience.
        </li>
      </ul>

      {/* 3. How we use information */}
      <Typography variant="h2">3. How we use your information</Typography>
      <ul className="list-disc list-inside space-y-xxs">
        <li>Provide, operate, and maintain {PRODUCT_NAME}.</li>
        <li>
          Send transactional emails such as sign‑up confirmations and password resets (via Resend).
        </li>
        <li>Improve features and performance through aggregated analytics (not yet enabled).</li>
      </ul>

      {/* 4. Sharing & disclosure */}
      <Typography variant="h2">4. Sharing &amp; disclosure</Typography>
      <Typography variant="body1">
        We do <strong>not</strong> sell your personal data. We share it only with vendors who help
        us run {PRODUCT_NAME}— for example, Supabase for authentication and Netlify for hosting —
        under agreements that prohibit them from using your data for their own purposes.
      </Typography>

      {/* 5. Data retention */}
      <Typography variant="h2">5. Data retention</Typography>
      <Typography variant="body1">
        We retain account information while your account is active. You may request deletion at any
        time by emailing
        <a href={`mailto:${CONTACT_EMAIL}`}> {CONTACT_EMAIL}</a>.
      </Typography>

      {/* 6. Your rights */}
      <Typography variant="h2">6. Your rights</Typography>
      <Typography variant="body1">
        Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict
        processing of your personal data. Contact us to exercise these rights.
      </Typography>

      {/* 7. Contact */}
      <Typography variant="h2">7. Contact</Typography>
      <Typography variant="body1">
        Email:&nbsp;<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <br />
        Mailing address: {MAILING_ADDRESS}
      </Typography>
    </div>
  </PageLayout>
);

/* -------------------------------------------------------------------------- */
/*                           Terms & Conditions                               */
/* -------------------------------------------------------------------------- */

export const TermsAndConditions = () => (
  <PageLayout>
    <div className="px-md py-lg space-y-md">
      <Typography variant="h1">Terms &amp; Conditions</Typography>

      <Typography variant="body1" color="medium-gray">
        Effective date: May&nbsp;1,&nbsp;2025
      </Typography>

      {/* 1. Acceptance of Terms */}
      <Typography variant="h2">1. Acceptance of Terms</Typography>
      <Typography variant="body1">
        By accessing or using {PRODUCT_NAME} you agree to be bound by these Terms. If you do not
        agree with any part, please do not use the service.
      </Typography>

      {/* 2. Service description */}
      <Typography variant="h2">2. Service description</Typography>
      <Typography variant="body1">
        {PRODUCT_NAME} aggregates publicly available event schedules and displays them in a
        searchable interface. We do not sell tickets and cannot guarantee the accuracy of
        third‑party schedules.
      </Typography>

      {/* 3. User conduct */}
      <Typography variant="h2">3. User conduct</Typography>
      <ul className="list-disc list-inside space-y-xxs">
        <li>No scraping or reselling our compiled data without written permission.</li>
        <li>No uploading unlawful, infringing, or offensive content.</li>
      </ul>

      {/* 4. Intellectual Property */}
      <Typography variant="h2">4. Intellectual property</Typography>
      <Typography variant="body1">
        All original software, design, and data compilations are © {CURRENT_YEAR} {COMPANY_NAME}.
        Third‑party images remain the property of their respective owners.
      </Typography>

      {/* 5. Disclaimers */}
      <Typography variant="h2">5. Disclaimers &amp; limitation of liability</Typography>
      <Typography variant="body1">
        The service is provided “as is” without warranties of any kind. We are not liable for
        indirect or consequential damages arising from use of the platform.
      </Typography>

      {/* 6. Monetization */}
      <Typography variant="h2">6. Monetization &amp; future paid plans</Typography>
      <Typography variant="body1">
        {PRODUCT_NAME} is currently free. We may introduce premium features or mobile‑app
        subscription tiers later. Additional terms (including refund policies) will be published at
        that time.
      </Typography>

      {/* 7. Governing law */}
      <Typography variant="h2">7. Governing law</Typography>
      <Typography variant="body1">
        These Terms are governed by the laws of the State of Florida, USA, without regard to its
        conflict‑of‑law rules.
      </Typography>

      {/* 8. Contact */}
      <Typography variant="h2">8. Contact</Typography>
      <Typography variant="body1">
        Email:&nbsp;<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <br />
        Mailing address: {MAILING_ADDRESS}
      </Typography>
    </div>
  </PageLayout>
);

/* -------------------------------------------------------------------------- */
/*                            Copyright / DMCA                                */
/* -------------------------------------------------------------------------- */

export const CopyrightNotice = () => (
  <PageLayout>
    <div className="px-md py-lg space-y-md">
      <Typography variant="h1">Copyright &amp; DMCA Policy</Typography>

      <Typography variant="body1">
        © {CURRENT_YEAR} {COMPANY_NAME}. All rights reserved.
      </Typography>

      {/* 1. Ownership */}
      <Typography variant="h2">1. Ownership of content</Typography>
      <Typography variant="body1">
        The software, branding, and original data compilations on {PRODUCT_NAME} are protected by
        U.S. and international copyright laws and are owned by {COMPANY_NAME}.
      </Typography>

      {/* 2. Permitted use */}
      <Typography variant="h2">2. Permitted use</Typography>
      <Typography variant="body1">
        You may view, download, or print content for personal, non‑commercial use only. Any other
        use requires prior written permission from {COMPANY_NAME}.
      </Typography>

      {/* 3. DMCA */}
      <Typography variant="h2">3. DMCA takedown requests</Typography>
      <Typography variant="body1">
        If you believe material on {PRODUCT_NAME} infringes your copyright, please send a notice
        that complies with 17&nbsp;U.S.C.&nbsp;§512(c)(3) to
        <a href={`mailto:${CONTACT_EMAIL}`}> {CONTACT_EMAIL}</a>. We will respond promptly.
      </Typography>
    </div>
  </PageLayout>
);

// Default export with all named components
export default {
  PrivacyPolicy,
  TermsAndConditions,
  CopyrightNotice
};
