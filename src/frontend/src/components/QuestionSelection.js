import React, { useState } from "react";
import "./QuestionSelection.css";
import axios from "axios";

function getRandomQuestion(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn("getRandomItemFromArray: Input must be a non-empty array.");
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const QuestionSelection = (props) => {
  const [stance, setStance] = useState(props.stance || "");
  const [strength, setStrength] = useState(props.strength || 5);
  const [topicId, setTopicId] = useState(props.topicId || "");
  const [question, setQuestion] = useState(props.question || "");

  console.log("QuestionSelection Props", props);

  const handleProceed = async () => {
    if (!topicId || !stance || !strength) {
      alert("Please complete all selections before proceeding.");
      return;
    }
    console.log("intellectualHumility", props.intellectualHumility);
    console.log("socialDesirability", props.socialDesirability);
    props.updateTopic(topicId);
    props.updateQuestion(question);
    props.updateStance(stance);
    props.updateStrength(strength);
    props.updateStep(props.step + 1);
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
          intellectual_humility_responses: props.intellectualHumility,
          social_desirability_responses: props.socialDesirability,
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
      props.updateQuestion(question);
      props.updateStance(stance);
      props.updateStrength(strength);
      props.updateStep(props.step + 1);
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
            setQuestion(
              getRandomQuestion(props.topics[e.target.value]?.preMadeQuestions)
                ?.text
            );
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

      <div className="section">
        <label className="label">{question?"Question":"Select topic"}</label>
        <label>{question}</label>
      </div>

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

      <button className="button" onClick={handleProceed}>
        Proceed
      </button>
    </div>
  );
};

export default QuestionSelection;
