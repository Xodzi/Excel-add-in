import React from "react";
import { useState, useEffect } from "react";
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
  }
});

//-------------------------------------------------------------------
// add localStorage get into testArray
//-------------------------------------------------------------------

const TextInsertion = (event) => {

  //const [array,SetArray] = useState([]);

  async function handleTextInsertion() {
    let test = await insertText();
    console.log(test);
    {/*const treeData = JSON.parse(localStorage.getItem('arrayData'));
    console.log(treeData);
    console.log("SetArray");
    SetArray(treeData);*/}
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.instructions}>Click the button to create formula tree.</Field>
      <button onClick={handleTextInsertion}>
        Create tree
      </button>
      {/*<ArrayComponent valuesFormulaArray={array}></ArrayComponent>*/}
    </div>
  );
};

export default TextInsertion;
