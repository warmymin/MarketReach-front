import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', onClick, ...props }, ref) => {
    const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm p-6';
    const classes = `${baseClasses} ${className}`;
    
    if (onClick) {
      return (
        <motion.div
          ref={ref}
          className={`${classes} cursor-pointer`}
          onClick={onClick}
          whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
