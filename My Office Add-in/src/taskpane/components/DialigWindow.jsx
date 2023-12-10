import React from 'react'

export default function DialigWindow(props) {

  var parts = props.formula.match(/[^();]+|\([^()]*\)/g);

  // Выводим результат
  for (var i = 0; i < parts.length; i++) {
    console.log("Часть " + (i + 1) + ":", parts[i]);

  }

  return (
    <div>
      <div>DialogWindow</div>
      <div>DialogID: {props.dialogID}</div>
      <div>urlQuery: {props.formula}</div>
      {parts.map((part) => <div>{part}</div>)}
    </div>
  )
}
