// components/HeroBanner/scroll-indicator.tsx
'use client';

import { MotionDiv } from './motion-types';

export function ScrollIndicator() {
  return (
    <MotionDiv
      style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <span className="text-sm text-white/80">Scroll to explore</span>
      <MotionDiv
        style={{
          width: '2px',
          height: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        }}
        animate={{
          scaleY: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </MotionDiv>
  );
}
