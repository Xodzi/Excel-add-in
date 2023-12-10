/* global Excel console */

const insertText = async (text) => {
  try {
    Excel.run(async (context) => {

      //const sheet = context.workbook.worksheets.getActiveWorksheet();
      let range = context.workbook.getSelectedRange();
      range.load("formulas");
      await context.sync();
      //console.log(range.formulas);
      var formula = range.formulas[0][0];
      //localStorage.setItem("formula", range.formulas[0][0]); // localStorage
      let dialog; // Declare dialog as global for use in later functions.
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&formula=' + formula, {height: 30, width: 20},
          function (asyncResult) {
              dialog = asyncResult.value;
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
          }
      )
      
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

export default insertText;
