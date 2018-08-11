import { Node as SlateNode, Range } from "slate";

export interface Match {
  index: number; // where the timestamp starts
  length: number; // how long it is
  match: RegExpExecArray; // the actual content of what was matched
}

// returns an array of type Match[]
export const matchTimestamps = (
  inputText: string,
  pattern: RegExp = /\[(\d|:|.+)]/g
): Match[] => {
  const lengthOfDelimiter = 1; // Have to advance past/before the opening/closing brackets

  let currentMatch = pattern.exec(inputText);
  let match: Match;
  let matches: Match[] = [];
  let startingIndex = 0;
  let matchLength;

  while (currentMatch !== null) {
    startingIndex = currentMatch.index;
    matchLength = pattern.lastIndex - startingIndex;
    match = {
      index: startingIndex,
      length: matchLength,
      match: currentMatch
    };
    matches.push(match);
    currentMatch = pattern.exec(inputText);
  }

  return matches;
};

// Is supposed to(?) return an array of deocrations (which are `Range`s?)
export const decorateTimestamps = (
  node: SlateNode,
  context: any,
  bracketPattern = /(\[\d|:|.+])/g
) => {
  // console.log("This is ", this);
  console.log("text is ", node.text);

  const decorations: any = [];
  const texts = node.getTexts();
  texts.forEach((textNode: SlateNode) => {
    const { key, text } = textNode;
    const timestamps = matchTimestamps(text);

    timestamps.forEach((m: Match) => {
      if (m !== undefined) {
        console.log("match is ", m);
        const decoration = Range.create({
          anchor: {
            key: key,
            offset: m.index
          },
          focus: {
            key: key,
            offset: m.index + m.length
          },
          marks: [{ type: "timestamp" }],
          isAtomic: true
        });
        decorations.push(decoration);
      }
    });
  });
  // console.log("parts are ", parts
  console.log("decorations are", decorations);

  return decorations;
};
