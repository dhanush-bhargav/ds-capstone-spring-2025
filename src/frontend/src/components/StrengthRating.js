import React, { useState } from "react";
import "./StrengthRating.css"; // Import the CSS file

const StrengthRating = ({ setStrength, setStep }) => {
  const [strength, setLocalStrength] = useState(null);

  const handleChange = (event) => {
    const value = event.target.value;
    setLocalStrength(value);
    setStrength(value);
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-4">How strongly do you feel about this?</h2>
      <p className="text-gray-600 mb-4">
        Select a number where <strong>1</strong> means <strong>Strongly Disagree</strong> and <strong>10</strong> means <strong>Strongly Agree</strong>.
      </p>

      {/* Radio Buttons with External CSS */}
      <div className="radio-group">
        {[...Array(10)].map((_, i) => (
          <label key={i} className="radio-label">
            <input
              type="radio"
              name="strength"
              value={i + 1}
              checked={strength == i + 1}
              onChange={handleChange}
              className="radio-input"
            />
            <span className="radio-span">{i + 1}</span>
          </label>
        ))}
      </div>

      {strength && <p className="text-lg font-semibold mt-2 text-gray-800">You selected: {strength} / 10</p>}

      <button
        onClick={() => setStep(4)}
        disabled={!strength}
        className={`mt-6 w-full py-2 rounded transition duration-200 ${
          strength ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default StrengthRating;
