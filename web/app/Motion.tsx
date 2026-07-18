"use client";

import { motion, MotionConfig, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){
  const reduce = useReducedMotion();
  return <MotionConfig reducedMotion="user"><motion.div className={className} initial={reduce ? false : {opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.72,delay,ease:[.16,1,.3,1]}}>{children}</motion.div></MotionConfig>;
}

export function HeroMotion({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){
  const reduce = useReducedMotion();
  return <MotionConfig reducedMotion="user"><motion.div className={className} initial={reduce ? false : {opacity:0,y:26,scale:.992}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.9,delay,ease:[.16,1,.3,1]}}>{children}</motion.div></MotionConfig>;
}

export function PhotoMotion({children,className=""}:{children:ReactNode;className?:string}){
  const reduce = useReducedMotion();
  return <MotionConfig reducedMotion="user"><motion.div className={className} initial={reduce ? false : {opacity:.35,scale:1.025}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.12}} transition={{duration:1.05,ease:[.16,1,.3,1]}}>{children}</motion.div></MotionConfig>;
}

export function ScrollProgress(){
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll();
  const scaleX = useSpring(scrollYProgress,{stiffness:110,damping:24,mass:.28});
  if(reduce) return null;
  return <motion.div className="scrollProgress" style={{scaleX}} aria-hidden="true" />;
}
