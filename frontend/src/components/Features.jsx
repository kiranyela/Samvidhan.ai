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
  <h1 className="text-3xl font-semibold p-5 text-gray-700">Features</h1>
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
