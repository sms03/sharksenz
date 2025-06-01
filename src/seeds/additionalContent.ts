import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type ContentItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  first_letter: string;
};

export const additionalContent: ContentItem[] = [
  {
    id: "funding-strategies",
    title: "Funding Strategies for Early-Stage Startups",
    content: "Securing funding is one of the most critical challenges for early-stage startups. This guide explores various funding options including bootstrapping, friends and family rounds, angel investors, venture capital, crowdfunding, and grants.\n\nBootstrapping allows founders to maintain full control but limits growth speed. Angel investors provide not just capital but often valuable mentorship. Venture capital is suitable for startups with high growth potential but comes with expectations of significant returns. Crowdfunding platforms like Kickstarter or Indiegogo can provide both funding and market validation.\n\nThe funding strategy you choose should align with your business model, growth trajectory, and long-term vision. Consider the trade-offs between growth speed and maintaining control of your company.",
    category: "Finance",
    first_letter: "F"
  },
  {
    id: "product-market-fit",
    title: "Achieving Product-Market Fit",
    content: "Product-market fit is the degree to which a product satisfies a strong market demand. It's the holy grail for startups, indicating that your product meets a real need for real customers who are willing to pay for it.\n\nTo achieve product-market fit, start with thorough customer development and validation. Identify your target market's pain points and build a Minimum Viable Product (MVP) that addresses these problems. Collect user feedback continuously and iterate rapidly based on this feedback.\n\nSome indicators of achieving product-market fit include high customer retention, strong word-of-mouth referrals, and increasing revenue with minimal marketing efforts. The journey to product-market fit is rarely linear and requires patience, persistence, and a willingness to pivot when necessary.",
    category: "Product Development",
    first_letter: "A"
  },
  {
    id: "team-building-strategies",
    title: "Team Building Strategies for Startups",
    content: "Building the right team is critical for startup success. In the early stages, each hire has an outsized impact on your company's culture and capabilities.\n\nWhen recruiting, look beyond technical skills to find people who share your vision and can thrive in an ambiguous, fast-paced environment. Consider cultural fit, adaptability, and intrinsic motivation. Early employees should be comfortable wearing multiple hats and taking initiative without much direction.\n\nCompensation strategies for startups typically include a mix of salary and equity. Be transparent about your company's financial situation and growth prospects. Create a strong company culture by setting clear values, recognizing achievements, and fostering open communication.\n\nRemember that as a founder, your leadership style sets the tone for the entire organization. Lead by example and create an environment where talented people can do their best work.",
    category: "Leadership",
    first_letter: "T"
  },
  {
    id: "growth-hacking-techniques",
    title: "Growth Hacking Techniques for User Acquisition",
    content: "Growth hacking combines marketing, product development, and data analysis to rapidly experiment across marketing channels and product development to identify the most efficient ways to grow a business.\n\nEffective growth hacking starts with a deep understanding of your target audience and customer journey. Focus on metrics that matter, particularly those that indicate real business growth rather than vanity metrics.\n\nSome proven growth hacking techniques include creating viral loops within your product, optimizing your onboarding process, implementing referral programs, and content marketing targeted at your ideal customers.\n\nA/B testing is central to growth hacking. Test different versions of landing pages, emails, and product features to see what resonates with users. Use tools like Google Analytics, Mixpanel, or Amplitude to track user behavior and conversion rates.\n\nRemember that growth hacking is not just about acquiring new users—retention is equally important. A leaky bucket (high churn rate) will undermine even the most successful acquisition strategies.",
    category: "Marketing",
    first_letter: "G"
  },
  {
    id: "mvp-development-guide",
    title: "Minimum Viable Product Development Guide",
    content: "A Minimum Viable Product (MVP) is a version of a product with just enough features to satisfy early customers and provide feedback for future development. Building an effective MVP is crucial for validating your business idea without overinvesting in unproven concepts.\n\nStart by identifying the core problem your product solves and the simplest possible solution. Focus on the must-have features rather than nice-to-have ones. The goal is to create something valuable enough that early adopters will use it despite its limitations.\n\nDevelop your MVP through rapid iterations, collecting user feedback at each stage. Be prepared to make significant changes based on this feedback. Remember that an MVP is not simply a stripped-down version of your envisioned final product—it should be designed specifically to test your most critical assumptions about your business model.\n\nOnce you've launched your MVP, establish clear metrics to evaluate its success. These might include user engagement, retention, conversion rates, or other indicators specific to your business model. Use these insights to guide your product roadmap and future development priorities.",
    category: "Product Development",
    first_letter: "M"
  },
  {
    id: "customer-acquisition-cost",
    title: "Understanding and Optimizing Customer Acquisition Cost",
    content: "Customer Acquisition Cost (CAC) is the total cost of acquiring a new customer, including marketing expenses, sales team salaries, advertising, and other related costs. Understanding and optimizing your CAC is essential for building a sustainable business model.\n\nTo calculate your CAC, divide your total sales and marketing expenses by the number of new customers acquired in a given period. Compare this to your Customer Lifetime Value (CLV) to ensure you're spending the right amount to acquire customers.\n\nStrategies to reduce CAC include improving targeting to reach more qualified prospects, optimizing conversion rates throughout your funnel, implementing customer referral programs, and focusing on organic acquisition channels like content marketing and SEO.\n\nRemember that the lowest CAC isn't always the goal—sometimes it's worth paying more to acquire higher-value customers. The key is ensuring your economics work, with CLV significantly higher than CAC (a ratio of 3:1 is often cited as healthy).\n\nRegularly review your acquisition channels to identify which are most efficient and allocate your budget accordingly. Marketing automation can also help reduce CAC by streamlining repetitive tasks and allowing your team to focus on high-impact activities.",
    category: "Marketing",
    first_letter: "U"
  }
];

export const seedAdditionalContent = async () => {
  try {
    // Check if content already exists before seeding
    const { data: existingContent, error: checkError } = await supabase
      .from('learning_content')
      .select('id')
      .in('id', additionalContent.map(item => item.id));
      
    if (checkError) {
      throw checkError;
    }
    
    // Filter out content that already exists
    const existingIds = existingContent?.map(item => item.id) || [];
    const newContent = additionalContent.filter(item => !existingIds.includes(item.id));
    
    if (newContent.length === 0) {
      console.log("All additional content already exists in the database");
      return;
    }
    
    // Insert the new content
    const { error } = await supabase
      .from('learning_content')
      .insert(newContent);
      
    if (error) {
      throw error;
    }
    
    console.log(`Successfully seeded ${newContent.length} additional content items`);
    toast.success(`Added ${newContent.length} new content items to the library`);
  } catch (error) {
    console.error("Error seeding additional content:", error);
    toast.error("Failed to seed additional content");
  }
};
