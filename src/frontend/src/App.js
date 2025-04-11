// App.js
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import QuestionSelection from "./components/QuestionSelection";
import {
  Instructions,
  BackButton,
  Feedback,
} from "./components/Small Components";
import ArgumentManager from "./components/ArgumentManager";
import Categorization from "./components/Categorization";
import ImplicationRating from "./components/ImplicationRating";
import { Box } from "@mui/material";
import IntellectualHumility from "./components/IntellectualHumility";
import SocialDesirabilty from "./components/SocialDesirabilty";
import PostIntellectualHumility from "./components/PostIntellectualHumility";
import EvaluationSummary from "./components/EvaluationSummary";
import {baseUrl} from "./config";

const initialSubmissionStatus = {
  humility: false,
  desirability: false,
  questions: false,
  instructions: false,
  arguments: false,
  categories: false,
  implications: false,
  postHumility: false,
  evaluation: false,
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Intellectual Humility & Social Desirability Assessment

  const [intellectualHumility, setIntellectualHumility] = useState("");
  const [socialDesirability, setSocialDesirability] = useState("");
  const [intellectualHumilityId, setIntellectualHumilityId] = useState("");
  const [socialDesirabilityId, setSocialDesirabilityId] = useState("");

  // Topics
  const [topic, setTopic] = useState({});

  //Instructions
  const [instructions, setInstructions] = useState("");

  // Arguments
  const [yesArguments, setYesArguments] = useState([]);
  const [noArguments, setNoArguments] = useState([]);
  const [argumentIds, setArgumentIds] = useState([]);

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesId, setCategoriesId] = useState([]);

  // Implication
  const [implication, setImplication] = useState([]);
  const [implicationIds, setImplicationIds] = useState("");

  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [step, setStep] = useState(1);

  const [stance, setStance] = useState("");
  const [strength, setStrength] = useState(5);
  const [finalStance, setFinalStance] = useState("");
  const [finalStrength, setFinalStrength] = useState(5);
  const [conversationId, setConversationId] = useState(null);

  const [submissionStatus, setSubmissionStatus] = useState(
    initialSubmissionStatus
  );

  const [questionNumber, setQuestionNumber] = useState(0);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`${baseUrl}/login`)
      const response = await axios.post(`${baseUrl}/login`, {
        user_id: username,
        password,
      });
      const { message, success, user_id, user_name } = response.data;

      if (success) {
        localStorage.setItem("token", user_id);
        setToken(user_id);
        setUser({ id: user_id, name: user_name });
        setIsAuthenticated(true);
        //DO NOT NAVIGATE HERE
      } else {
        setError(message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log(`Before handleBack - Current Step: ${step}`);
    setStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      console.log(`After handleBack - Next Step: ${newStep}`);
      return newStep;
    });
  };

  const updateIntellectualHumility = (intellectualHumilityProp) => {
    setIntellectualHumility(intellectualHumilityProp);
  };
  const updateSocialDesirability = (socialDesirabilityProp) => {
    setSocialDesirability(socialDesirabilityProp);
  };

  const updateTopic = (topicProp) => {
    setTopic(topicProp);
  };
  const updateStance = (stance) => {
    setStance(stance);
  };
  const updateStrength = (strength) => {
    setStrength(strength);
  };
  const updateConversationId = (conversationId) => {
    setConversationId(conversationId);
  };
  const updateYesArguments = (argumentsList) => {
    setYesArguments(argumentsList);
  };
  const updateNoArguments = (argumentsList) => {
    setNoArguments(argumentsList);
  };
  const updateArgumentIds = (ids) => {
    setArgumentIds(ids);
  };
  const updateCategories = (categories) => {
    setCategories(categories);
  };
  const updateCategoriesId = (ids) => {
    setCategoriesId(ids);
  };
  const updateImplication = (implication) => {
    setImplication(implication);
  };
  const updateImplicationIds = (id) => {
    setImplicationIds(id);
  };
  const updateInstructions = (instructions) => {
    setInstructions(instructions);
  };
  const updateFinalStance = (stance) => {
    setFinalStance(stance);
  };
  const updateFinalStrength = (strength) => {
    setFinalStrength(strength);
  };

  const updateError = (error) => {
    setError(error);
  };
  const updateStep = (step) => {
    if (step === 3) {
      updateYesArguments([]);
      updateNoArguments([]);
    }
    setStep(step);
  };
  const updateLoading = (Loading) => {
    setIsLoading(Loading);
  };
  const updateSubmissionStatus = (status) => {
    setSubmissionStatus((prevStatus) => ({
      ...prevStatus,
      ...status,
    }));
  };

  const updateQuestionNumber = () => {
    setQuestionNumber(questionNumber+1);
  };

  function transformHumilityResponses(ihResponses) {
    const humilityMapping = {
      1: "STRONGLY_DISAGREE",
      2: "DISAGREE",
      3: "NEITHER",
      4: "AGREE",
      5: "STRONGLY_AGREE",
    };
  
    if (typeof ihResponses !== "object" || ihResponses === null) {
      console.error(
        "Invalid input for transformHumilityResponsesToArray: Expected an object, received:",
        ihResponses
      );
      return [];
    }
  
    return Object.entries(ihResponses).map(([questionId, numericValue]) => ({
      assessment_question_id: parseInt(questionId, 10),
      answer: humilityMapping[numericValue] || `UNKNOWN_VALUE_${numericValue}`,
    }));
  }
  

  function transformDesirabilityResponses(sdResponses) {
    if (typeof sdResponses !== "object" || sdResponses === null) {
      console.error(
        "Invalid input for transformDesirabilityResponsesToArray: Expected an object, received:",
        sdResponses
      );
      return [];
    }
  
    return Object.entries(sdResponses).map(([questionId, value]) => {
      let answer;
      if (typeof value === "boolean") {
        answer = value ? "YES" : "NO";
      } else {
        console.warn(`Non-boolean value for question ${questionId}:`, value);
        answer = `INVALID_VALUE_${value}`;
      }
  
      return {
        assessment_question_id: parseInt(questionId, 10),
        answer,
      };
    });
  }
  

  return (
    <Router>
      <>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        ) : (
          <Box
              sx={{
                width: "800px",
                maxHeight: "auto",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                margin: "auto",
                padding: "20mm",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ccc",
                transition: "height 0.5s ease-in-out",
              }}
            >
              {step === 1 && (
                <IntellectualHumility
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  updateIntellectualHumility={updateIntellectualHumility}
                  intellectualHumility={intellectualHumility}
                  intellectualHumilityId={intellectualHumilityId}
                  isLoading={isLoading}
                  error={error}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 2 && (
                <SocialDesirabilty
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  updateSocialDesirability={updateSocialDesirability}
                  isLoading={isLoading}
                  error={error}
                  step={step}
                  socialDesirability={socialDesirability}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 3 && (
                <QuestionSelection
                  updateTopic={updateTopic}
                  updateError={updateError}
                  updateStance={updateStance}
                  updateStrength={updateStrength}
                  updateStep={updateStep}
                  updateConversationId={updateConversationId}
                  updateLoading={updateLoading}
                  intellectualHumility={transformHumilityResponses(
                    intellectualHumility
                  )}
                  socialDesirability={transformDesirabilityResponses(
                    socialDesirability
                  )}
                  questionNumber={questionNumber}
                  token={token}
                  user={user}
                  stance={stance}
                  topic={topic}
                  strength={strength}
                  isLoading={isLoading}
                  error={error}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 4 && (
                <Instructions
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  isLoading={isLoading}
                  error={error}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 5 && (
                <ArgumentManager
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateYesArguments={updateYesArguments}
                  updateNoArguments={updateNoArguments}
                  updateArgumentIds={updateArgumentIds}
                  updateError={updateError}
                  yesArguments={yesArguments}
                  noArguments={noArguments}
                  topic={topic}
                  isLoading={isLoading}
                  error={error}
                  token={token}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 6 && (
                <Categorization
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  updateCategories={updateCategories}
                  updateCategoriesId={updateCategoriesId}
                  yesArguments={yesArguments}
                  noArguments={noArguments}
                  topic={topic}
                  isLoading={isLoading}
                  error={error}
                  categories={categories}
                  token={token}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 7 && (
                <ImplicationRating
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  updateImplication={updateImplication}
                  updateCategoriesId={updateCategoriesId}
                  updateCategories={updateCategories}
                  updateImplicationIds={updateImplicationIds}
                  implication={implication}
                  categories={categories}
                  categoriesId={categoriesId}
                  topic={topic}
                  conversationId={conversationId}
                  error={error}
                  isLoading={isLoading}
                  token={token}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 8 && (
                <PostIntellectualHumility
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  user={user}
                  userId={user.id}
                  updateStance={updateStance}
                  topic={topic}
                  questionNumber={questionNumber}
                  conversationId={conversationId}
                  intellectualHumility={intellectualHumility}
                  socialDesirability={socialDesirability}
                  intellectualHumilityId={intellectualHumilityId}
                  updateFinalStance={updateFinalStance}
                  updateFinalStrength={updateFinalStrength}
                  updateStrength={updateStrength}
                  isLoading={isLoading}
                  error={error}
                  stance={stance}
                  strength={strength}
                  finalStance={finalStance}
                  finalStrength={finalStrength}
                  token={token}
                  step={step}
                  submissionStatus={submissionStatus}
                  updateSubmissionStatus={updateSubmissionStatus}
                />
              )}
              {step === 9 && (
                <EvaluationSummary
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  user={user}
                  userId={user.id}
                  updateStance={updateStance}
                  topic={topic}
                  conversationId={conversationId}
                  intellectualHumility={intellectualHumility}
                  socialDesirability={socialDesirability}
                  intellectualHumilityId={intellectualHumilityId}
                  updateFinalStance={updateFinalStance}
                  updateFinalStrength={updateFinalStrength}
                  updateStrength={updateStrength}
                  isLoading={isLoading}
                  error={error}
                  stance={stance}
                  strength={strength}
                  finalStance={finalStance}
                  finalStrength={finalStrength}
                  token={token}
                  step={step}
                  submissionStatus={submissionStatus}
                  questionNumber={questionNumber}
                  updateSubmissionStatus={updateSubmissionStatus}
                  updateQuestionNumber={updateQuestionNumber}
                />
              )}
              {step === 10 && (
                <Feedback />
              )}
              
              
              <BackButton
                onBack={handleBack}
                disableBack={step === 1 || isLoading}
              />
            </Box>
        )}
      </>
    </Router>
  );
};

export default App;
