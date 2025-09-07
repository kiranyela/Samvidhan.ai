import React, { useEffect, useState ,useRef} from "react";

const TimelineCard = ({
  icon: Icon,
  title,
  description,
  bgColor,
  isLast,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    const currentRef = stepRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setTimeout(() => {
              setIsVisible(true);
            }, index * 0);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [index, isVisible]);
  return (
    <div ref={stepRef} className="flex items-start mb-8 md:mb-12">
      
      <div className="flex flex-col items-center mr-4 md:mr-6">
        <div
          className={`${bgColor} rounded-full p-3 md:p-4 shadow-lg z-10 transfrom transition-all duration-1000 ease-out hover:scale-110 ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-16 opacity-0 scale-75"
          }`}
          style={{
            transitionDelay: isVisible ? `${index * 200}ms` : `0ms`,
          }}
        >
          <img src={Icon} alt={title} className="w-6 h-6 md:w-8 md:h-8 text-white"/>
        </div>
        {!isLast && (
          <div
            className={`w-1 h-16 md:h-20 bg-gradient-to-b from-gray-300 mt-2 transform transition-all duration-800 origin-top ${
              isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`}
            style={{
              transitionDelay: isVisible ? `${index * 200 + 400}ms` : "0ms",
            }}
          ></div>
        )}
      </div>

      <div className="flex-1 pb-8">
        <div
          className={`bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-gray-200 hover:shadow-lg transform transition-all duration-1000 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
          }`}
          style={{
            transitionDelay: isVisible ? `${index * 200 + 200}ms` : "0ms",
          }}
        >
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard