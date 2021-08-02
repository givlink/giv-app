const Steps = ({ activeStepIndex, steps = [] }) => {
  return (
    <ol className="flex items-center space-x-4">
      {steps.map((_, idx) => (
        <li key={idx}>
          {idx < activeStepIndex ? (
            <span className="block w-2.5 h-2.5 bg-giv-blue rounded-full hover:bg-indigo-900"></span>
          ) : idx === activeStepIndex ? (
            <span
              className="relative flex items-center justify-center"
              aria-current="step"
            >
              <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                <span className="w-full h-full rounded-full bg-blue-200 animate-pulse" />
              </span>
              <span
                className="relative block w-2.5 h-2.5 bg-giv-blue rounded-full"
                aria-hidden="true"
              />
            </span>
          ) : (
            <span className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400"></span>
          )}
        </li>
      ))}
    </ol>
  );
};
export default Steps;
