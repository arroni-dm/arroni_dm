export type SystemSlug = "linkedin" | "social" | "email" | "web" | "meta";
export type BookingPersona = "General" | "LinkedIn" | "Social" | "Email" | "Web" | "Meta";

export type SystemStage = {
  name: string;
  focus: string;
  content: string;
};

export type SystemPhilosophy = {
  label: string;
  heading: string;
  body?: string;
};

export type SystemCTA = {
  heading: string;
  body: string;
};

export type SystemContent = {
  slug: SystemSlug;
  number: string;
  name: string;
  persona: BookingPersona;
  description: string;
  pipelineLabel: string;
  pipelineIntro: string;
  stages: SystemStage[];
  philosophy: SystemPhilosophy;
  cta?: SystemCTA;
};

// 1. Google Ads Management (Monthly Execution Checklist)
export const linkedin: SystemContent = {
  slug: "linkedin",
  number: "02",
  name: "Google Ads Management",
  persona: "LinkedIn",
  description: "Monthly maintenance and continuous optimization for your Google Ads campaigns. We actively check your account 2-3 times weekly, execute 1-2 batches of strategic updates monthly, log all changes in Looker Studio, and deliver video reviews with planning ahead documentation.",
  pipelineLabel: "Monthly Execution Checklist",
  pipelineIntro: "Here is the comprehensive list of tasks and optimizations we execute each month to maintain and scale your Google Ads account.",
  stages: [
    { 
      name: "Performance & Bidding Audit", 
      focus: "MoM/YoY Audits & Bid System Adjustments", 
      content: "Compare performance against previous period & year. Review campaigns for anomalies, evaluate Google recommendations, review/apply manual bids, and adjust bid modifiers across devices, ad schedules, geo locations, search partners, demographics, and remarketing lists." 
    },
    { 
      name: "Ad Copies & Extensions", 
      focus: "Creative Testing & Asset Management", 
      content: "Write and test new ad copies, review promotional ads, verify all active ad extensions, and create new extensions where applicable to maximize Quality Score and CTR." 
    },
    { 
      name: "Keywords & Targeting Engine", 
      focus: "Search Term Audits & Negative Keywords", 
      content: "Perform manual keyword reviews for expansion and negative terms, apply negative keyword lists to missing campaigns, find new high-intent keywords, and update business data." 
    },
    { 
      name: "Architecture & Expansion", 
      focus: "Category Coverage & Budget Allocation", 
      content: "Review website vs account for uncovered selling products/categories, add missing campaign types, optimize budget allocation for finite budgets, leverage mobile/tablet/desktop segmentation opportunities, and update remarketing lists." 
    },
    { 
      name: "Reporting & Strategy", 
      focus: "Looker Studio & Video Reviews", 
      content: "All updates and optimizations are logged in a Data Studio (Looker Studio) dashboard. Includes a monthly video review breakdown and planning ahead documentation." 
    },
  ],
  philosophy: { 
    label: "Founder's Logic", 
    heading: '"Running ads without continuous monthly optimization is burning cash. Precision scaling requires structured account management."' 
  },
  cta: { 
    heading: "Ready for Full-Service Google Ads Management?", 
    body: "Book your strategy call to review your ad account and implement a structured monthly optimization workflow." 
  },
};

// 2. Meta Ads Scaling
export const meta: SystemContent = {
  slug: "meta",
  number: "04",
  name: "Meta Ads Scaling",
  persona: "Meta",
  description: "High-ROI Facebook & Instagram ad campaigns designed to generate predictable sales and qualified leads.",
  pipelineLabel: "Action Pipeline",
  pipelineIntro: "Watch how we systematically setup, test, and scale high-performing Meta ad funnels.",
  stages: [
    { name: "Creative & Audience Audit", focus: "Messaging & Target Demographics", content: "We analyze your top-performing creative assets, customer avatars, and competitor positioning to craft offers that convert." },
    { name: "Ad Setup & CAPI", focus: "Campaign Structure & Conversion API", content: "Setting up Meta Conversion API (CAPI) with pixel tracking and launch tight ad sets built for accurate data matching." },
    { name: "Scaling & Retargeting", focus: "Custom Audiences & Dynamic Ads", content: "Retargeting engaged visitors with high-converting video and catalog ads while scaling winning cold audiences." },
    { name: "Continuous CRO", focus: "CPL/CPA Reduction", content: "Aggressively monitoring ad fatigue, rotating creatives, and optimizing landing page conversions to keep acquisition costs low." },
  ],
  philosophy: { label: "Founder's Logic", heading: '"If your ad creative doesn\'t hook them in 3 seconds, your budget is already wasted."' },
  cta: { heading: "Ready to scale your Meta Ads?", body: "Book your strategy call to review your funnel and build a predictable Meta acquisition engine." },
};

// 3. Social Media Ecosystem
export const social: SystemContent = {
  slug: "social",
  number: "03",
  name: "Social Media",
  persona: "Social",
  description: 'Drive high-ROI sales and lead volume on Facebook & Instagram with bulletproof Meta Pixel, GTM, GA4, and Conversion API (CAPI) setup that bypasses ad blockers.',
  pipelineLabel: "Action Pipeline",
  pipelineIntro: "From foundational Pixel & CAPI tracking to full retargeting audience funnels.",
  stages: [
    { name: "Strategy & Audience Research", focus: "Customer Avatar & Messaging Assessment", content: "We analyze your target market, competitors, and buyer personas. Then, we structure high-converting offers and audience angles built to convert cold traffic." },
    { name: "Ad Setup & Creative Execution", focus: "Targeted Campaign Architecture", content: "Setting up structured Prospecting and Retargeting campaigns with tightly grouped ad sets, compelling ad copy, and high-converting visual creative formats." },
    { name: "Advanced Tracking", focus: "Pixel, GTM & Server-Side CAPI Setup", content: "Implementing GTM Server-Side tracking, Meta Conversion API (CAPI), custom GA4 eCommerce/Lead events, and Event Match Quality (EMQ) optimization to capture lost iOS signals." },
    { name: "Retargeting & Optimization", focus: "Data-Driven Growth & Retargeting", content: "Constant creative testing, audience rotation, custom retargeting funnel refinement, and landing page optimization to aggressively lower CPL/CPA and scale ROAS." },
  ],
  philosophy: { label: "Credence Philosophy", heading: '"People don\'t buy from the loudest person. They buy from the most trusted one."' },
  cta: { heading: "Ready to command attention?", body: "Secure your ecosystem clarity call to discover exactly where your current digital signal is failing your revenue goals." },
};

// 4. Google Ads & Tracking Setup
export const email: SystemContent = {
  slug: "email",
  number: "01",
  name: "Google Ads & Tracking",
  persona: "Email",
  description: "Drive high-intent traffic, track every single conversion accurately with GTM & GA4, and turn ad clicks into predictable revenue.",
  pipelineLabel: "Action Pipeline",
  pipelineIntro: "See the exact sequence how we audit, setup, track, and scale your Google Ads campaigns.",
  stages: [
    { name: "Audit & Strategy", focus: "Account & Tracking Assessment", content: "We analyze your target keywords, competitors, and past ad performance. Then, we set up proper conversion architecture to ensure clean data flow." },
    { name: "Campaign Setup", focus: "Targeted Ads Architecture", content: "Setting up high-converting Search, Performance Max, and Remarketing campaigns with tightly grouped ad groups, negative keywords, and compelling ad copy." },
    { name: "Advanced Tracking", focus: "GTM, GA4 & Server-Side Tracking", content: "Implementing Google Tag Manager (GTM), GA4 eCommerce/Lead events, Enhanced Conversions, and Server-Side tracking to defeat ad blockers and cookie limits." },
    { name: "Continuous Optimization", focus: "Data-Driven Growth", content: "Constant monitoring, bid strategy adjustment, quality score improvement, and negative keyword pruning to maximize your ROAS and lower CPA." },
  ],
  philosophy: { label: "My Philosophy", heading: "Why tracked data beats guesswork.", body: "Running Google Ads without accurate server-side tracking is flying blind. When every conversion is tracked, your smart bidding learns faster and your ROAS goes up." },
  cta: { heading: "Ready to Track Every Dollar and Scale Your Google Ads?", body: "Book your free strategy session to eliminate wasted ad spend, fix conversion tracking, and build a predictable growth engine." },
};

// 5. Website Architecture
export const web: SystemContent = {
  slug: "web",
  number: "05",
  name: "Website",
  persona: "Web",
  description: "Most websites are digital brochures. They look fine. They do nothing. People land on them and leave without buying. We build websites that sell.",
  pipelineLabel: "Architecture Blueprint",
  pipelineIntro: "See the exact architecture we build to transform an outdated online presence into dominating Conversion Real Estate.",
  stages: [
    { name: "The Signal Page", focus: "Immediate Credibility.", content: 'A 1 to 3 page site that immediately tells visitors: "This person knows what they\'re doing." We close the gap between how good you are offline and how you look online.' },
    { name: "The Full Site", focus: "Conversion Engine.", content: "4 to 6 pages that tell your story, prove your expertise, and convert visitors into leads." },
    { name: "The Platform", focus: "Complete Digital Home.", content: "7 to 15+ pages. A full content hub. The complete digital home of your brand." },
    { name: "Full Dominance", focus: "Omnipresent Authority.", content: "Your website, SEO, PR, and all channels working together. You become impossible to miss." },
  ],
  philosophy: { label: "Credence Philosophy", heading: "Why your website matters more than you think.", body: "Your website is the only digital real estate you truly own. It needs to do more than look good. It needs to make people trust you before they ever get on a call. If it's not doing that, it's not an asset. It's a liability." },
  cta: { heading: "Ready to fix it?", body: "Apply below to find out exactly where your digital presence is costing you authority and how to architect a high-converting footprint." },
};