import React from "react";
import "./Slider.css";

function Slider(props) {
  // Clamp function to ensure values stay within bounds
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function handleChange(event) {
    // Clamp the value to ensure it stays within min and max
    const clampedValue = clamp(
      parseFloat(event.target.value),
      props.value.min,
      props.value.max
    );

    props.addField(props.variable, clampedValue);
  }

  function getStep(s, max) {
    if (s.match(/\./)) {
      return s.replace(/.+?\.(\d+)\d$/, "0.$11");
    } else {
      if (max < 1000) {
        return 1;
      } else {
        var order = Math.floor(Math.log(max) / Math.LN10 + 0.000000001);
        return Math.pow(10, order - 2);
      }
    }
  }

  // Clamp the displayed value for the slider, even if the actual value is outside bounds
  const clampedDisplayValue = clamp(
    parseFloat(props.valueFromState),
    props.value.min,
    props.value.max
  );

  return (
    <span className="slider">
      <input
        type="range"
        onChange={(e) => handleChange(e)}
        value={clampedDisplayValue}
        step={getStep(props.value.formatString, props.value.max)}
        max={props.value.max}
        min={props.value.min}
      />
    </span>
  );
}

export default Slider;
