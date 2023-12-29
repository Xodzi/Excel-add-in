import * as React from "react";
import { useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import insertText from "../office-document";
import ArrayComponent from "../components/ArrayComponent";

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "20px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "50%",
  },
});

//-------------------------------------------------------------------
// add localStorage get into testArray
const testArray = [
  {
    name: 'SUM(MAX(3,5),AVERAGE(1,2,3,4,SUM(7,7)),ABS(SUM(-7,4,1)))',
    depth: 0,
    res: '43',
  },
  {
    name: 'MAX(3,5)',
    depth: 1,
    res: '4',
  },
  {
    name: 'AVERAGE(1,2,3,4,SUM(7,7))',
    depth: 1,
    res: '4',
  },
  {
    name: 'SUM(7,7)',
    depth: 2,
    res: '4',
  },
  {
    name: 'ABS(SUM(-7,4,1))',
    depth: 1,
    res: '1',
  },
  {
    name: 'SUM(-7,4,1)',
    depth: 2,
    res: '1',
  }
];
//-------------------------------------------------------------------


const TextInsertion = () => {
  const [text, setText] = useState("Some text.");

  const handleTextInsertion = async () => {
    console.log( await insertText());
  };

  const handleTextChange = async (event) => {
    setText(event.target.value);
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.instructions}>Click the button to create formula tree.</Field>
      <Button appearance="primary" disabled={false} size="large" onClick={handleTextInsertion}>
        Create tree
      </Button>
      <ArrayComponent valuesFormulaArray={testArray}></ArrayComponent>
    </div>
  );
};

export default TextInsertion;
