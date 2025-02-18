
import React, { useState } from "react";
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";

const FinalEvaluation = ({ question, stance, strength, setFinalStance, setFinalStrength }) => {
  const [userFinalStance, setUserFinalStance] = useState("");
  const [userFinalStrength, setUserFinalStrength] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setFinalStance(userFinalStance);
    setFinalStrength(userFinalStrength);
    setSubmitted(true);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">Final Evaluation</Typography>
      
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Question:</Typography>
      <Typography>{question}</Typography>

      {!submitted ? (
        <>
          {/* Final Stance Selection */}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>What is your final stance?</Typography>
          <RadioGroup row value={userFinalStance} onChange={(e) => setUserFinalStance(e.target.value)}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Final Strength Rating */}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>Rate how strongly you feel about your final stance</Typography>
          <RadioGroup row value={userFinalStrength} onChange={(e) => setUserFinalStrength(e.target.value)}>
            {[...Array(10)].map((_, i) => (
              <FormControlLabel key={i} value={i + 1} control={<Radio />} label={i + 1} />
            ))}
          </RadioGroup>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, width: "100%" }}
            onClick={handleSubmit}
            disabled={!userFinalStance || !userFinalStrength}
          >
            Submit Final Evaluation
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>Comparison</Typography>
          
          <Typography><strong>Initial Stance:</strong> {stance}</Typography>
          <Typography><strong>Initial Strength:</strong> {strength}/10</Typography>
          <Typography><strong>Final Stance:</strong> {userFinalStance}</Typography>
          <Typography><strong>Final Strength:</strong> {userFinalStrength}/10</Typography>
        </>
      )}
    </Box>
  );
};

export default FinalEvaluation;











// import React, { useState } from "react";
// import "./FinalEvaluation.css"; // Ensure this CSS file exists

// const FinalEvaluation = ({ question, initialStance, initialStrength }) => {
//   const [finalStance, setFinalStance] = useState("");
//   const [finalStrength, setFinalStrength] = useState(null);

//   const handleSubmit = () => {
//     alert(`Final Stance: ${finalStance}, Final Strength: ${finalStrength}/10`);
//   };

//   return (
//     <div className="final-evaluation-container">
//       <h2 className="header">Final Evaluation</h2>
//       x
//       <p className="question"><strong>Question:</strong> {question}</p>

//       {/* Final Stance Selection */}
//       <h3 className="sub-header">What is your final stance?</h3>
//       <div className="stance-container">
//         <label className={`stance-button ${finalStance === "Yes" ? "selected" : ""}`}>
//           <input type="radio" name="stance" value="Yes" onChange={(e) => setFinalStance(e.target.value)} />
//           Yes
//         </label>
//         <label className={`stance-button ${finalStance === "No" ? "selected" : ""}`}>
//           <input type="radio" name="stance" value="No" onChange={(e) => setFinalStance(e.target.value)} />
//           No
//         </label>
//       </div>

//       {/* Final Strength Rating */}
//       <h3 className="sub-header">Rate how strongly you feel about your final stance</h3>
//       <div className="radio-group">
//         {[...Array(10)].map((_, i) => (
//           <label key={i} className={`radio-label ${finalStrength == i + 1 ? "selected" : ""}`}>
//             <input
//               type="radio"
//               name="strength"
//               value={i + 1}
//               checked={finalStrength == i + 1}
//               onChange={(e) => setFinalStrength(e.target.value)}
//             />
//             <span className="radio-span">{i + 1}</span>
//           </label>
//         ))}
//       </div>

//       {/* Submit Button */}
//       <button className="submit-btn" onClick={handleSubmit} disabled={!finalStance || !finalStrength}>
//         Submit Final Evaluation
//       </button>

//       {/* Display Initial and Final Ratings */}
//       {finalStance && finalStrength && (
//         <div className="evaluation-summary">
//           <h3 className="sub-header">Comparison</h3>
//           <p><strong>Initial Stance:</strong> {initialStance}</p>
//           <p><strong>Initial Strength:</strong> {initialStrength}/10</p>
//           <p><strong>Final Stance:</strong> {finalStance}</p>
//           <p><strong>Final Strength:</strong> {finalStrength}/10</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FinalEvaluation;



















// // import React, { useState } from "react";

// // const FinalEvaluation = ({ question, initialStance, initialStrength, setStep }) => {
// //   const [finalStance, setFinalStance] = useState("");
// //   const [finalStrength, setFinalStrength] = useState(null);

// //   const handleSubmit = () => {
// //     setStep(11); // Move to the next step if applicable
// //   };

// //   return (
// //     <div className="text-center p-6">
// //       <h2 className="text-2xl font-bold mb-4">Final Evaluation</h2>

// //       {/* Display Question */}
// //       <p className="text-lg font-semibold">{`Question: ${question}`}</p>

// //       {/* User selects final stance */}
// //       <div className="my-4">
// //         <p className="text-md font-semibold">Your final stance:</p>
// //         <div className="flex justify-center gap-4">
// //           <button
// //             className={`p-2 border rounded ${finalStance === "Yes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
// //             onClick={() => setFinalStance("Yes")}
// //           >
// //             Yes
// //           </button>
// //           <button
// //             className={`p-2 border rounded ${finalStance === "No" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
// //             onClick={() => setFinalStance("No")}
// //           >
// //             No
// //           </button>
// //         </div>
// //       </div>

// //       {/* User selects final strength using radio buttons */}
// //       <div className="my-4">
// //         <p className="text-md font-semibold">Rate your final stance strength (1-10):</p>
// //         <div className="flex justify-center space-x-4">
// //           {[...Array(10)].map((_, i) => (
// //             <label key={i} className="flex items-center space-x-2">
// //               <input
// //                 type="radio"
// //                 name="finalStrength"
// //                 value={i + 1}
// //                 checked={finalStrength == i + 1}
// //                 onChange={(e) => setFinalStrength(e.target.value)}
// //                 className="radio-input"
// //               />
// //               <span>{i + 1}</span>
// //             </label>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Show Initial and Final Responses */}
// //       <div className="my-6 p-4 bg-gray-100 rounded">
// //         <h3 className="text-lg font-bold mb-2">Comparison</h3>
// //         <p><strong>Initial Stance:</strong> {initialStance}</p>
// //         <p><strong>Initial Strength Rating:</strong> {initialStrength}/10</p>
// //         <hr className="my-2" />
// //         <p><strong>Final Stance:</strong> {finalStance || "Not Selected"}</p>
// //         <p><strong>Final Strength Rating:</strong> {finalStrength ? `${finalStrength}/10` : "Not Selected"}</p>
// //       </div>

// //       {/* Submit Button */}
// //       <button
// //         onClick={handleSubmit}
// //         disabled={!finalStance || !finalStrength}
// //         className={`mt-6 w-full py-2 rounded transition duration-200 ${
// //           finalStance && finalStrength ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"
// //         }`}
// //       >
// //         Submit Final Evaluation
// //       </button>
// //     </div>
// //   );
// // };

// // export default FinalEvaluation;
