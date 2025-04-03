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
} from "./components/Small Components";
import ArgumentManager from "./components/ArgumentManager";
import Categorization from "./components/Categorization";
import ImplicationRating from "./components/ImplicationRating";
import { Box } from "@mui/material";
import IntellectualHumility from "./components/IntellectualHumility";
import SocialDesirabilty from "./components/SocialDesirabilty";
import PostIntellectualHumility from "./components/PostIntellectualHumility";
import EvaluationSummary from "./components/EvaluationSummary";

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
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState(null);
  const [topic, setTopic] = useState("");

  //Instructions
  const [instructions, setInstructions] = useState("");

  // Question and Question ID
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState("");

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

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        user_id: username,
        password,
      });
      const { message, success, user_id, user_name } = response.data;

      if (success) {
        localStorage.setItem("token", user_id);
        setToken(user_id);
        setUser({ id: user_id, name: user_name });
        setIsAuthenticated(true);
        fetchQuestions();
        // fetchTopics();
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
  const fetchQuestions = async () => {
    //... fetch questions
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/get_topics");
      // Transform the API response to match the expected structure
      const transformedTopics = response.data.map((topic) => ({
        id: topic.id,
        name: topic.name,
        preMadeQuestions: topic.preMadeQuestions.map((q) => ({
          id: q.id,
          text: q.topic, // Use 'topic' field as question text
          topicId: topic.id,
        })),
      }));

      setTopics(transformedTopics);
      // Flatten the questions array
      let allQuestions = [];
      transformedTopics.forEach((topic) => {
        allQuestions = allQuestions.concat(topic.preMadeQuestions);
      });
      setQuestions(allQuestions);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load questions.");
    } finally {
      setIsLoading(false);
    }
  };
  // const fetchTopics = async () => {
  //   //... fetch topics
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get("http://localhost:5000/get_topics");
  //     const transformedTopics = response.data.map((topic) => ({
  //       id: topic.id,
  //       name: topic.name,
  //       preMadeQuestions: topic.preMadeQuestions.map((q) => ({
  //         // Include preMadeQuestions
  //         id: q.id,
  //         text: q.topic,
  //         topicId: topic.id,
  //       })),
  //     }));
  //     setTopics(transformedTopics);
  //   } catch (error) {
  //     setError(error.response?.data?.message || "Failed to load topics.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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

  const updateTopic = (topicIdProp) => {
    setTopicId(topicIdProp);
    const topicIdNum = parseInt(topicIdProp, 10);
    const selectedTopic = topics.find((t) => {
      return t.id === topicIdNum;
    });
    setTopic(selectedTopic);
    if (selectedTopic) {
      setQuestions(selectedTopic.preMadeQuestions);
    }
  };
  const updateQuestion = (question) => {
    setQuestion(question);
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
    setStep(step);
    console.log("ArgId = ", argumentIds);
    console.log("CatId = ", categoriesId);
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

  useEffect(() => {
    if (token) {
      fetchQuestions();
      // fetchTopics();
    }
  }, [token]);

  /**
   * Transforms an object of intellectual humility responses, converting numeric
   * scores (1-5) to their corresponding string descriptors.
   *
   * @param {object} ihResponses - The object containing question IDs as keys and numeric answers (1-5) as values.
   * @returns {object | null} A new object with the same keys but string descriptor values, or null if input is invalid.
   */
  function transformHumilityResponses(ihResponses) {
    // Basic input validation
    if (typeof ihResponses !== "object" || ihResponses === null) {
      console.error(
        "Invalid input for transformHumilityResponses: Expected an object, received:",
        ihResponses
      );
      return null; // Or return {}, or throw Error
    }

    // Define the mapping for intellectual humility scores
    const humilityMapping = {
      1: "STRONGLY_DISAGREE",
      2: "DISAGREE",
      3: "NEITHER",
      4: "AGREE",
      5: "STRONGLY_AGREE",
    };

    const transformedResponses = {};

    // Iterate over the keys of the input object
    for (const questionId in ihResponses) {
      // Ensure the property belongs to the object itself
      if (Object.hasOwnProperty.call(ihResponses, questionId)) {
        const numericValue = ihResponses[questionId];
        // Map the numeric value, provide a fallback/warning for unexpected values
        transformedResponses[questionId] =
          humilityMapping[numericValue] || `UNKNOWN_VALUE_${numericValue}`;
        if (!humilityMapping[numericValue]) {
          console.warn(
            `Unmapped intellectual humility value: ${numericValue} for question ID ${questionId}`
          );
        }
      }
    }

    return transformedResponses;
  }

  /**
   * Transforms an object of social desirability responses, converting boolean
   * values (true/false) to their corresponding string representations ("YES"/"NO").
   *
   * @param {object} sdResponses - The object containing question IDs as keys and boolean answers as values.
   * @returns {object | null} A new object with the same keys but "YES"/"NO" string values, or null if input is invalid.
   */
  function transformDesirabilityResponses(sdResponses) {
    // Basic input validation
    if (typeof sdResponses !== "object" || sdResponses === null) {
      console.error(
        "Invalid input for transformDesirabilityResponses: Expected an object, received:",
        sdResponses
      );
      return null; // Or return {}, or throw Error
    }

    const transformedResponses = {};

    // Iterate over the keys of the input object
    for (const questionId in sdResponses) {
      // Ensure the property belongs to the object itself
      if (Object.hasOwnProperty.call(sdResponses, questionId)) {
        const booleanValue = sdResponses[questionId];
        // Map boolean true to "YES" and false to "NO"
        // Provide a fallback/warning for non-boolean values
        if (typeof booleanValue === "boolean") {
          transformedResponses[questionId] = booleanValue ? "YES" : "NO";
        } else {
          transformedResponses[questionId] = `INVALID_VALUE_${booleanValue}`;
          console.warn(
            `Non-boolean social desirability value encountered: ${booleanValue} for question ID ${questionId}`
          );
        }
      }
    }

    return transformedResponses;
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
                  updateQuestion={updateQuestion}
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
                  token={token}
                  user={user}
                  stance={stance}
                  topic={topic}
                  topicId={topicId}
                  topics={topics}
                  strength={strength}
                  questions={questions}
                  question={question}
                  questionId={questionId}
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
                  topicId={questionId}
                  isLoading={isLoading}
                  error={error}
                  question={question}
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
                  topicId={topicId}
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
                  question={question}
                  topic={topic}
                  topicId={topicId}
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
                  topicId={topicId}
                  question={question}
                  questionId={questionId}
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
                  topicId={topicId}
                  question={question}
                  questionId={questionId}
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
