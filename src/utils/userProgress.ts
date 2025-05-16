// XP and level calculations

// XP values for different activities
export const XP_VALUES = {
  MODULE_COMPLETION: 25, // Base XP for completing a module
};

// Level thresholds (XP needed for each level)
export const LEVEL_THRESHOLDS = [
  0,      // Level 1: Shark Novice (0+ XP)
  250,    // Level 2: Shark Student (250+ XP)
  750,    // Level 3: Shark Investor (750+ XP)
  1500,   // Level 4: Shark Advisor (1500+ XP)
  3000,   // Level 5: Shark Expert (3000+ XP)
  5000,   // Level 6: Shark Master (5000+ XP)
  7500    // Level 7: Shark Tank Worthy (7500+ XP)
];

// Module completion requirements
export const BADGE_REQUIREMENTS = {
  "Business Fundamentals": "Complete any learning module",
  "Valuation Expert": "Complete all valuation modules",
  "Metrics Master": "Complete all metrics modules",
  "Pitching Pro": "Complete all pitching modules",
  "Business Scholar": "Complete 15 modules across all categories",
  "Advanced Business": "Complete all modules across all categories"
};

// Get level name based on current level
export const getLevelName = (level: number): string => {
  const levelNames = [
    "Shark Novice",
    "Shark Student",
    "Shark Investor",
    "Shark Advisor", 
    "Shark Expert",
    "Shark Master",
    "Shark Tank Worthy"
  ];
  
  return levelNames[level - 1] || "Shark Tank Champion";
};

// Calculate level based on XP
export const calculateLevel = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1; // Default to level 1
};

// Calculate XP needed for next level
export const xpForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return 0; // Max level reached
  }
  return LEVEL_THRESHOLDS[currentLevel];
};

// Calculate progress percentage towards next level
export const levelProgressPercentage = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return 100; // Max level reached
  }
  
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextLevelXP = LEVEL_THRESHOLDS[currentLevel];
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100));
};

// Helper function to get or initialize user XP
export const getUserXP = (userEmail: string): number => {
  try {
    const xpString = localStorage.getItem(`user_xp_${userEmail}`);
    if (!xpString) return 0;
    const xp = parseInt(xpString, 10);
    return isNaN(xp) ? 0 : xp;
  } catch (error) {
    console.error("Failed to get user XP:", error);
    return 0;
  }
};

// Helper function to save user XP
export const saveUserXP = (userEmail: string, xp: number): void => {
  try {
    localStorage.setItem(`user_xp_${userEmail}`, xp.toString());
  } catch (error) {
    console.error("Failed to save user XP:", error);
  }
};

// Helper function to add XP to a user's account
export const addXP = (userEmail: string, xpToAdd: number): number => {
  try {
    const currentXP = getUserXP(userEmail);
    const newXP = currentXP + xpToAdd;
    saveUserXP(userEmail, newXP);
    return newXP;
  } catch (error) {
    console.error("Failed to add XP:", error);
    return getUserXP(userEmail);
  }
};

// Function to check and track module completion
export const checkAndUpdateBadges = (
  userModules: Array<{ title: string; category: string; completed: boolean }>,
  userBadges: Array<{ id: number; name: string; unlocked: boolean; difficulty: string }>
): Array<{ id: number; name: string; unlocked: boolean; difficulty: string }> => {
  if (!Array.isArray(userModules) || !Array.isArray(userBadges)) {
    return userBadges;
  }

  // Filter completed modules
  const completedModules = userModules.filter(m => m.completed);
  
  // Calculate completion status for different categories
  const anyModuleCompleted = completedModules.length > 0;
  const allModulesCompleted = completedModules.length === userModules.length;
  
  // Calculate category-specific completions
  const categoryCounts = userModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = { total: 0, completed: 0 };
    }
    acc[module.category].total++;
    if (module.completed) {
      acc[module.category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);
  
  // Set module completion conditions
  const valuationModulesAllCompleted = categoryCounts['valuation']?.completed === categoryCounts['valuation']?.total;
  const metricsModulesAllCompleted = categoryCounts['metrics']?.completed === categoryCounts['metrics']?.total;
  const pitchingModulesAllCompleted = categoryCounts['pitching']?.completed === categoryCounts['pitching']?.total;
  const businessScholarCompleted = completedModules.length >= 15;
    // Update completion status
  return userBadges.map(badge => {
    let shouldBeUnlocked = badge.unlocked; // Default to current state

    // Apply specific conditions for each badge
    switch(badge.name) {
      case "Business Fundamentals":
        shouldBeUnlocked = anyModuleCompleted;
        break;
      case "Valuation Expert":
        shouldBeUnlocked = valuationModulesAllCompleted;
        break;
      case "Metrics Master":
        shouldBeUnlocked = metricsModulesAllCompleted;
        break;
      case "Pitching Pro":
        shouldBeUnlocked = pitchingModulesAllCompleted;
        break;
      case "Business Scholar":
        shouldBeUnlocked = businessScholarCompleted;
        break;
      case "Advanced Business":
        shouldBeUnlocked = allModulesCompleted;
        break;
    }

    // Return updated badge
    return { ...badge, unlocked: shouldBeUnlocked };
  });
};
