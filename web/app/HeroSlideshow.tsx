"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const heroImages = [
  { src: "/foxfit-cardio.png", alt: "Khu cardio Foxfit" },
  { src: "/foxfit-strength.png", alt: "Khu tập sức mạnh Foxfit" },
  { src: "/foxfit-reception.png", alt: "Sảnh đón tiếp Foxfit" },
  { src: "/foxfit-brand-wall.png", alt: "Không gian thương hiệu Foxfit" },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heroImages.length), 4200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div className="heroMedia" aria-label="Hình ảnh không gian Foxfit">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={heroImages[active].src}
          src={heroImages[active].src}
          alt={heroImages[active].alt}
          initial={reduce ? false : { opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.05, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>
      <div className="heroSlideNav" aria-label="Chọn ảnh đầu trang">
        {heroImages.map((image, index) => (
          <button key={image.src} type="button" className={index === active ? "isActive" : ""} onClick={() => setActive(index)} aria-label={`Xem ảnh ${index + 1}`} aria-current={index === active ? "true" : undefined}><span /></button>
        ))}
      </div>
    </div>
  );
}
