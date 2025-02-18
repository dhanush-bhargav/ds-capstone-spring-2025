import React from "react";

const StanceSelection = ({ setStance, setStep }) => {
  return (
    <div>
      <h2>What is your stance?</h2>
      <button onClick={() => { setStance("Yes"); setStep(3); }} className="mr-4 p-2 border">Yes</button>
      <button onClick={() => { setStance("No"); setStep(3); }} className="p-2 border">No</button>
    </div>
  );
};

export default StanceSelection;
