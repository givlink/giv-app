import React from "react";
import ErrorComponent from "components/Error";
import Spinner from "components/Spinner";
import Steps from "components/InviteSteps";
import Page1 from "components/InvitePage1";
import Page2 from "components/InvitePage2";
import Page3 from "components/InvitePage3";
import Page4 from "components/InvitePage4";
import Page5 from "components/InvitePage5";
import Page6 from "components/InvitePage6";
import api from "lib/api";
import { useLocation, useParams } from "@reach/router";
import { parse } from "query-string";

const steps = [
  { id: "step1" },
  { id: "step2" },
  { id: "step3" },
  { id: "step4" },
  { id: "step5" },
];

export default function Invite() {
  const loc = useLocation();
  const searchParams = parse(loc.search);
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [data, setData] = React.useState({ code: "" });

  React.useEffect(() => {
    if (loc.hash !== "") {
      let code = loc.hash.slice(1);
      code = code.split("?")[0]; //remove params
      setData({ ...data, code });
      if (searchParams.step) {
        setActiveStepIndex(parseInt(searchParams.step));
      }
    }
  }, [loc.hash]);

  const setInviteCode = (code) => {
    setData({ ...data, code });
  };
  const handleNext = (newData) => {
    if (newData) {
      setData({ ...data, ...newData });
    }

    let nextIndex = activeStepIndex + 1;
    if (nextIndex > steps.length) nextIndex = steps.length;
    setActiveStepIndex(nextIndex);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {activeStepIndex != steps.length && (
        <div className="mt-10 mb-6">
          <Steps steps={steps} activeStepIndex={activeStepIndex} />
        </div>
      )}

      {activeStepIndex === 0 && (
        <Page1
          code={data.code}
          setInviteCode={setInviteCode}
          activeStepIndex={activeStepIndex}
          handleNext={handleNext}
        />
      )}

      {activeStepIndex === 1 && (
        <Page2
          code={data.code}
          activeStepIndex={activeStepIndex}
          handleNext={handleNext}
        />
      )}

      {activeStepIndex === 2 && (
        <Page3 activeStepIndex={activeStepIndex} handleNext={handleNext} />
      )}
      {activeStepIndex === 3 && (
        <Page4 activeStepIndex={activeStepIndex} handleNext={handleNext} />
      )}
      {activeStepIndex === 4 && (
        <Page5 activeStepIndex={activeStepIndex} handleNext={handleNext} />
      )}
      {activeStepIndex === 5 && <Page6 data={data} />}
    </div>
  );
}
