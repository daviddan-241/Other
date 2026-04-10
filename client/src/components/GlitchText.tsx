import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    // Only glitch occasionally
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        const chars = "!@#$%^&*()<>?{}[]|";
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const randomPos = Math.floor(Math.random() * text.length);
        const newText = text.split("");
        newText[randomPos] = randomChar;
        setDisplayText(newText.join(""));
        
        // Reset quickly
        setTimeout(() => setDisplayText(text), 100);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.span 
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
    </motion.span>
  );
}
