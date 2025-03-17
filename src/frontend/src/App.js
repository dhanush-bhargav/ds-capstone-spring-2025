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
import { Instructions } from "./components/Small Components";
import ArgumentManager from "./components/ArgumentManager";
import Categorization from "./components/Categorization";
import ImplicationRating from "./components/ImplicationRating";
import FinalEvaluation from "./components/FinalEvaluation";
import StepperComponent from "./components/StepperComponent";
import FloatingNavButtons from "./components/FloatingNavButtons";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [categories, setCategories] = useState([]);
  const [ratedArguments, setRatedArguments] = useState([]);


  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [step, setStep] = useState(1);

  const [stance, setStance] = useState("");
  const [strength, setStrength] = useState(5);
  const [finalStance, setFinalStance] = useState("");
  const [finalStrength, setFinalStrength] = useState(5);
  const [conversationId, setConversationId] = useState(null);

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
        fetchTopics();
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
  const fetchTopics = async () => {
    //... fetch topics
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/get_topics");
      const transformedTopics = response.data.map((topic) => ({
        id: topic.id,
        name: topic.name,
        preMadeQuestions: topic.preMadeQuestions.map((q) => ({
          // Include preMadeQuestions
          id: q.id,
          text: q.topic,
          topicId: topic.id,
        })),
      }));
      setTopics(transformedTopics);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load topics.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleNext = () => {
    console.log(`Before handleNext - Current Step: ${step}`);

    setStep((prevStep) => {
      let nextStep;
      switch (prevStep) {
        case 1:
          nextStep = 2;
          break;
        case 2:
          nextStep = 3;
          break;
        case 3:
          nextStep = 4;
          break;
        case 4:
          nextStep = 5;
          break;
        case 5:
          nextStep = 6;
          break;
        case 6:
          nextStep = 7;
          break;
        default:
          nextStep = prevStep; // Stay on the same step if no match
      }
      console.log(`After handleNext - Next Step: ${nextStep}`);
      return nextStep;
    });
  };
  const handleBack = () => {
    console.log(`Before handleBack - Current Step: ${step}`);
    setStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      console.log(`After handleBack - Next Step: ${newStep}`);
      return newStep;
    });
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
  const updateQuestion = (questionIdProp) => {
    setQuestionId(questionIdProp);
    const questionIdNum = parseInt(questionIdProp, 10);
    const question = questions.find((q) => {
      return q.id === questionIdNum;
    })?.text;
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

  const updateError = (error) => {
    setError(error);
  };
  const updateStep = (step) => {
    setStep(step);
  };
  const updateLoading = (isLoading) => {
    setIsLoading(isLoading);
  };

  useEffect(() => {
    if (token) {
      fetchQuestions();
      fetchTopics();
    }
  }, [token]);

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
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {step === 1 && (
              <QuestionSelection
                updateTopic={updateTopic}
                updateError={updateError}
                updateQuestion={updateQuestion}
                updateStance={updateStance}
                updateStrength={updateStrength}
                updateStep={updateStep}
                updateConversationId={updateConversationId}
                updateLoading={updateLoading}
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
              />
            )}
            {step === 2 && (
              <Instructions
                updateStep={updateStep}
                updateLoading={updateLoading}
              />
            )}
            {step === 3 && (
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
                topicId={topicId}
                isLoading={isLoading}
                error={error}



                question={question}
                token={token}
              />
            )}
            {step === 4 && (
              <Categorization
                questionId={questionId}
                token={token}
                setCategories={setCategories}
                categories={categories}
                setStep={setStep}
              />
            )}
            {step === 5 && (
              <ImplicationRating
                setRatedArguments={setRatedArguments}
                setStep={setStep}
                categories={categories}
                token={token}
                questionId={questionId}
                conversationId={conversationId}
              />
            )}
            {step === 6 && (
              <FinalEvaluation
                question={questionId}
                stance={stance}
                strength={strength}
                finalStance={finalStance}
                finalStrength={finalStrength}
                setFinalStance={setFinalStance}
                setFinalStrength={setFinalStrength}
                token={token}
                conversationId={conversationId}
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
