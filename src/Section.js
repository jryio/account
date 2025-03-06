import numeral from "numeral";
import React, { useState } from "react";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";

import "./Source.css";
import "./Section.css";

function Section({ ast, astState, page, showEditor, toggleEditor }) {
  const [state, setState] = useState(readFields());
  const [historyState, setHistoryState] = useState(
    new URLSearchParams(window.location.search).toString()
  );

  function addField(k, v) {
    const newState = { ...state, [k]: v };
    const newHistoryState = new URLSearchParams(historyState);
    newHistoryState.set(k, v);
    setHistoryState(newHistoryState.toString());
    window.history.replaceState(
      {},
      null,
      `/${page}?${newHistoryState.toString()}`
    );
    setState(newState);
    return v;
  }

  function readFields() {
    const searchParams = new URLSearchParams(window.location.search);

    return Object.fromEntries(
      Object.keys(astState).map((k) => {
        return [k, searchParams.get(k) || astState[k]];
      })
    );
  }

  function toComponents(o, i) {
    switch (o.type) {
      case "text":
        return <Text key={i} {...o} />;

      case "link":
        return <a href={o.href}>{o.anchorText}</a>;

      case "statement":
        return (
          <span className="full-statement" key={i}>
            <Slider
              key={o.variable}
              addField={addField}
              valueFromState={state[o.variable]}
              i={i}
              {...o}
            />
            <Statement
              key={`statement-${o.variable}`}
              addField={addField}
              valueFromState={state[o.variable]}
              i={i}
              {...o}
            />
          </span>
        );

      case "expression":
        function format(n) {
          const num = numeral(n);
          if (n < 10 && n > -10) {
            return num.format("0.00");
          }
          return num.format("-0,0");
        }
        function evaluate(o) {
          const n = o.eval(state);
          state[o.variable] = n;
          return n;
        }
        const n = evaluate(o);
        const sign = n > 0 ? "positive" : "negative";
        return (
          <span className={"expression " + sign} key={i}>
            {format(n)}
          </span>
        );

      default:
        return undefined;
    }
  }

  return (
    <div id="text">
      <h1>{page}</h1>
      {ast.map(toComponents)}

      <div className="flex flex-row">
        <button className="editor-toggle-button" onClick={toggleEditor}>
          {showEditor ? "Hide Editor" : "Show Editor"}
        </button>
      </div>
    </div>
  );
}

export default Section;
