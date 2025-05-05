"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export const AnimatedLaptop = () => {
  const controls = useAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const sequence = async () => {
      // Start with tilted position (italic effect)
      await controls.start({
        rotateX: 15,
        rotateY: -10,
        rotateZ: 3,
        scale: 0.9,
        transition: { duration: 0 }
      });
      
      // Animate to normal position
      await controls.start({
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
      });
      
      // Start video playback
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      }
    };
    sequence();
  }, [controls]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center perspective-1000 py-12 px-4"
    >
      <motion.div
        animate={controls}
        className="relative origin-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* White Laptop Mockup */}
        <div className="relative mx-auto border-gray-200 bg-gray-100 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px] shadow-xl">
          <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white">
            {/* Replace image with video element */}
            <video
              ref={videoRef}
              muted
              playsInline
              className="h-full w-full object-cover rounded-lg"
              src="/videoHero.mp4" // Replace with your video
              poster="/your-poster.jpg" // Optional placeholder
            />
          </div>
        </div>
        
        {/* Laptop Base - White version */}
        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
    <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
</div>
        
        {/* Optional 3D shadow effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-x-0 -bottom-8 h-8 bg-black blur-xl rounded-full -z-10"
        />
      </motion.div>
    </motion.div>
  );
};