
import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center mb-12 ${className}`}
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange/20 to-orange-500/20 blur-3xl rounded-full transform scale-150"></div>
        <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
          {title}
        </h2>
      </div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
