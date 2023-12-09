/* global Excel console */

const insertText = async (text) => {
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
      //sheetPropertiesChanged(range.formulas);
      //const range = sheet.getRange("A1");
      
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};


export default insertText;
