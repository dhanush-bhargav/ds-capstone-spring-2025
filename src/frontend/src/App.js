// App.js
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import QuestionSelection from "./components/QuestionSelection";
import Instructions from "./components/Instructions";
import ArgumentManager from "./components/ArgumentManager";
import Categorization from "./components/Categorization";
import SortedArguments from "./components/SortedArguments";
import ImplicationRating from "./components/ImplicationRating";
import FinalEvaluation from "./components/FinalEvaluation";
import StepperComponent from "./components/StepperComponent";
import FloatingNavButtons from "./components/FloatingNavButtons";

const App = () => {
    // All state variables are defined *outside* the Router, which is correct.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [allArguments, setAllArguments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ratedArguments, setRatedArguments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [step, setStep] = useState(1);
    const [question, setQuestion] = useState("");
    const [questionId, setQuestionId] = useState("");
    const [stance, setStance] = useState("");
    const [strength, setStrength] = useState(5);
    const [finalStance, setFinalStance] = useState("");
    const [finalStrength, setFinalStrength] = useState(5);
    const [conversationId, setConversationId] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

  // DO NOT call useNavigate() here.

  // handleLogin, createConversation, fetchQuestions, fetchTopics, fetchArguments, fetchCategories are all defined *outside* the Router, which is correct.

    const handleLogin = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
        const response = await axios.post('http://localhost:5000/login', { user_id: username, password });
        const { message, success, user_id, user_name } = response.data;

        if (success) {
            localStorage.setItem('token', user_id);
            setToken(user_id);
            setUser({ id: user_id, name: user_name });
            setIsAuthenticated(true);
            fetchQuestions();
            fetchTopics();
            //DO NOT NAVIGATE HERE
        } else {
            setError(message || 'Login failed. Please check your credentials.');
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
        setIsLoading(false);
        }
    };

    const fetchQuestions = async () => {
        //... fetch questions
        setIsLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/get_topics');
          // Transform the API response to match the expected structure
          const transformedTopics = response.data.map(topic => ({
            id: topic.id,
            name: topic.name,
            preMadeQuestions: topic.preMadeQuestions.map(q => ({
              id: q.id,
              text: q.topic, // Use 'topic' field as question text
              topicId: topic.id
            }))
          }));

          setTopics(transformedTopics);
          // Flatten the questions array
          let allQuestions = [];
          transformedTopics.forEach(topic => {
            allQuestions = allQuestions.concat(topic.preMadeQuestions);
          });
          setQuestions(allQuestions);


        } catch (error) {
          setError(error.response?.data?.message || 'Failed to load questions.');
        } finally {
          setIsLoading(false);
        }
    };

    const fetchTopics = async () => {
    //... fetch topics
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/get_topics');
        const transformedTopics = response.data.map(topic => ({
        id: topic.id,
        name: topic.name,
        preMadeQuestions: topic.preMadeQuestions.map(q => ({ // Include preMadeQuestions
          id: q.id,
          text: q.topic,
          topicId: topic.id
        }))
      }));
      setTopics(transformedTopics);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load topics.');
    } finally {
      setIsLoading(false);
    }
  };


  const fetchArguments = async (questionId) => {
    //... fetch arguments
    if (!questionId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/get_arguments?topic_id=${questionId}`);

        const transformedArguments = response.data.arguments.map(arg => ({
        id: arg.argument_id,
        text: arg.argument,
        pro: arg.yes_or_no === "YES", // Convert "YES"/"NO" to boolean
        categoryId: null // Initialize categoryId
      }));

      setAllArguments(transformedArguments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch arguments");
    } finally {
      setIsLoading(false);
    }
  };

    // const fetchCategories = async (questionId) => {
    // //.. fetch categories
    // if (!questionId) return;
    //     setIsLoading(true);
    //     try {
    //     const response = await axios.get(`http://localhost:5000/get_argument_categories?topic_id=${questionId}`);
    //         const transformedCategories = response.data.argument_categories.map(cat => ({
    //         id: cat.category_id,
    //         name: cat.argument_category
    //     }));
    //     setCategories(transformedCategories);
    //     } catch (err) {
    //     setError(err.response?.data?.message || 'Failed to fetch Categories');
    //     } finally {
    //     setIsLoading(false);
    //     }
    // };

  const handleNext = () => {
    console.log(`Before handleNext - Current Step: ${step}`);

    setStep(prevStep => {
      let nextStep;
      switch (prevStep) {
        case 1:
          nextStep = 2;
          break;
        case 2:
          nextStep = 3;
          break;
        case 3:
          if (allArguments.length === 0) {
            console.warn("⚠️ No arguments found. Cannot proceed.");
            nextStep = prevStep; // Stay on the same step
          } else {
            nextStep = 4;
          }
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
    setStep(prev => {
      const newStep = Math.max(prev - 1, 1);
      console.log(`After handleBack - Next Step: ${newStep}`);
      return newStep;
    });
  };
    useEffect(() => {
    if (token) {
      fetchQuestions();
      fetchTopics();
    }
  }, [token]);

  // useEffect(() => {
  //   if (question) {
  //     fetchArguments(question);
  //   }
  // }, [question]);

  // useEffect(() => {
  //   if (step === 4) {
  //     fetchCategories(questionId);
  //   }
  // }, [step, questionId, token]); // Important: Add dependencies

  return (
    <Router> {/* <Router> is the top-level component. */}
      <div className="container mx-auto p-6">
        {!isAuthenticated ? (
          // Login Routes (when not authenticated)
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        ) : (
          // Authenticated App Content
          <>
            {/* Stepper (always rendered when authenticated) */}

            <StepperComponent step={step} />
            {isLoading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}

            {/* --- Conditional Rendering of Components based on step --- */}
            {step === 1 && (
              <QuestionSelection
                token={token}
                user={user}
                setQuestion={setQuestion}
                setQuestionId={setQuestionId}
                setStance={setStance}
                setStrength={setStrength}
                setStep={setStep}
                topics={topics}
                questions={questions}
                setConversationId={setConversationId}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            )}
            {step === 2 && <Instructions setStep={setStep} />}
            {step === 3 && (
              <ArgumentManager
                question={question}
                questionId={questionId}
                token={token}
                setAllArguments={setAllArguments}
                allArguments={allArguments}
                setStep={setStep}
              />
            )}
            {step === 4 && <Categorization questionId={questionId} token={token} setCategories={setCategories} categories={categories} setStep={setStep} />}
            {/* {step === 5 && <SortedArguments token={token} questionId={questionId} allArguments={allArguments} categories={categories} setStep={setStep} />} */}
            {step === 5 && (
              <ImplicationRating
                allArguments={allArguments}
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