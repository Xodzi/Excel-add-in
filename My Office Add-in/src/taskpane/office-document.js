/* global Excel console */

const insertText = async (text) => {
  try {
    Excel.run(async (context) => {

      const sheet = context.workbook.worksheets.getActiveWorksheet();
      let range = context.workbook.getSelectedRange();
      range.values = [[text]];
      range.format.autofitColumns();
      return context.sync();
      
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

export default insertText;
