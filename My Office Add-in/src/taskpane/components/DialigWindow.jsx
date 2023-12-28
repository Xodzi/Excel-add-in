import React, { useState } from 'react'
import {parse, visit} from 'excel-formula-parser';
import Tree from './TreeNode'; 
//import to_array from '../office-document'



export default function DialigWindow(props) {



  //var lettersParts = props.lettersFormula.match(/[^();]+|\([^()]*\)/g);

  //var valuesParts = props.valuesFormula.match(/[^();]+|\([^()]*\)/g);

  /*const options = {
    licenseKey: 'gpl-v3',
    dateFormats: ['MM/DD/YYYY', 'MM/DD/YY', 'YYYY/MM/DD'],
    timeFormats: ['hh:mm', 'hh:mm:ss.sss'], // set by default
    currencySymbol: ['$', 'USD'],
    localeLang: 'en-US',
    functionArgSeparator: ',', // set by default
    decimalSeparator: '.', // set by default
    thousandSeparator: '', // set by default
    arrayColumnSeparator: ',', // set by default
    arrayRowSeparator: ';', // set by default
    nullYear: 30, // set by default
    caseSensitive: false, // set by default
    accentSensitive: true,
    ignorePunctuation: false, // set by default
    useWildcards: true, // set by default
    useRegularExpressions: false, // set by default
    matchWholeCell: true, // set by default
    useArrayArithmetic: true,
    ignoreWhiteSpace: 'any',
    evaluateNullToZero: true,
    leapYear1900: true,
    nullDate: { year: 1899, month: 12, day: 31 },
    smartRounding: true, // set by default
  };
  const data = [['=SUM(1,2)']];
  const hfInstance = HyperFormula.buildFromArray(data, options);
  const mySum = hfInstance.getCellValue({ col: 3, row: 0, sheet: 0 });*/

  // Выводим результат
  //for (var i = 0; i < parts.length; i++) {
  //  console.log("Часть " + (i + 1) + ":", parts[i]);
  //}

  return (
    <div>
      <div>DialogWindow</div>
      <div>DialogID: {props.dialogID}</div>
      <div>urlQuery: {props.formula}</div>
      <div>Letters Formula: {props.lettersFormula}</div>
      <div>Values Formula: {props.valuesFormula}</div>

      <Tree tree={props.tree} />
     
    </div>
  )
}