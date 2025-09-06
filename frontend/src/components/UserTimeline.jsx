import React, { useEffect, useState ,useRef} from "react";
import TimelineCard from "./TimelineCard";
import ProblemIcon from '../assets/UserTimeline/problem.png'
import AnalysisIcon from '../assets/UserTimeline/analysis.png'
import GuidanceIcon from '../assets/UserTimeline/guidances.png'
import CommunityIcon from '../assets/UserTimeline/communities.png'


const UserTimeline = () => {
  const steps = [
    {
      icon: ProblemIcon,
      title: "Problem Input",
      description:
        "Enter your constitutional rights issue in natural language through text or voice input. Our system understands complex legal scenarios in simple terms.",
      bgColor: "bg-blue-500",
    },
    {
      icon: AnalysisIcon,
      title: "Constitutional Mapping",
      description:
        "AI analyzes your issue and identifies relevant fundamental rights, constitutional articles, and applicable legal frameworks for your case.",
      bgColor: "bg-green-500",
    },
    {
      icon: GuidanceIcon,
      title: "Redressal Guidance",
      description:
        "Get personalized guidance with complaint portals, authority contacts, legal remedies, and step-by-step procedures to address your issue.",
      bgColor: "bg-orange-500",
    },
    {
      icon: CommunityIcon,
      title: "Community & NGO Support",
      description:
        "Connect with NGOs, activists, and legal aid organizations. Share your case for potential PIL (Public Interest Litigation) consideration.",
      bgColor: "bg-purple-500",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 md:py-12 overflow-hidden">
      <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight pl-23 pb-10">For Citizens</h1>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="relative">
          {steps.map((step, index) => (
            <TimelineCard
              key={index}
              index={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              bgColor={step.bgColor}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTimeline;
