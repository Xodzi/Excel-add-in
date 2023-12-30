/* global Excel console */
import React, { useState } from 'react'
import {parse, visit} from 'excel-formula-parser';
import ArrayComponent from './ArrayComponent';
//import to_array from '../office-document'



export default function DialigWindow(props) {

  const treeData = JSON.parse(localStorage.getItem('arrayData'));
  console.log(treeData)

  let dialog;

  Office.onReady(function (info) {
      if (info.host === Office.HostType.Excel) {
          // Register event handler for DialogMessageReceived
          Office.EventType.DialogMessageReceived = "dialogMessageReceived";
          
          // Get the current dialog
          Office.context.ui.getParentContext(function (result) {
              dialog = result.value;
              
              // Add event handler for DialogMessageReceived
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                  var jsonString = arg.message; // Get the JSON string
                  var jsonObject = JSON.parse(jsonString); // Parse it into an object
                  console.log(jsonObject);
              });
          });
      }
  });
  

  return (
    <div>
      <div>DialogWindow</div>
      <div>DialogID: {props.dialogID}</div>
      <div>urlQuery: {props.formula}</div>
      <div>Letters Formula: {props.lettersFormula}</div>
      <div>Values Formula: {props.valuesFormula}</div>
      <ArrayComponent valuesFormulaArray={[]} />
     
    </div>
  )
}