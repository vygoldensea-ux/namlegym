"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
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
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heroImages.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="heroMedia" aria-label="Hình ảnh không gian Foxfit">
      {heroImages.map((image, index) => (
        <motion.div
          className="heroSlide"
          key={image.src}
          initial={false}
          animate={{ opacity: index === active ? 1 : 0, scale: index === active ? 1 : 1.018 }}
          transition={{ duration: reduce ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden={index !== active}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            quality={96}
            priority={index < 2}
          />
        </motion.div>
      ))}
      <div className="heroSlideNav" aria-label="Chọn ảnh đầu trang">
        {heroImages.map((image, index) => (
          <button key={image.src} type="button" className={index === active ? "isActive" : ""} onClick={() => setActive(index)} aria-label={`Xem ảnh ${index + 1}`} aria-current={index === active ? "true" : undefined}><span /></button>
        ))}
      </div>
    </div>
  );
}
