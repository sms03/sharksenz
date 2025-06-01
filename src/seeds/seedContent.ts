import { supabase } from "@/integrations/supabase/client";

// Sample content for the learning library
const sampleContent = [
  {
    title: "Acquisition Strategy",
    content: "Acquisition strategy refers to the approach a startup takes to acquire customers or users. A successful acquisition strategy involves identifying target audiences, selecting appropriate marketing channels, and optimizing conversion rates.\n\nKey components of an effective acquisition strategy include:\n\n1. Clearly defined target audience personas\n2. Channel selection (organic, paid, partnerships)\n3. Messaging and positioning\n4. A/B testing frameworks\n5. Analytics and attribution\n6. Conversion rate optimization\n7. Budget allocation and ROI tracking\n\nStartups should focus on finding repeatable, scalable acquisition channels that deliver customers with an acceptable customer acquisition cost (CAC) relative to customer lifetime value (LTV).",
    category: "Marketing",
    first_letter: "A"
  },
  {
    title: "Bootstrapping",
    content: "Bootstrapping is the practice of building a startup using personal savings and revenue without raising external capital. This approach gives founders complete ownership and control but often requires careful resource management and slower growth.\n\nAdvantages of bootstrapping include:\n\n1. Maintaining 100% ownership and control\n2. Forcing efficient use of resources\n3. Building a sustainable business model early\n4. Flexibility in strategic direction\n5. No pressure from investors\n\nChallenges of bootstrapping include:\n\n1. Limited resources for growth\n2. Difficulty competing with well-funded competitors\n3. Personal financial risk\n4. Slower development timeline\n5. Challenges in attracting top talent without competitive compensation\n\nMany successful companies including Mailchimp, Basecamp, and GitHub initially bootstrapped before taking on investment (if ever).",
    category: "Finance",
    first_letter: "B"
  },
  {
    title: "Customer Development",
    content: "Customer development is a systematic approach to understanding customer problems and validating solutions. Pioneered by Steve Blank, this methodology emphasizes gathering customer insights before building products.\n\nThe four steps of customer development are:\n\n1. Customer Discovery: Identify and validate customer problems\n2. Customer Validation: Validate that your solution addresses these problems\n3. Customer Creation: Create end-user demand and scale sales\n4. Company Building: Transition from startup to established company\n\nCustomer development is central to the lean startup methodology and helps founders avoid building products that customers don't want. It emphasizes testing assumptions through direct customer interaction and iterative learning.",
    category: "Product",
    first_letter: "C"
  },
  {
    title: "Due Diligence",
    content: "Due diligence is the comprehensive investigation or audit of a potential investment or acquisition target. For startups raising capital, it's the process investors use to verify claims and assess risks before finalizing an investment.\n\nTypical areas covered in investor due diligence include:\n\n1. Financial records and projections\n2. Legal documents and compliance\n3. Intellectual property assets\n4. Market analysis and competitive landscape\n5. Customer and revenue validation\n6. Team background checks\n7. Technical architecture and scalability\n\nPreparing for due diligence in advance by maintaining organized records and being transparent about challenges can significantly improve a startup's chances of successfully closing an investment round.",
    category: "Finance",
    first_letter: "D"
  },
  {
    title: "Equity Compensation",
    content: "Equity compensation is the practice of granting ownership shares or options to employees as part of their compensation package. For startups, equity serves as a tool to attract talent, align incentives, and conserve cash.\n\nCommon types of equity compensation include:\n\n1. Stock options: Rights to purchase shares at a fixed price\n2. Restricted stock: Shares subject to vesting conditions\n3. Restricted stock units (RSUs): Promises to grant shares upon vesting\n4. Employee stock purchase plans: Programs allowing employees to purchase stock at a discount\n\nFair equity distribution typically follows patterns based on employee seniority, contribution, and market norms. Executives might receive 1-5%, early employees 0.1-1%, and later employees smaller percentages. Vesting schedules, typically four years with a one-year cliff, help ensure long-term alignment.",
    category: "HR",
    first_letter: "E"
  }
];

export const seedContent = async () => {
  // Check if content already exists
  const { data: existingContent, error: checkError } = await supabase
    .from('learning_content')
    .select('id')
    .limit(1);
    
  if (checkError) {
    console.error("Error checking for existing content:", checkError);
    return { success: false, error: checkError };
  }
  
  if (existingContent && existingContent.length > 0) {
    console.log("Content already exists, skipping seed");
    return { success: true, message: "Content already exists" };
  }
  
  // Add the seed content
  const processedContent = sampleContent.map(item => ({
    id: item.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    ...item
  }));
  
  const { error: insertError } = await supabase
    .from('learning_content')
    .insert(processedContent);
    
  if (insertError) {
    console.error("Error seeding content:", insertError);
    return { success: false, error: insertError };
  }
  
  return { success: true, message: "Content seeded successfully" };
};
