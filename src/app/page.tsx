/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import VideoPlayer from "./_components/VideoPlayer";
import Link from "next/link";
import Header from "./_components/Header";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const content = {
    heading: "Soumission & Consultation des ",
    heading2: "Alertes",
    description:
      "CompliVox vous offre un canal sécurisé pour signaler tout comportement préoccupant ou contraire à l’éthique, que vous soyez collaborateur, ancien employé, client, partenaire ou fournisseur.",
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
  const scrollToSection = (id: any) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
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
    <div>
      <section
        className="relative  bg-white overflow-hidden bg-cover bg-center scroll-smooth"
        style={{ backgroundImage: "url('/bg5.jpg')" }}
      >
        {/* Header - Increased z-index */}
        <div className="relative z-50">
          {" "}
          {/* Changed from just <Header /> */}
          <Header />
        </div>

        {/* Background elements - Lower z-index */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {" "}
          {/* Added z-0 */}
          <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]" />
          {/* Animated gradient blob */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 blur-3xl z-0"
          />
        </div>

        {/* Content container - Mid z-index */}
        <div className="container mx-auto lg:py-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:mt-8">
            {/* Left column */}
            <div className="flex flex-col w-full lg:p-10 p-4 place-items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 w-full lg:text-left text-center"
                >
                  {content.heading}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                    {content.heading2}
                  </span>{" "}
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl w-ful lg:text-left text-center"
                >
                  {content.description}
                </motion.p>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 mt-4"
                >
                  <Link
                    href="/user/login"
                    className="px-8  py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    Faire un signalement
                  </Link>
                  <div
                    onClick={() => scrollToSection("details")}
                    className="px-8 cursor-pointer py-4 bg-white text-blue-600 font-medium rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-center"
                  >
                    En savoir plus
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right column - Video Player */}
            <div className="flex items-center justify-center w-full place-items-center">
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
      </section>
      <section className="relative bg-white overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white z-0" />

        {/* Floating gradient blobs */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>
        {/* Main content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10  w-full">
          <div className="space-y-8" id="details">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center w-full"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Signalez en toute confiance
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Que vous soyez collaborateur, ancien salarié, client, partenaire
                externe ou fournisseur, CompliVox vous permet de signaler en
                toute sécurité un fait préoccupant ou contraire à
                l&apos;éthique.
              </p>
            </motion.div>

            {/* CTA Buttons */}
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-10">
            {/* Left column - Text content */}

            {/* Right column - Feature cards */}
            {/* Why report card */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-6 h-6 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Pourquoi signaler ?
                </h3>
                <p className="text-gray-600 mb-4">
                  Un signalement n&apos;est pas une dénonciation. C&apos;est une
                  action responsable.
                </p>
                <ul className="space-y-3">
                  {[
                    "Prévenir les dérives avant qu&apos;elles ne causent de réels dommages",
                    "Renforcer la culture de l&apos;éthique, du respect et de la transparence",
                    "Protéger les personnes, les valeurs et la réputation de l&apos;organisation",
                    "Faire entendre sa voix dans un cadre neutre, confidentiel et sécurisé",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="ml-3 text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <div className="mt-2 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Ce que vous pouvez faire avec CompliVox
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      <strong>Signaler une situation :</strong> Transmettez un
                      fait, un doute ou une situation sensible que vous jugez
                      contraire à l&apos;éthique, aux valeurs de votre
                      organisation ou à la loi.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      <strong>Suivre votre alerte :</strong> Votre signalement
                      ne part pas dans le vide. Un espace confidentiel vous est
                      réservé pour suivre l&apos;évolution.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Guarantees card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-6 h-6 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Ce que CompliVox vous garantit
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "🔐",
                    title: "Anonymat ou identité",
                    text: "Vous choisissez. Aucun identifiant ne vous sera demandé si vous ne le souhaitez.",
                  },
                  {
                    icon: "🛠️",
                    title: "Données protégées",
                    text: "Vos informations sont chiffrées dès la saisie et hébergées de manière sécurisée.",
                  },
                  {
                    icon: "📍",
                    title: "Suivi traçable",
                    text: "Seules les personnes autorisées peuvent accéder à votre dossier.",
                  },
                  {
                    icon: "📝",
                    title: "Accompagnement",
                    text: "Guide complet et assistance pour vous accompagner dans votre démarche.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h4 className="font-semibold text-blue-800">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* FAQ section */}
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Protection des données
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Notre engagement pour la confidentialité et la sécurité de vos
              informations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Data Processing */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Traitement des données personnelles
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Les données collectées via CompliVox le sont exclusivement dans
                le cadre du traitement d&apos;un signalement.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2">
                    Conformes à la loi 09-08 marocaine
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2">
                    Respect des standards internationaux
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2">Aucune exploitation commerciale</span>
                </li>
              </ul>
            </motion.div>

            {/* Card 2: Data Access */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Qui accède à vos données ?
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Seules les personnes formellement habilitées peuvent accéder aux
                informations.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">
                    En cas de signalement anonyme, aucune identification
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">
                    Échanges chiffrés sans identification
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Retention */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Durée de conservation
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Les données sont conservées pendant une durée limitée et
                justifiée.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="ml-3">Temps nécessaire au traitement</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="ml-3">
                    Obligations légales et réglementaires
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="ml-3">
                    Politique interne de l&apos;organisation
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Card 4: Rights */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Vos droits
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Conformément à la loi 09-08, vous pouvez exercer vos droits.
              </p>
              <div className="space-y-3">
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800">
                    Droits disponibles :
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-amber-700">
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-4 w-4 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">Accès et rectification</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-4 w-4 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">Opposition ou suppression</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-4 w-4 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        Information sur les traitements
                      </span>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500">
                  Pour exercer ces droits, contactez le responsable de
                  traitement désigné par l&apos;organisation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
