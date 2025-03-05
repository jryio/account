import numeral from "numeral";
import React, { useState } from "react";
import "./Statement.css";

function Statement(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(props.valueFromState);

  // Handle click on the statement to enable editing
  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setInputValue(props.valueFromState);

      // Use timeout to allow DOM to update before calculating width
      setTimeout(() => {
        const input = document.querySelector(".statement-input");
        if (input) {
          // Set minimum width based on content
          const textWidth = String(props.valueFromState).length * 20; // Approximate width per character
          input.style.width = `${Math.max(50, textWidth)}px`;
          input.select(); // Select all text when focusing
        }
      }, 0);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle when user submits the input or blurs
  const handleSubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      // Convert input to a number and validate
      const newValue = Number(inputValue);

      if (!isNaN(newValue)) {
        // Update the state via the addField function passed down from Section
        // No min/max constraints here - allow any valid number
        props.addField(props.variable, newValue);
      } else {
        // If invalid input, revert to the previous value
        setInputValue(props.valueFromState);
      }

      setIsEditing(false);
    }
  };

  // Format the display value
  const formattedValue = numeral(props.valueFromState).format(
    props.value.formatString
  );

  // Render the component
  return (
    <span className="statement" onClick={handleClick}>
      {props.format === "dollar" ? "$" : ""}

      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleSubmit}
          onBlur={handleSubmit}
          autoFocus
          className="statement-input"
        />
      ) : (
        formattedValue
      )}

      {props.format === "percentage" ? "%" : ""}
    </span>
  );
}

export default Statement;
