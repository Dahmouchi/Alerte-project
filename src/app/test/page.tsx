"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import VideoPlayer from "../_components/VideoPlayer";
import Link from "next/link";
import Header from "../_components/Header";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const content = {
    heading: "Soumission & Consultation des ",
    heading2: "Alertes",
    description:
      "Tout salarié du Groupe, ainsi que toute personne visée par les lois en vigueur (candidat à l'emploi, ancien collaborateur, actionnaire et associé, collaborateur extérieur et occasionnel, fournisseur) a la possibilité de signaler des faits portant sur un crime, un délit, une menace ou un préjudice pour l'intérêt général.",
    buttons: {
      primary: {
        text: "Créer un Profil",
        url: "/user",
      },
      secondary: {
        text: "S'identifier",
        url: "/user/dashboard",
      },
    },
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
<section className="relative min-h-screen bg-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/bg5.jpg')" }}>
  {/* Header - Increased z-index */}
  <div className="relative z-50 bg-white shadow"> {/* Changed from just <Header /> */}
    <Header />
  </div>

  {/* Background elements - Lower z-index */}
  <div className="absolute inset-0 overflow-hidden z-0"> {/* Added z-0 */}
    <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]" />

    {/* Animated gradient blob */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 blur-3xl z-0"
    />
  </div>

  {/* Content container - Mid z-index */}
  <div className="container mx-auto  relative z-10">
        <div className="grid lg:grid-cols-1 items-center">
          {/* Left column */}
          <div className="flex flex-col w-full lg:p-10 p-4 ">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 w-full text-center"
              >
                {content.heading}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                  {content.heading2}
                </span>{" "}
              </motion.h1>
              <div className="w-full flex items-center justify-center">
              <motion.p
                variants={itemVariants}
                className="mt-6 text-lg leading-8 text-gray-600 max-w-4xl w-full text-center "
              >
                {content.description}
              </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative lg:hidden my-4"
              >
                {/* Modern device mockup */}
                <div className="relative mx-auto w-full max-w-[90vw]">
                  {/* macOS Window Container */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden shadow-xl border border-gray-300">
                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between bg-gray-200 px-3 py-2 border-b border-gray-300">
                      {/* Traffic Light Buttons */}
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffa500] transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1aab29] transition-colors"></div>
                      </div>

                      {/* Window Title */}
                      <div className="text-xs text-gray-600 font-medium truncate px-2">
                        Alertes - CompliRisk
                      </div>

                      {/* Spacer */}
                      <div className="w-12"></div>
                    </div>

                    {/* Window Content - Maintains 1138:640 (≈16:9) aspect ratio */}
                    <div className="relative pb-[56.25%]">
                      {" "}
                      {/* 16:9 aspect ratio (640/1138 ≈ 0.562) */}
                      <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <div className="w-full h-full">
                          <VideoPlayer />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-md flex items-center"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Alertes en direct
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="w-full flex flex-col sm:flex-row gap-4  items-center justify-center mt-4"
              >
                {content.buttons.primary && (
                  <Link
                    href={content.buttons.primary.url}
                    className="group relative lg:w-auto w-full inline-flex items-center justify-center px-6 py-3 overflow-hidden text-white bg-blue-600 rounded-full transition-all duration-300 ease-out hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:bg-white hover:text-blue-600"
                  >
                    <span className="relative text-sm font-medium md:text-base">
                      {content.buttons.primary.text}
                    </span>
                    <span className="absolute right-0 w-8 h-8 -mr-2 transform translate-x-10 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 transition-all duration-300 ease-in-out" />
                  </Link>
                )}

                {content.buttons.secondary && (
                  <Link
                    href={content.buttons.secondary.url}
                    className="group bg-white lg:w-auto  w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden text-gray-900 border border-gray-400 rounded-full transition-all duration-300 ease-out hover:border-blue-600 hover:text-blue-600"
                  >
                    <span className="relative text-sm font-medium md:text-base">
                      {content.buttons.secondary.text}
                    </span>
                    <span className="absolute left-0 w-8 h-8 -ml-2 transform -translate-x-10 bg-blue-600 opacity-40 rotate-12 group-hover:translate-x-32 transition-all duration-300 ease-in-out" />
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Right column - Video Player */}
          <div className="w-full flex items-center justify-center">
          <div className="flex items-center justify-center w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:block hidden w-full"
            >
              {/* Modern device mockup */}
              <div className="relative mx-auto w-full max-w-[90vw]">
                {/* macOS Window Container */}
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-xl border border-gray-300">
                  {/* Window Title Bar */}
                  <div className="flex items-center justify-between bg-gray-200 px-3 py-2 border-b border-gray-300">
                    {/* Traffic Light Buttons */}
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffa500] transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1aab29] transition-colors"></div>
                    </div>

                    {/* Window Title */}
                    <div className="text-xs text-gray-600 font-medium truncate px-2">
                      Alertes - CompliRisk
                    </div>

                    {/* Spacer */}
                    <div className="w-12"></div>
                  </div>

                  {/* Window Content - Maintains 1138:640 (≈16:9) aspect ratio */}
                  <div className="relative pb-[56.25%]">
                    {" "}
                    {/* 16:9 aspect ratio (640/1138 ≈ 0.562) */}
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <div className="w-full h-full">
                        <VideoPlayer />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-md flex items-center"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">
                  Alertes en direct
                </span>
              </motion.div>
            </motion.div>
          </div>
          </div>
        </div>
      </div>

      {/* Floating decoration elements */}
      {isVisible && (
        <>
          <motion.div
            initial={{ x: -100, y: -100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-xl"
          />
          <motion.div
            initial={{ x: 100, y: 100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 blur-xl"
          />
        </>
      )}

      {/* Divider */}
      {/* Contact Info
      <div className="flex items-center justify-center w-full">
        <div className="grid grid-cols-1 w-3/4 md:grid-cols-3 text-white gap-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-full px-8 py-4">
          <div className="text-center border-r-2 border-blue-200 py-4">
            <h3 className="text-xl font-semibold mb-4">Pay Us a Visit</h3>
            <p className="">Union St. Seattle, WA 98101, United States</p>
          </div>

          <div className="text-center border-r-2 border-blue-200 py-4">
            <h3 className="text-xl font-semibold mb-4">Give Us a Call</h3>
            <p className="">(110) 1111-1010</p>
          </div>

          <div className="text-center py-4">
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
            <p className="">Contact@HydraVTech.com</p>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
