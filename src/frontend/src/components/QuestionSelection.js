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
    props.updateTopic(props.topicId);
    props.updateQuestion(props.questionId);
    props.updateStance(props.stance);
    props.updateStrength(props.strength);
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
      props.updateTopic(props.topicId);
      props.updateQuestion(props.questionId);
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
