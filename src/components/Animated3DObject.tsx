'use client';

import { motion } from 'framer-motion';

export default function Animated3DObject() {
  return (
    <div className="w-12 h-12 relative flex items-center justify-center [perspective:1000px]">
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ 
          rotateX: [0, 360], 
          rotateY: [0, 360] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 border border-primary/30 bg-primary/5 backdrop-blur-[1px] [transform:translateZ(24px)]" />
        {/* Back */}
        <div className="absolute inset-0 border border-primary/30 bg-primary/5 backdrop-blur-[1px] [transform:translateZ(-24px)]" />
        {/* Left */}
        <div className="absolute inset-0 border border-primary/30 bg-primary/5 backdrop-blur-[1px] [transform:rotateY(-90deg)_translateZ(24px)]" />
        {/* Right */}
        <div className="absolute inset-0 border border-primary/30 bg-primary/5 backdrop-blur-[1px] [transform:rotateY(90deg)_translateZ(24px)]" />
        {/* Top */}
        <div className="absolute inset-0 border border-primary/30 bg-primary/5 backdrop-blur-[1px] [transform:rotateX(90deg)_translateZ(24px)]" />
        {/* Bottom */}
        <div className="absolute inset-0 border border-primary/30 bg-primary/5 backdrop-blur-[1px] [transform:rotateX(-90deg)_translateZ(24px)]" />
      </motion.div>
    </div>
  );
}
