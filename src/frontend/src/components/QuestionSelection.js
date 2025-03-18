import React, { useState, useEffect } from "react";
import "./QuestionSelection.css";
import axios from "axios";

const QuestionSelection = (props) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);


  useEffect(() => {
    if (props.topics && props.topics.length > 0 && props.topicId) {
      setSelectedTopic(props.topic);
      props.updateQuestion("");
    } else {
      setSelectedTopic(null);
      props.updateQuestion([]);
    }
  }, [props.topics, props.topicId]);

  useEffect(() => {
    if (props.questions && props.questions.length > 0 && props.questionId) {
      setSelectedQuestion(props.question);
    } else {
      setSelectedQuestion(null);
      props.updateStance("");
      props.updateStrength("");
      props.updateConversationId("");
    }
  }, [props.questions, props.questionId]);


  const handleProceed = async () => {if (!props.topic || !props.question || !props.stance || !props.strength) {
      alert("Please complete all selections before proceeding.");
      return;
    }
    props.updateLoading(true);
    props.updateError(null)
    try {
        const response = await axios.post('http://localhost:5000/create_conversation', {
            topic_id: props.topicId,
            user_id: props.user.id,
            stance: props.stance,
            stance_rating: props.strength,
            collected_at: "START"
        }, {
            headers: { Authorization: `Bearer ${props.token}` }
        });
        props.updateConversationId(response.data.conversation_id);
    } catch (error) {
        props.updateError(error.response?.data?.message || "Failed to create conversation.");
    }
     finally {
        props.updateLoading(true);
        props.updateStance(props.stance);
        props.updateStrength(props.strength);
        props.updateStep(2);
    }
  };

  return (
    <div className="container">
      <h2>Select Topic, Question, Stance & Strength</h2>
      <div className="section">
        <label className="label">Choose a Topic:</label>
        <select
          value={props.topicId || ""}
          onChange={(e) => {
            props.updateTopic(e.target.value)
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
            value={props.questionId || ""}
            onChange={(e) => {
              props.updateQuestion(e.target.value);
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
              checked={props.stance === "Yes"}
              onChange={() => props.updateStance("Yes")}
            />
            Yes
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="No"
              checked={props.stance === "No"}
              onChange={() => props.updateStance("No")}
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
                checked={props.strength === i + 1}
                onChange={() => props.updateStrength(i + 1)}
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