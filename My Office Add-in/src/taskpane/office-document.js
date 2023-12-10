/* global Excel console */



const insertText = async (text) => {
  // Write text to the top left cell.
  try {
    Excel.run(async (context) => {
      let dialog; // Declare dialog as global for use in later functions.
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15', {height: 30, width: 20},
          function (asyncResult) {
              dialog = asyncResult.value;
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
          }
      )
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      let range = context.workbook.getSelectedRange();
      range.load("formulas");
      await context.sync();
      console.log(range.formulas);
      var formula =range.formulas[0];

      console.log(formula[0])

      // Разбиваем формулу на части по открывающим и закрывающим скобкам
      var parts = formula[0].match(/[^();]+|\([^()]*\)/g);

      // Выводим результат
      for (var i = 0; i < parts.length; i++) {
          console.log("Часть " + (i + 1) + ":", parts[i]);
      }

      //sheetPropertiesChanged(range.formulas);
      //const range = sheet.getRange("A1");
      range.values = [[text]];
      range.format.autofitColumns();
      return context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};


export default insertText;
