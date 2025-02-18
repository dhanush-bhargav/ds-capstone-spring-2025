

import React, { useState } from "react";
import { topicsData } from "./topicsData"; // ✅ Make sure the import path is correct

const QuestionSelection = ({ setQuestion, setStep }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select a Topic</h2>

      {/* Display selected topic */}
      {selectedTopic && <p className="text-lg font-semibold">Selected Topic: {selectedTopic.name}</p>}

      {/* Topic Selection */}
      <div className="mb-4">
        {topicsData.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="block w-full p-2 my-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Display Pre-Made Questions */}
      {selectedTopic && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Select a Question</h3>
          {selectedTopic.preMadeQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => { setQuestion(q); setStep(2); }}
              className="block w-full p-2 my-1 border rounded bg-gray-300 hover:bg-gray-400"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionSelection;
