"use client";

import { useState, useEffect } from "react";
import Newsletter from "./Newsletter";

export default function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter-dismissed");
    const subscribed = localStorage.getItem("newsletter-subscribed");
    
    if (!dismissed && !subscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("newsletter-dismissed", "true");
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Newsletter 
      onClose={handleClose}
      className="animate-in slide-in-from-bottom duration-500"
    />
  );
}