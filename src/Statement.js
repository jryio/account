import numeral from "numeral";
import React, { useState, useRef, useEffect } from "react";
import "./Statement.css";

function Statement(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(props.valueFromState);
  const inputRef = useRef(null);
  const hiddenTextRef = useRef(null);

  // Update input width to match content
  useEffect(() => {
    if (inputRef.current && hiddenTextRef.current) {
      const displayValue = isEditing
        ? inputValue
        : numeral(props.valueFromState).format(props.value.formatString);

      // Update the hidden span with current text
      hiddenTextRef.current.textContent = displayValue;

      // Get the width of the text content (+1ch for buffer space)
      const textWidth = hiddenTextRef.current.offsetWidth;

      // Apply width to the input with a small buffer
      inputRef.current.style.width = `${Math.max(textWidth, 10)}px`;
    }
  }, [inputValue, props.valueFromState, props.value.formatString, isEditing]);

  // Handle input focus
  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(props.valueFromState);

    // Select all text when focusing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
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
        // Update the state via the addField function
        props.addField(props.variable, newValue);
      } else {
        // If invalid input, revert to the previous value
        setInputValue(props.valueFromState);
      }

      setIsEditing(false);
    }
  };

  // Get the formatted value for display
  const formattedValue = numeral(props.valueFromState).format(
    props.value.formatString
  );

  return (
    <span className="statement">
      {props.format === "dollar" ? "$" : ""}

      <span className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={isEditing ? inputValue : formattedValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleSubmit}
          onBlur={handleSubmit}
          className={`statement-input ${isEditing ? "editing" : ""}`}
        />
        {/* Hidden element used to measure text width */}
        <span
          ref={hiddenTextRef}
          className="hidden-text"
          aria-hidden="true"
        ></span>
      </span>

      {props.format === "percentage" ? "%" : ""}
    </span>
  );
}

export default Statement;
