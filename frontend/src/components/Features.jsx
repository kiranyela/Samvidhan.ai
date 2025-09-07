import React from "react";
import Featurescard from "./Featurescard";

function Features() {
  const featurearray = [
    { title: "Problem + Article Matcher", icon: "/assets/solution.png" },
    { title: "NGO Support", icon: "/assets/government.png" },
    { title: "Rights Awareness Zone", icon: "/assets/rights.png" },
    { title: "Direct Filing Links", icon: "/assets/links.png" },
    
  ];
  return <>
  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight pl-10 pb-10">Features</h1>
  <div className="min-h-[50vh] bg-white flex items-center justify-center p-4">

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 mx-auto w-full max-w-6xl">
      { 
        featurearray.map((feature,index)=>(
          <Featurescard key={index} title={feature.title} iconsrc={feature.icon}/>
        )

        )
      }

    </div>
    
  </div></>
}

export default Features;
