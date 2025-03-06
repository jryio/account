import parse from "./smarter-text";
import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";

import "./App.css";
import Section from "./Section";
import Nav from "./Nav";
import Editor from "./Editor";
import {
  initializeStorage,
  getTextByName,
  updateText,
} from "./services/storage";

// Import the default texts for first-time initialization
const textFiles = require("./texts/compiled.json");

function App() {
  const { page } = useParams();
  const navigate = useNavigate();

  const [textVars, setTextVars] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [parseError, setParseError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize storage and load texts
  useEffect(() => {
    setLoading(true);

    // Initialize storage with default texts if it's empty
    const texts = initializeStorage(textFiles);

    // Process all texts to create the textVars state
    const processedTexts = {};

    Object.entries(texts).forEach(([name, textObj]) => {
      try {
        const [ast, astState] = parse(textObj.content);
        processedTexts[name] = [ast, astState, textObj.content];
      } catch (error) {
        console.error(`Error parsing text ${name}:`, error);
        // Still add it, but with a parse error
        processedTexts[name] = [[], {}, textObj.content];
      }
    });

    setTextVars(processedTexts);
    setLoading(false);

    // Redirect to first text if no page specified
    if (!page) {
      const firstTextName = Object.keys(texts)[0];
      if (firstTextName) {
        navigate(`/${firstTextName}`);
      }
    }
  }, [navigate, page]);

  // Load editor content when page changes
  useEffect(() => {
    if (page && textVars[page]) {
      const rawText = textVars[page][2];
      setEditorContent(rawText);
    } else if (page) {
      // Page is specified but not found in textVars yet
      // Try to fetch it from storage
      const textObj = getTextByName(page);
      if (textObj) {
        try {
          const [ast, astState] = parse(textObj.content);
          setTextVars((prev) => ({
            ...prev,
            [page]: [ast, astState, textObj.content],
          }));
          setEditorContent(textObj.content);
        } catch (error) {
          console.error(`Error parsing text ${page}:`, error);
        }
      }
    }
  }, [page, textVars]);

  // Handle saving edited content
  const handleSave = () => {
    if (!page) return;

    try {
      const [newAst, newAstState] = parse(editorContent);

      // Update local state
      setTextVars((prev) => ({
        ...prev,
        [page]: [newAst, newAstState, editorContent],
      }));

      // Save to localStorage
      updateText(page, editorContent);

      setParseError(null);
    } catch (error) {
      console.error("Parse error:", error);
      setParseError(error.message || "Error parsing content");
    }
  };

  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!page || !textVars[page]) {
    // Navigate to first text if available
    const firstTextName = Object.keys(textVars)[0];
    if (firstTextName) {
      return <Navigate to={`/${firstTextName}`} />;
    }
    return <div>No texts available</div>;
  }

  const [ast, astState] = textVars[page];

  return (
    <div className="App">
      <Nav textVars={textVars} currentPage={page} />
      <Section
        key={page}
        ast={ast}
        astState={astState}
        page={page}
        showEditor={showEditor}
        toggleEditor={toggleEditor}
      />

      {showEditor && (
        <Editor
          content={editorContent}
          onContentChange={setEditorContent}
          onSave={handleSave}
          error={parseError}
        />
      )}
    </div>
  );
}

export default App;
