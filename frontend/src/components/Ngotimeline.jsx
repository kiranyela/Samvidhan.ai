import TimelineCard from "./TimelineCard";
import ActionPlannerIcon from "../assets/NgoTimeline/ActionPlanning.png"
import IssuesIcon from"../assets/NgoTimeline/Issues.png"
import ResolutionIcon from "../assets/NgoTimeline/resolution.png"
import SelectionIcon from "../assets/NgoTimeline/Selection.png"
import UpdatesIcon from "../assets/NgoTimeline/Updates.png"
import VerificationIcon from "../assets/NgoTimeline/Verification.png"


const NgoTimeline = () => {
const steps = [
  {
    icon: IssuesIcon,
    title: "Issues",
    description:
      "NGOs access issues posted by citizens on the platform, categorized by themes such as education, healthcare, or labor rights.",
    bgColor: "bg-yellow-500",
  },
  {
    icon: VerificationIcon,
    title: "Verification",
    description:
      "The NGO reviews and verifies issue details, mapped constitutional articles, and relevant government departments.",
    bgColor: "bg-green-500",
  },
  {
    icon: SelectionIcon,
    title: "Selection",
    description:
      "NGOs prioritize and select issues based on urgency, impact, and feasibility for action.",
    bgColor: "bg-purple-500",
  },
  {
    icon: ActionPlannerIcon,
    title: "Action Planning",
    description:
      "Decide on the intervention strategy: guiding the citizen, filing an official complaint, or preparing for PIL in systemic cases.",
    bgColor: "bg-blue-500",
  },
  {
    icon: UpdatesIcon,
    title: "Updates",
    description:
      "NGOs keep citizens updated about the progress and collaborate with other organizations if needed.",
    bgColor: "bg-pink-500",
  },
  {
    icon: ResolutionIcon,
    title: "Resolution",
    description:
      "Once the issue is resolved or forwarded, the NGO documents actions taken for transparency and accountability.",
    bgColor: "bg-red-500",
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 md:py-12 overflow-hidden">
      <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight pl-23 pb-10">For NGOs</h1>
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

export default NgoTimeline;
