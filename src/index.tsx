// Import React!
import * as React from "react";
import * as ReactDOM from "react-dom";

// Import the `Value` model.
import { Editor } from "slate-react";
import { Value, Change, Node as SlateNode } from "slate";
import * as Html from "slate-html-serializer";
import * as Plain from "slate-plain-serializer";

import { matchTimestamps, decorateTimestamps } from "./timestamps";

// Create our initial value...
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "This is a timestamp: [00:44]"
              }
            ]
          }
        ]
      },
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "This is another timestamp example: [2:38]"
              }
            ]
          }
        ]
      }
    ]
  }
});

interface MyEditorState {
  value: Value;
}

// Define our app...
class MyEditor extends React.Component<{}, MyEditorState> {
  // Set the initial value when the app is first constructed.
  constructor(props: any) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  // On change, update the app's React state with the new editor value.
  onChange = (change: Change) => {
    this.setState({ value: change.value });
  };
  renderMark = (props: any) => {
    const { children, mark, attributes } = props;
    console.log("renderMark props are ", props);

    switch (mark.type) {
      case "timestamp":
        return (
          <a href="#" {...attributes}>
            {children}
          </a>
        );
    }
  };

  decorateNode(node: SlateNode, context = this): Range[] {
    const text = node.text;
    if (node.object === "document") return [];
    console.log(node);
    const timestamps = matchTimestamps(text);
    console.log("decorations are", decorateTimestamps(node));
    return decorateTimestamps(node);
  }
  // Render the editor.
  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        decorateNode={this.decorateNode}
        renderMark={this.renderMark}
      />
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById("root"));
