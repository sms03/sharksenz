
import { motion, AnimatePresence } from "framer-motion";

// Motion variants for common animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.2 } }
};

export const slideInLeft = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: -20, opacity: 0, transition: { duration: 0.2 } }
};

export const slideInRight = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: 20, opacity: 0, transition: { duration: 0.2 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Fade in container with staggered children
export const FadeInStagger = ({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={staggerContainer}
    transition={{
      delayChildren: delay
    }}
  >
    {children}
  </motion.div>
);

// Fade in element (to be used within a FadeInStagger)
export const FadeIn = ({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    variants={fadeIn}
    transition={{
      duration: 0.4,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Slide up element (to be used within a FadeInStagger)
export const SlideUp = ({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    variants={slideUp}
    transition={{
      duration: 0.4,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Slide in from left (to be used within a FadeInStagger)
export const SlideInLeft = ({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    variants={slideInLeft}
    transition={{
      duration: 0.4,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Slide in from right (to be used within a FadeInStagger)
export const SlideInRight = ({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    variants={slideInRight}
    transition={{
      duration: 0.4,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Standalone motion components with InView detection
export const FadeInView = ({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeIn}
    transition={{
      duration: 0.4,
      delay
    }}
  >
    {children}
  </motion.div>
);

export const SlideUpInView = ({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={slideUp}
    transition={{
      duration: 0.4,
      delay
    }}
  >
    {children}
  </motion.div>
);

// Export AnimatePresence for convenience
export { AnimatePresence };
