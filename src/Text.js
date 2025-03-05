import React from "react";
import "./Text.css";
import Twemoji from "react-emoji-render";

function Text(props) {
  // Split the text by double newlines and render with appropriate breaks
  if (props.value.includes("\n\n")) {
    const paragraphs = props.value.split("\n\n");

    return (
      <span className="text">
        {paragraphs.map((paragraph, index) => (
          <React.Fragment key={`${props.i}-${index}`}>
            <Twemoji text={paragraph} />
            {index < paragraphs.length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    );
  }

  // Default rendering for text without double newlines
  return (
    <span className="text">
      <Twemoji key={props.i} text={props.value} />
    </span>
  );
}

export default Text;
