import React, { useEffect, useState } from 'react'
import queryString from 'query-string';
import {parse, visit} from 'excel-formula-parser';
import ArrayComponent from "../components/ArrayComponent";
import { Button } from 'react-bootstrap';
//import to_array from '../office-document'

// need npm install query-string

export default function DialigWindow(props) {

  const [array,SetArray] = useState([]);

  console.log("check after");

  useEffect(() => {
    // Получение параметра jsonString из URL
    const { jsonString } = queryString.parse(window.location.search);

    if (jsonString) {
      // Преобразование JSON-строки в массив и установка состояния
      const formulasObjectsArray = JSON.parse(jsonString);
      SetArray(formulasObjectsArray);
    }
  }, []);

  console.log("check before");

  console.log(array);

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
  };*/

  // Выводим результат
  //for (var i = 0; i < parts.length; i++) {
  //  console.log("Часть " + (i + 1) + ":", parts[i]);
  //}

  return (
    <div>
      <div>DialogWindow</div>
      <div>Primal Formula: {props.lettersFormula}</div>
      <div>Transform Formula: {props.valuesFormula}</div>
      <ArrayComponent valuesFormulaArray={array}></ArrayComponent>
    </div>
  )
}