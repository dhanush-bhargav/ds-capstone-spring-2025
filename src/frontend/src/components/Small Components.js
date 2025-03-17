import React from "react";

export const Instructions = (props) => {
  props.updateLoading(false);
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      <p className="mb-4">
        Before proceeding, please read the following instructions carefully:
      </p>
      <ul className="text-left list-disc list-inside mb-4">
        <li>You will now generate arguments for and against your stance.</li>
        <li>Try to be as detailed as possible.</li>
        <li>Consider perspectives from different viewpoints.</li>
        <li>You will later categorize and evaluate these arguments.</li>
      </ul>
      <button 
        onClick={() => props.updateStep(3)} 
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};
