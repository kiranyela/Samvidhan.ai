import React from "react";
import Featurescard from "./Featurescard";
import { motion } from "framer-motion";

function Features() {
  const featurearray = [
    { title: "Problem + Article Matcher", icon: "/assets/solution.png" },
    { title: "NGO Support", icon: "/assets/government.png" },
    { title: "Rights Awareness Zone", icon: "/assets/rights.png" },
    { title: "Direct Filing Links", icon: "/assets/links.png" },
    
  ];
  return <>
  <motion.h1
    className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight px-6 sm:px-10 pb-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    Features
  </motion.h1>
  <div className="min-h-[50vh] bg-white flex items-center justify-center p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mx-auto w-full max-w-6xl">
      { 
        featurearray.map((feature,index)=>(
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Featurescard title={feature.title} iconsrc={feature.icon}/>
          </motion.div>
        ))
      }
    </div>
  </div></>
}

export default Features;
