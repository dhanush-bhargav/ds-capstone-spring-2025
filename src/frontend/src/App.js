import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import QuestionSelection from "./components/QuestionSelection";
import Instructions from "./components/Instructions";
import ArgumentManager from "./components/ArgumentManager"; // ✅ Use the correct merged component
import Categorization from "./components/Categorization";
import SortedArguments from "./components/SortedArguments";
import ImplicationRating from "./components/ImplicationRating";
import FinalEvaluation from "./components/FinalEvaluation";
import StepperComponent from "./components/StepperComponent";
import FloatingNavButtons from "./components/FloatingNavButtons";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [stance, setStance] = useState("");
  const [strength, setStrength] = useState(5);
  const [finalStance, setFinalStance] = useState("");
  const [finalStrength, setFinalStrength] = useState(5);
  const [userArguments, setUserArguments] = useState([]);
  const [allArguments, setAllArguments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratedArguments, setRatedArguments] = useState([]);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
  };

  const handleNext = () => {
    console.log(`Current Step: ${step}`);

    setStep((prevStep) => {
      switch (prevStep) {
        case 1:
          return 2; // Move to Instructions
        case 2:
          return 3; // Move to Generate & Review Arguments
        case 3:
          if (userArguments.length === 0) {
            console.warn("⚠️ No arguments found. Cannot proceed.");
            return prevStep; // Stay on the Argument Manager step
          }
          return 4; // Move to Categorization
        case 4:
          return 5; // Move to Sorted Arguments
        case 5:
          return 6; // Move to Implication Rating
        case 6:
          return 7; // Move to Final Evaluation
        default:
          return prevStep; // Stay on the same step if no match
      }
    });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    console.log("Updated userArguments:", userArguments);
  }, [userArguments]);

  return (
    <Router>
      <div className="container mx-auto p-6">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        ) : (
          <>
            <StepperComponent step={step} />
            {step === 1 && (
              <QuestionSelection
                setQuestion={setQuestion}
                setStance={setStance}
                setStrength={setStrength}
                setStep={setStep}
              />
            )}
            {step === 2 && <Instructions setStep={setStep} />}
            {step === 3 && (
              <ArgumentManager
                question={question}
                setUserArguments={setUserArguments}
                userArguments={userArguments}
                setAllArguments={setAllArguments}
                setStep={setStep}
              />
            )}
            {step === 4 && <Categorization setCategories={setCategories} setStep={setStep} />}
            {step === 5 && <SortedArguments allArguments={allArguments} categories={categories || []} setStep={setStep} />}
            {step === 6 && (
              <ImplicationRating
                allArguments={allArguments}
                setRatedArguments={setRatedArguments}
                setStep={setStep}
                categories={categories || []}
              />
            )}
            {step === 7 && (
              <FinalEvaluation
                question={question}
                stance={stance}
                strength={strength}
                finalStance={finalStance}
                finalStrength={finalStrength}
                setFinalStance={setFinalStance}
                setFinalStrength={setFinalStrength}
              />
            )}

            {/* Floating Navigation Buttons */}
            <FloatingNavButtons
              onBack={handleBack}
              onNext={handleNext}
              disableBack={step === 1}
              disableNext={step === 7}
            />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;




// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
// import LoginPage from "./components/LoginPage";
// import QuestionSelection from "./components/QuestionSelection";
// import StanceSelection from "./components/StanceSelection";
// import StrengthRating from "./components/StrengthRating";
// import Instructions from "./components/Instructions";
// import ArgumentGeneration from "./components/ArgumentGeneration";
// import ArgumentDisplay from "./components/ArgumentDisplay";
// import Categorization from "./components/Categorization";
// import SortedArguments from "./components/SortedArguments";
// import ImplicationRating from "./components/ImplicationRating.js";
// import FinalEvaluation from "./components/FinalEvaluation";
// import StepperComponent from "./components/StepperComponent";
// import FloatingNavButtons from "./components/FloatingNavButtons"; // Import floating buttons

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [step, setStep] = useState(1);
//   const [question, setQuestion] = useState("");
//   const [stance, setStance] = useState("");
//   const [strength, setStrength] = useState(5);
//   const [finalStance, setFinalStance] = useState(""); // Added final stance
//   const [finalStrength, setFinalStrength] = useState(5); // Added final strength
//   const [userArguments, setUserArguments] = useState([]);
//   const [allArguments, setAllArguments] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [ratedArguments, setRatedArguments] = useState([]);

//   const handleLogin = (username) => {
//     setIsAuthenticated(true);
//   };

//   const handleNext = () => {
//     console.log("Proceeding to next step. Current categories:", categories);
//     setStep((prev) => Math.min(prev + 1, 10));
//   };

//   const handleBack = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//   };

//   useEffect(() => {
//     console.log("Updated categories in App state:", categories);
//   }, [categories]);

//   return (
//     <Router>
//       <div className="container mx-auto p-6">
//         {!isAuthenticated ? (
//           <Routes>
//             <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
//             <Route path="*" element={<Navigate replace to="/" />} />
//           </Routes>
//         ) : (
//           <>
//             <StepperComponent step={step} />
//             {step === 1 && <QuestionSelection setQuestion={setQuestion} setStep={setStep} />}
//             {step === 2 && <StanceSelection setStance={setStance} setStep={setStep} />}
//             {step === 3 && <StrengthRating setStrength={setStrength} setStep={setStep} />}
//             {step === 4 && <Instructions setStep={setStep} />}
//             {step === 5 && <ArgumentGeneration question={question} setUserArguments={setUserArguments} setStep={setStep} />}
//             {step === 6 && <ArgumentDisplay userArguments={userArguments} setAllArguments={setAllArguments} setStep={setStep} includeAI={false} />}
//             {step === 7 && <Categorization setCategories={setCategories} setStep={setStep} />}
//             {step === 8 && <SortedArguments allArguments={allArguments} categories={categories || []} setStep={setStep} />}
//             {step === 9 && (
//               <ImplicationRating 
//                 allArguments={allArguments} 
//                 setRatedArguments={setRatedArguments} 
//                 setStep={setStep} 
//                 categories={categories || []}  // Ensure categories is never undefined
//               />
//             )}
//             {step === 10 && (
//               <FinalEvaluation 
//                 question={question} 
//                 stance={stance} 
//                 strength={strength} 
//                 finalStance={finalStance} 
//                 finalStrength={finalStrength} 
//                 setFinalStance={setFinalStance} // Pass setter functions
//                 setFinalStrength={setFinalStrength}
//               />
//             )}

//             {/* Floating Navigation Buttons */}
//             <FloatingNavButtons 
//               onBack={handleBack} 
//               onNext={handleNext} 
//               disableBack={step === 1} 
//               disableNext={step === 10} 
//             />
//           </>
//         )}
//       </div>
//     </Router>
//   );
// };

// export default App;
