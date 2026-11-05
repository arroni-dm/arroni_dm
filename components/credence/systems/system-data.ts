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
  name: "Google Ads Optimization & Management",
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
    label: "Philosophy", 
    heading: '"Running ads without continuous monthly optimization is burning cash. Precision scaling requires structured account management."',
    body: "Scaling ad campaigns is not a launch-and-forget event. Continuous weekly refinement and bid adjustments protect your profit margins and lower CPA."
  },
  cta: { 
    heading: "Ready for Full-Service Google Ads Management?", 
    body: "Book your strategy call to review your ad account and implement a structured monthly optimization workflow." 
  },
};

// 2. Meta Ads Optimization & Management
export const meta: SystemContent = {
  slug: "meta",
  number: "04",
  name: "Meta Ads Optimization & Management",
  persona: "Meta",
  description: "Continuous weekly optimization, creative testing, and retargeting management for Facebook & Instagram ad campaigns that scale ROAS and lower CPA.",
  pipelineLabel: "Action Pipeline",
  pipelineIntro: "Watch how we systematically monitor, audit, optimize, and scale your Meta Ads month after month.",
  stages: [
    { 
      name: "Campaign Performance Audit", 
      focus: "MoM/YoY Audits & Creative fatigue Checks", 
      content: "We inspect account metrics 2-3 times weekly, analyze cost-per-acquisition (CPA) anomalies, and audit creative fatigue to ensure steady performance." 
    },
    { 
      name: "Bidding & Audience Tuning", 
      focus: "Bid Modifiers & Lookalike Expansion", 
      content: "Adjusting manual and automated bidding strategies, segmenting high-converting age/gender demographics, and expanding lookalike audiences for broader reach." 
    },
    { 
      name: "Retargeting & Creative Sprints", 
      focus: "Custom Retargeting & Dynamic Creative A/B Testing", 
      content: "Refreshing ad copy, launching new video/catalog creatives, and updating custom retargeting lists to convert high-intent website visitors into customers." 
    },
    { 
      name: "Continuous CRO & Reporting", 
      focus: "Looker Studio Logging & Monthly Video Teardowns", 
      content: "All optimizations are logged live in a custom Looker Studio dashboard, accompanied by a detailed monthly video review and strategic future roadmap." 
    },
  ],
  philosophy: { 
    label: "Credence Philosophy", 
    heading: '"Scaling Meta Ads is not a launch-and-forget event. Continuous weekly creative refreshes and audience optimizations protect your profit margins."',
    body: "If your ad creative doesn't hook them in 3 seconds, your budget is already wasted. Weekly creative iterations keep acquisition costs low and ROAS high."
  },
  cta: { 
    heading: "Ready to Optimize and Scale Your Meta Ads?", 
    body: "Book your strategy call to review your current Facebook & Instagram campaigns and implement our structured monthly management workflow." 
  },
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
  philosophy: { 
    label: "Credence Philosophy", 
    heading: '"Creatives hook the audience, but bulletproof Pixel & CAPI tracking make your smart bidding learn faster and scale your ROAS."' 
  },
  cta: { 
    heading: "Ready to Fix Your Meta Tracking and Scale Your Ads?", 
    body: "Book your strategy call to select the right Meta setup package, fix pixel data loss, and scale your campaigns." 
  },
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
  philosophy: { label: "Philosophy", heading: "Why tracked data beats guesswork.", body: "Running Google Ads without accurate server-side tracking is flying blind. When every conversion is tracked, your smart bidding learns faster and your ROAS goes up." },
  cta: { heading: "Ready to Track Every Dollar and Scale Your Google Ads?", body: "Book your free strategy session to eliminate wasted ad spend, fix conversion tracking, and build a predictable growth engine." },
};

// 5. Website Architecture
export const web: SystemContent = {
  slug: "web",
  number: "05",
  name: "Website",
  persona: "Web",
  description: "Most analytics reports are messy spreadsheets. They look complex, but tell you nothing. We build interactive Looker Studio dashboards that turn raw ad data into actionable revenue metrics.",
  pipelineLabel: "Architecture Blueprint",
  pipelineIntro: "See the exact architecture we build to transform fragmented multi-channel data into a single, real-time command center.",
  stages: [
    { name: "The Signal Connect", focus: "Multi-Channel Integration", content: 'Connecting Google Ads, Meta Ads, GA4, GTM, and CRM data sources into a centralized Looker Studio infrastructure with clean automated data streams.' },
    { name: "Core KPI Architecture", focus: "Actionable Metric Blueprint", content: "Designing clean, custom visual layouts that highlight real ROAS, CPA, Conversion Rates, and Revenue metrics, eliminating vanity metrics." },
    { name: "Drill-Down Insights", focus: "Granular Performance Analysis", content: "Implementing interactive date range controls, campaign-level filters, device breakdowns, and geographical maps for deeper strategic decision-making." },
    { name: "Automated Reporting & Video Teardowns", focus: "Automated Sharing & Monthly Audits", content: "Setting up automated email delivery to stakeholders, shareable access permissions, and monthly recorded video walkthroughs explaining key trends." },
  ],
  philosophy: { label: "Philosophy", heading: "Why your analytics dashboard matters more than you think.", body: "If you can't measure your ad performance accurately in real-time, you're flying blind. Clean reporting turns data into growth strategies." },
  cta: { heading: "Ready to build your Looker Studio dashboard?", body: "Book your strategy call to discover how custom data visualization can eliminate guesswork from your marketing campaigns." },
};