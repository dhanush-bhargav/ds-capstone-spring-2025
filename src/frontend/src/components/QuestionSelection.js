import React, { useState, useEffect } from "react";
import "./QuestionSelection.css";

const QuestionSelection = ({ setQuestion, setStance, setStrength, setStep, topics, questions }) => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");  // Store question ID
  const [stance, setLocalStance] = useState("");
  const [strength, setLocalStrength] = useState(null);
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    // Filter questions based on the selected topic
    if (selectedTopic && topics) {
      const topic = topics.find((t) => t.id === parseInt(selectedTopic));
      if (topic) {
        setQuestionList(topic.preMadeQuestions); // Use preMadeQuestions directly
      }
    } else {
      setQuestionList([]); // Reset question list if no topic is selected
    }
  }, [selectedTopic, topics]);


  const handleProceed = () => {
    if (!selectedTopic || !selectedQuestion || !stance || !strength) {
      alert("Please complete all selections before proceeding.");
      return;
    }

    setQuestion(selectedQuestion); // Set the question ID
    setStance(stance);
    setStrength(strength);
    setStep(2);
  };

  return (
    <div className="container">
      <h2>Select Topic, Question, Stance & Strength</h2>

      {/* Topic Selection */}
      <div className="section">
        <label className="label">Choose a Topic:</label>
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setSelectedQuestion(""); // Reset question when topic changes
          }}
          className="select-box"
        >
          <option value="">-- Select a Topic --</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {/* Question Selection */}
      {selectedTopic && (
        <div className="section">
          <label className="label">Choose a Question:</label>
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)} // Set question ID
            className="select-box"
          >
            <option value="">-- Select a Question --</option>
            {questionList.map((q) => (
              <option key={q.id} value={q.id}>
                {q.text}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stance Selection (Radio Buttons) */}
      <div className="section">
        <label className="label">Stance:</label>
        <div className="radio-group">
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="Yes"
              checked={stance === "Yes"}
              onChange={() => setLocalStance("Yes")}
            />
            Yes
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="No"
              checked={stance === "No"}
              onChange={() => setLocalStance("No")}
            />
            No
          </label>
        </div>
      </div>

      {/* Strength Rating (Radio Buttons) */}
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
                onChange={() => setLocalStrength(i + 1)}
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