import React, { useState, useEffect } from "react";
import "./QuestionSelection.css";
import axios from "axios";
import {baseUrl} from "../config";

const QuestionSelection = (props) => {
  const [stance, setStance] = useState(props.stance || "");
  const [strength, setStrength] = useState(props.strength || 0);
  const [topic, setTopic] = useState(props.topicId || {});
  const [user, setUser] = useState(props.user.id || "Not Logged In");
  const [questionNumber, setQuestionNumber] = useState(props.questionNumber || 0);

  useEffect(() => {
    setStance("");
    setStrength(0);
    props.updateTopic(topic);
    props.updateStance("");
    props.updateStrength(0);
    props.updateConversationId(0);
  }, [topic]);

  useEffect(() => {
    const url = `${baseUrl}/get_next_question?user_id=${user}&sequence_number=${questionNumber}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTopic(data?.topic);
        }
      })
      .catch((error) => {
        console.error('Error fetching question:', error);
      });
  }, [user, questionNumber]);

  const handleProceed = async () => {
    if (!topic.topic_id || !stance || !strength) {
      alert("Please complete all selections before proceeding.");
      return;
    }
    console.log("intellectualHumility", props.intellectualHumility);
    console.log("socialDesirability", props.socialDesirability);
    props.updateLoading(true);
    props.updateError(null);
    try {
      const response = await axios.post(
        `${baseUrl}/create_conversation`,
        {
          topic_id: topic?.topic_id,
          user_id: props.user.id,
          stance: stance,
          stance_rating: strength,
          collected_at: "START",
          sequence_number: props.questionNumber,
          intellectual_humility_responses: props.intellectualHumility,
          social_desirability_responses: props.socialDesirability,
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );
      if (response.data?.conversation_id) {
        props.updateConversationId(response.data.conversation_id);
        props.updateTopic(topic);
        props.updateStance(stance);
        props.updateStrength(strength);
        props.updateStep(props.step+1);
      }
    } catch (error) {
      props.updateError(
        error.response?.data?.message || "Failed to create conversation."
      );
    } finally {
      props.updateLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Select Topic, Question, Stance & Strength</h2>
      <div className="section">
        <label className="label">{topic ? "Question":"Unable to load the question."}</label>
        <label>{topic?.topic_name}</label>
      </div>

      <div className="section">
        <label className="label">Stance:</label>
        <div className="radio-group" style={{ justifyContent: "left" }}>
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="YES"
              checked={stance === "YES"}
              onChange={() => setStance("YES")}
            />
            Yes
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="stance"
              value="NO"
              checked={stance === "NO"}
              onChange={() => setStance("NO")}
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
