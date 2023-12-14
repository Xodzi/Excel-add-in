import React from 'react'

export default function DialigWindow(props) {

  var lettersParts = props.lettersFormula.match(/[^();]+|\([^()]*\)/g);

  var valuesParts = props.valuesFormula.match(/[^();]+|\([^()]*\)/g);

  // Выводим результат
  //for (var i = 0; i < parts.length; i++) {
  //  console.log("Часть " + (i + 1) + ":", parts[i]);
  //}

  return (
    <div>
      <div>DialogWindow</div>
      <div>Letters Formula: {props.lettersFormula}</div>
      {lettersParts.map((lettersPart) => <div>{lettersPart}</div>)}
      <div>Next values</div>
      <div>Values Formula: {props.valuesFormula}</div>
      {valuesParts.map((valuesPart) => <div>{valuesPart}</div>)}
    </div>
  )
}