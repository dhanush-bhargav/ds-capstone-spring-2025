







// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
// import LoginPage from "./components/LoginPage";
// import QuestionSelection from "./components/QuestionSelection";
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
//   const [stance, setStance] = useState(""); // Yes/No
//   const [strength, setStrength] = useState(null); // 1-10
//   const [finalStance, setFinalStance] = useState("");
//   const [finalStrength, setFinalStrength] = useState(5);
//   const [userArguments, setUserArguments] = useState([]);
//   const [allArguments, setAllArguments] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [ratedArguments, setRatedArguments] = useState([]);

//   const handleLogin = (username) => {
//     setIsAuthenticated(true);
//   };

//   // Ensure `setStep` transitions correctly and does not skip steps
//   const handleNext = () => {
//     console.log(`Proceeding from Step ${step} to Step ${step + 1}`);
  
//     if (step === 3 && userArguments.length === 0) {
//       console.warn("⚠️ No arguments found. Cannot proceed.");
//       return; // Prevent skipping argument step
//     }
  
//     setStep((prev) => Math.min(prev + 1, 8)); // ✅ Fixed max step
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
//             {step === 1 && (
//               <QuestionSelection 
//                 setQuestion={setQuestion} 
//                 setStance={setStance} 
//                 setStrength={setStrength} 
//                 setStep={setStep} 
//               />
//             )}
//             {step === 2 && <Instructions setStep={setStep} />}
//             {step === 3 && (
//               <ArgumentGeneration 
//                 question={question} 
//                 setUserArguments={setUserArguments} 
//                 setStep={setStep} 
//               />
//             )}
//             {step === 4 && (
//               <ArgumentDisplay 
//                 userArguments={userArguments} 
//                 setAllArguments={setAllArguments} 
//                 setStep={setStep} 
//                 includeAI={false} 
//               />
//             )}
//             {step === 5 && <Categorization setCategories={setCategories} setStep={setStep} />}
//             {step === 6 && <SortedArguments allArguments={allArguments} categories={categories || []} setStep={setStep} />}
//             {step === 7 && (
//               <ImplicationRating 
//                 allArguments={allArguments} 
//                 setRatedArguments={setRatedArguments} 
//                 setStep={setStep} 
//                 categories={categories || []}
//               />
//             )}
//             {step === 8 && (
//               <FinalEvaluation 
//                 question={question} 
//                 stance={stance} 
//                 strength={strength} 
//                 finalStance={finalStance} 
//                 finalStrength={finalStrength} 
//                 setFinalStance={setFinalStance} 
//                 setFinalStrength={setFinalStrength}
//               />
//             )}

//             {/* Floating Navigation Buttons */}
//             <FloatingNavButtons 
//               onBack={handleBack} 
//               onNext={handleNext} 
//               disableBack={step === 1} 
//               disableNext={step === 8} 
//             />
//           </>
//         )}
//       </div>
//     </Router>
//   );
// };

// export default App;




























import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import QuestionSelection from "./components/QuestionSelection";
import StanceSelection from "./components/StanceSelection";
import StrengthRating from "./components/StrengthRating";
import Instructions from "./components/Instructions";
import ArgumentGeneration from "./components/ArgumentGeneration";
import ArgumentDisplay from "./components/ArgumentDisplay";
import Categorization from "./components/Categorization";
import SortedArguments from "./components/SortedArguments";
import ImplicationRating from "./components/ImplicationRating.js";
import FinalEvaluation from "./components/FinalEvaluation";
import StepperComponent from "./components/StepperComponent";
import FloatingNavButtons from "./components/FloatingNavButtons"; // Import floating buttons

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [stance, setStance] = useState("");
  const [strength, setStrength] = useState(5);
  const [finalStance, setFinalStance] = useState(""); // Added final stance
  const [finalStrength, setFinalStrength] = useState(5); // Added final strength
  const [userArguments, setUserArguments] = useState([]);
  const [allArguments, setAllArguments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratedArguments, setRatedArguments] = useState([]);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
  };

  const handleNext = () => {
    console.log("Proceeding to next step. Current categories:", categories);
    setStep((prev) => Math.min(prev + 1, 10));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    console.log("Updated categories in App state:", categories);
  }, [categories]);

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
            {step === 1 && <QuestionSelection setQuestion={setQuestion} setStep={setStep} />}
            {step === 2 && <StanceSelection setStance={setStance} setStep={setStep} />}
            {step === 3 && <StrengthRating setStrength={setStrength} setStep={setStep} />}
            {step === 4 && <Instructions setStep={setStep} />}
            {step === 5 && <ArgumentGeneration question={question} setUserArguments={setUserArguments} setStep={setStep} />}
            {step === 6 && <ArgumentDisplay userArguments={userArguments} setAllArguments={setAllArguments} setStep={setStep} includeAI={false} />}
            {step === 7 && <Categorization setCategories={setCategories} setStep={setStep} />}
            {step === 8 && <SortedArguments allArguments={allArguments} categories={categories || []} setStep={setStep} />}
            {step === 9 && (
              <ImplicationRating 
                allArguments={allArguments} 
                setRatedArguments={setRatedArguments} 
                setStep={setStep} 
                categories={categories || []}  // Ensure categories is never undefined
              />
            )}
            {step === 10 && (
              <FinalEvaluation 
                question={question} 
                stance={stance} 
                strength={strength} 
                finalStance={finalStance} 
                finalStrength={finalStrength} 
                setFinalStance={setFinalStance} // Pass setter functions
                setFinalStrength={setFinalStrength}
              />
            )}

            {/* Floating Navigation Buttons */}
            <FloatingNavButtons 
              onBack={handleBack} 
              onNext={handleNext} 
              disableBack={step === 1} 
              disableNext={step === 10} 
            />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
