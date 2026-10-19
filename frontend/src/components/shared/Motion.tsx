import { motion, type HTMLMotionProps } from "motion/react";

type FadeProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export function FadeIn({ delay = 0, y = 8, ...props }: FadeProps) {
  return <motion.div initial={{ opacity: 0, y }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay, ease: "easeOut" }} {...props} />;
}
