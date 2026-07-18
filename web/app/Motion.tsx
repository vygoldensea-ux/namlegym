"use client";

import { motion, MotionConfig, useReducedMotion, useScroll } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){
  const reduce = useReducedMotion();
  return <MotionConfig reducedMotion="user"><motion.div className={className} initial={reduce ? false : {opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.1}} transition={{duration:.58,delay:Math.min(delay,.12),ease:[.16,1,.3,1]}}>{children}</motion.div></MotionConfig>;
}

export function HeroMotion({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){
  const reduce = useReducedMotion();
  return <MotionConfig reducedMotion="user"><motion.div className={className} initial={reduce ? false : {opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.68,delay:Math.min(delay,.12),ease:[.16,1,.3,1]}}>{children}</motion.div></MotionConfig>;
}

export function PhotoMotion({children,className=""}:{children:ReactNode;className?:string}){
  const reduce = useReducedMotion();
  return <MotionConfig reducedMotion="user"><motion.div className={className} initial={reduce ? false : {opacity:.48,scale:1.025}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.08}} transition={{duration:.72,ease:[.16,1,.3,1]}}>{children}</motion.div></MotionConfig>;
}

export function ScrollProgress(){
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll();
  if(reduce) return null;
  return <motion.div className="scrollProgress" style={{scaleX:scrollYProgress}} aria-hidden="true" />;
}
