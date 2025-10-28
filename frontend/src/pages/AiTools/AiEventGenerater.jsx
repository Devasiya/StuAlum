import { useState } from "react";
import EventForm from "../../components/AiTools/EventForm";
import OutputDisplay from "../../components/AiTools/OutputForm";

const AiEventGenerater = () => {
  const [output, setOutput] = useState("");
  return(
    <div className="min-h-screen bg-[#18181B]-100 p-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        🎉 AI Event Planner
      </h1>
      <div className="max-w-4xl mx-auto">
        <EventForm setOutput={setOutput} />
        <OutputDisplay output={output} />
      </div>
    </div>
  );
}

export default AiEventGenerater;