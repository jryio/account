import React from "react";
import "./Editor.css";
import "./Source.css";
import Prism from "prismjs";

const template = Prism.languages.javascript["template-string"].inside;

Prism.languages.account = {
  ...template,
  interpolation: {
    ...template.interpolation,
    pattern: /((?:^|[^\\])(?:\\{2})*){(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
  },
};

function Editor({ content, onContentChange, onSave, error }) {
  const handleChange = (e) => {
    onContentChange(e.target.value);
  };

  Prism.highlightAll();

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-title">Source Editor</div>
      </div>

      <textarea
        className="source-editor"
        value={content}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.getModifierState("Meta") || e.getModifierState("Control"))
          ) {
            e.preventDefault();
            onSave();
          }
        }}
        spellCheck="false"
      />

      <button className="save-button" onClick={onSave}>
        Save
      </button>
      {error && (
        <div className="error-container">
          <pre className="error-message">{error}</pre>
        </div>
      )}
    </div>
  );
}

export default Editor;
