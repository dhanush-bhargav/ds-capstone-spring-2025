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
  FloatingNavButtons,
  StepperComponent,
} from "./components/Small Components";
import ArgumentManager from "./components/ArgumentManager";
import Categorization from "./components/Categorization";
import ImplicationRating from "./components/ImplicationRating";
import FinalEvaluation from "./components/FinalEvaluation";
import { Box } from "@mui/material";

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
          argumentIds.length > 0 ? (nextStep = 4) : (nextStep = 3);
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

  useEffect(() => {
    if (token) {
      fetchQuestions();
      fetchTopics();
    }
  }, [token]);

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
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              transition: "height 0.5s ease-in-out",
            }}
          >
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
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.5s ease-in-out",
              }}
            >
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
                  topicId={questionId}
                  isLoading={isLoading}
                  error={error}
                  question={question}
                  token={token}
                />
              )}
              {step === 4 && (
                <Categorization
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  updateCategories={updateCategories}
                  updateCategoriesId={updateCategoriesId}
                  yesArguments={yesArguments}
                  noArguments={noArguments}
                  topic={topic}
                  topicId={questionId}
                  isLoading={isLoading}
                  error={error}
                  categories={categories}
                  token={token}
                />
              )}
              {step === 5 && (
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
                  topicId={questionId}
                  conversationId={conversationId}
                  error={error}
                  isLoading={isLoading}
                  token={token}
                />
              )}
              {step === 6 && (
                <FinalEvaluation
                  updateFinalStance={updateFinalStance}
                  updateFinalStrength={updateFinalStrength}
                  updateStep={updateStep}
                  updateLoading={updateLoading}
                  updateError={updateError}
                  updateStance={updateStance}
                  updateStrength={updateStrength}
                  isLoading={isLoading}
                  error={error}

                  question={question}
                  stance={stance}
                  strength={strength}
                  
                  finalStance={finalStance}
                  finalStrength={finalStrength}
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
            </Box>
          </Box>
        )}
      </>
    </Router>
  );
};

export default App;





import React, { useState, useEffect } from "react";
import "./QuestionSelection.css";
import axios from "axios";

const QuestionSelection = (props) => {
  const [stance, setStance] = useState(props.stance || "");
  const [strength, setStrength] = useState(props.strength || 5);
  const [questionId, setQuestionId] = useState(props.questionId || "");
  const [topicId, setTopicId] = useState(props.topicId || "");

  useEffect(() => {
    setStance("")
    setStrength(5)
    props.updateTopic(topicId);
    props.updateQuestion(questionId);
    props.updateStance("");
    props.updateStrength("");
    props.updateConversationId("");
  }, [topicId, questionId]);

  const handleProceed = async () => {
    if (!topicId || !questionId || !stance || !strength) {
      alert("Please complete all selections before proceeding.");
      return;
    }
    props.updateTopic(topicId);
    props.updateQuestion(questionId);
    props.updateStance(stance);
    props.updateStrength(strength);
    props.updateStep(2);
    props.updateLoading(true);
    props.updateError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/create_conversation",
        {
          topic_id: topicId,
          user_id: props.user.id,
          stance: stance,
          stance_rating: strength,
          collected_at: "START",
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );
      props.updateConversationId(response.data.conversation_id);
    } catch (error) {
      props.updateError(
        error.response?.data?.message || "Failed to create conversation."
      );
    } finally {
      props.updateLoading(true);
      props.updateTopic(topicId);
      props.updateQuestion(questionId);
      props.updateStance(stance);
      props.updateStrength(strength);
      props.updateStep(2);
    }
  };

  return (
    <div className="container">
      <h2>Select Topic, Question, Stance & Strength</h2>
      <div className="section">
        <label className="label">Choose a Topic:</label>
        <select
          value={topicId || ""}
          onChange={(e) => {
            setTopicId(e.target.value);
          }}
          className="select-box"
        >
          <option value="">-- Select a Topic --</option>
          {props.topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      {props.topic && (
        <div className="section">
          <label className="label">Choose a Question:</label>
          <select
            value={questionId || ""}
            onChange={(e) => {
              setQuestionId(e.target.value);
            }}
            className="select-box"
          >
            <option value="">-- Select a Question --</option>
            {props.questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.text}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="section">
        <label className="label">Stance:</label>
        <div className="radio-group" style={{ justifyContent: "left" }}>
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="Yes"
              checked={stance === "Yes"}
              onChange={() => setStance("Yes")}
            />
            Yes
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="No"
              checked={stance === "No"}
              onChange={() => setStance("No")}
            />
            No
          </label>
        </div>
      </div>
      <div className="section">
        <label className="label">Rate Your Strength:</label>
        <div className="strength-group">
          {[...Array(10)].map((_, i) => (
            <label key={i} className="radio-item">
              <input
                type="radio"
                name="strength"
                value={i + 1}
                checked={strength === i + 1}
                onChange={() => setStrength(i + 1)}
              />
              {i + 1}
            </label>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <button className="button" onClick={handleProceed}>
        Proceed
      </button>
    </div>
  );
};

export default QuestionSelection;


import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const FinalEvaluation = (props) => {
  console.log(props.question, props.stance, props.strength);
  const [userStance, setUserStance] = useState(props.stance);
  const [userStrength, setUserStrength] = useState(props.strength);
  const [userFinalStance, setUserFinalStance] = useState("");
  const [userFinalStrength, setUserFinalStrength] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [error, setError] = useState(props.error);
  const [token, setToken] = useState(props.token);

  const handleSubmit = async () => {
    props.updateLoading(true);
    props.updateError(null);
    props.updateFinalStance(userFinalStance);
    props.updateFinalStrength(userFinalStrength);
    setSubmitted(true);
    try {
      await axios.post(
        "http://localhost:5000/create_conversation",
        {
          topic_id: props.question,
          user_id: localStorage.getItem("token"),
          stance: userFinalStance,
          stance_rating: parseInt(userFinalStrength),
          collected_at: "END",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      props.updateError(
        error.response?.data?.message || "Failed to submit Final Evaluation."
      );
    } finally {
      props.updateLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Final Evaluation
      </Typography>

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
        Question:
      </Typography>
      <Typography>{props.question}</Typography>

      {!submitted ? (
        <>
          {/* Final Stance Selection */}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
            What is your final stance?
          </Typography>
          <RadioGroup
            row
            value={userFinalStance}
            onChange={(e) => setUserFinalStance(e.target.value)}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Final Strength Rating */}
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
            Rate how strongly you feel about your final stance
          </Typography>
          <RadioGroup
            row
            value={userFinalStrength}
            onChange={(e) => setUserFinalStrength(e.target.value)}
          >
            {[...Array(10)].map((_, i) => (
              <FormControlLabel
                key={i}
                value={i + 1}
                control={<Radio />}
                label={i + 1}
              />
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
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
            Comparison
          </Typography>

          <Typography>
            <strong>Initial Stance:</strong> {userStance}
          </Typography>
          <Typography>
            <strong>Initial Strength:</strong> {userStrength}/10
          </Typography>
          <Typography>
            <strong>Final Stance:</strong> {userFinalStance}
          </Typography>
          <Typography>
            <strong>Final Strength:</strong> {userFinalStrength}/10
          </Typography>
        </>
      )}
    </Box>
  );
};

export default FinalEvaluation;


// Categorization.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

const Categorization = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState("");
  const [localCategory, setLocalCategory] = useState([]);
  const [yesArguments, setYesArguments] = useState([]);
  const [noArguments, setNoArguments] = useState([]);

  useEffect(() => {
    const fetchArguments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_arguments?topic_id=${props.topicId}`);
        if (response.data.success) {
          const existingYes = response.data.arguments.filter(arg => arg.yes_or_no==="YES").map(arg => {
            return {text: arg.argument, id: arg.argument_id}
          });
          const existingNo = response.data.arguments.filter(arg => arg.yes_or_no==="NO").map(arg => {
            return {text: arg.argument, id: arg.argument_id}
          });
  
          // response.data.arguments.forEach((arg) => {
          //   if (arg.yes_or_no === "YES") {
          //     existingYes.set(arg.argument, { text: arg.argument, id: arg.argument_id });
          //   } else {
          //     existingNo.set(arg.argument, { text: arg.argument, id: arg.argument_id });
          //   }
          // });
  
          setYesArguments(Array.from(existingYes.values()));
          setNoArguments(Array.from(existingNo.values()));
        }
      } catch (error) {
        console.error("Error fetching arguments:", error);
      }
    };
    fetchArguments();
    
  }, [props.yesArguments, props.noArguments]);
  

  const handleAddCategory = () => {
    if (input.trim() !== "") {
      const categoryId = uuidv4();
      setLocalCategory([
        ...localCategory,
        { id: categoryId, argument_category: input, arguments: [] },
      ]);
      setInput("");
    }
  };

  const handleEditCategory = (id, value) => {
    const name = prompt("Enter new category name:", value);
    if (name !== null && name.trim() !== "") {
      setLocalCategory(
        localCategory.map((c) =>
          c.id === id ? { ...c, argument_category: name } : c
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId) => {
    let updatedCategories = [...localCategory];
    updatedCategories = updatedCategories.filter((c) => c.id !== categoryId);
    setLocalCategory(updatedCategories);
  };

  const handleProceed = async () => {
    setIsSubmitting(true);
    props.updateLoading(true);
    props.updateError(null);
    props.updateCategories(localCategory);
    props.updateStep(5);

    const categoriesPayload = {
      topic_id: props.topicId,
      argument_categories: localCategory.map((c) => ({
        argument_category: c.argument_category,
      })),
    };
    console.log(categoriesPayload);

    try {
      if (localCategory.length > 0) {
        const response = await axios.post(
          "http://localhost:5000/read_user_argument_categories",
          categoriesPayload
        );
        if (response?.data?.success === true) {
          props.updateCategoriesId(response.data.category_ids);
          props.updateLoading(true);
          props.updateStep(5);
        } else {
          props.updateError("Failed to create new categories.");
          props.updateLoading(false);
          return;
        }
      }
    } catch (error) {
      props.updateError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      props.updateLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category Creation</h2>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          padding: 4,
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* First List */}
        <Paper sx={{ padding: 2, minWidth: 200 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Yes Arguments
          </Typography>
          <List>
            {yesArguments.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Second List */}
        <Paper sx={{ padding: 2, minWidth: 200 }}>
          <Typography variant="h6" align="center" gutterBottom>
            No Arguments
          </Typography>
          <List>
            {noArguments.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Enter new category name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              height: "30px", // Ensures same height as button
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{
            height: "30px",
            minWidth: "50px",
          }}
        >
          Add Category
        </Button>
      </Box>

      {props.isLoading && <p>Loading...</p>}
      {props.error && <p className="text-red-500">{props.error}</p>}
      {localCategory.map((category) => (
        <Box
          className="category"
          sx={{
            alignItems: "center",
            gap: 2,
            border: "2px solid #ccc",
            borderRadius: "8px",
            width: "100%",
            padding: "8px",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                margin: 0,
                flexGrow: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {category.argument_category}
            </Typography>
            <IconButton
              color="primary"
              size="small"
              sx={{ width: "30px", height: "30px", padding: "4px" }}
              onClick={() =>
                handleEditCategory(category.id, category.argument_category)
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              sx={{ width: "30px", height: "30px", padding: "4px" }}
              onClick={() => handleDeleteCategory(category.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      <button
        onClick={handleProceed}
        className="mt-4 p-3 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={isSubmitting}
      >
        Proceed
      </button>
    </div>
  );
};

export default Categorization;
