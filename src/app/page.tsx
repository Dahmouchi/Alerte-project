"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Hero1 } from "./_components/Hero";
import Header from "./_components/Header";
// components/VespaSection.js
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import VideoPlayer from "./_components/VideoPlayer";
import Link from "next/link";

const VespaSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const res = {
    heading: "Soumission/Consultation des ",
    heading2: "Alertes",
    description:
      "Tout salarié du Groupe, ainsi que toute personne visée par les lois en vigueur (candidat à l’emploi, ancien collaborateur, actionnaire et associé, collaborateur extérieur et occasionnel, fournisseur) a la possibilité de signaler des faits portant sur un crime, un délit, une menace ou un préjudice pour l’intérêt général, une violation d’un engagement international ratifié par la France notamment, en utilisant la plateforme  CompliRisk.",
    buttons: {
      primary: {
        text: "Crée un Profil",
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
        ease: "easeOut",
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden bg-contain bg-center" style={{backgroundImage:'url("Element.png")'}}>
      {/* Background elements */}
      <div className="z-50">
        <Header />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.1 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="w-64 h-64 rounded-full bg-blue-600 blur-xl"
        ></motion.div>
      </div>

      {/* Content container */}
      <div className="container mx-auto lg:px-10 px-4 py-10 relative z-10">
        {/* Navigation */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-pretty text-3xl font-bold lg:text-6xl"
              >
                {res.heading}
                <span className="text-red-600">{res.heading2}</span>
              </motion.h1>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl"></p>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex gap-2 w-full sm:flex-row lg:justify-start flex-col"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600"
                >
                  {res.description}
                </motion.p>
              </motion.div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              className="my-4 flex items-center gap-2">
                {res.buttons.primary && (
                  <Link
                    href={res.buttons.primary.url}
                    className="cursor-pointer "
                  >
                    <motion.button
                    variants={itemVariants}
                      type="submit"
                      className="relative bottom-0 lg:w-auto w-full cursor-pointer flex justify-center items-center gap-2 border border-blue-700 text-xl rounded-full text-[#FFF]  bg-blue-700  px-8 py-2 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
                    >
                      <span className="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
                        {res.buttons.primary.text}
                      </span>
                      <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
                        <div className="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    </motion.button>
                  </Link>
                )}
                {res.buttons.secondary && (
                  <Link
                    href={res.buttons.secondary.url}
                    className="cursor-pointer"
                  >
                    <motion.button
                    variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative bottom-0 lg:w-auto w-full flex cursor-pointer justify-center items-center gap-2 border border-[#000] text-xl rounded-full text-[#000]  bg-[#fff]  px-8 py-2 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#fff] hover:bg-blue-700 active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
                    >
                      <span className="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
                        {res.buttons.secondary.text}
                      </span>
                      <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
                        <div className="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Vespa image would go here - using placeholder */}
            <div className="bg-gray-200 rounded-xl h-96 w-full flex items-center justify-center">
              <span className="text-gray-500">
                <VideoPlayer />
              </span>
            </div>

            {/* Environmentally friendly badge 
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs"
            >
              <p className="text-sm font-medium text-gray-700">
                VESPA MATIC IS AN ENVIRONMENTALLY FRIENDLY CHOICE WITH AN INDICATOR THAT IS EFFICIENT IN FUEL
              </p>
            </motion.div>*/}
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 20 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -bottom-10 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs"
            >
              <p className="text-sm font-medium text-gray-700">
              Une violation d&apos;un engagement international ratifié par la France notamment, en utilisant la plateforme  CompliRisk.
              </p>
            </motion.div>
            {/* Classic badge */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-blue-100 px-6 py-2 rounded-full"
            >
              <span className="font-bold text-blue-800">Alertes</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating circles decoration */}
      {isVisible && (
        <>
          <motion.div
            initial={{ x: -100, y: -100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-blue-200 blur-lg"
          />
          <motion.div
            initial={{ x: 100, y: 100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 0.3 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-blue-300 blur-lg"
          />
        </>
      )}
    </section>
  );
};

export default VespaSection;
