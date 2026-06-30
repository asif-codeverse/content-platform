"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export default function Stagger({
  children,
}: Props) {
  return (
    <motion.div
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}