const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.xlsx');

async function appendToExcel({ name, work, date }) {
  const workbook = new ExcelJS.Workbook();
  let worksheet;

  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet('Employee Data');
  }

  // Create worksheet and set headers if it doesn't exist
  if (!worksheet) {
    worksheet = workbook.addWorksheet('Employee Data');
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Work Done', key: 'work', width: 50 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Time', key: 'time', width: 20 },
    ];
  }

  // Check and insert header row manually if needed
  const hasHeader = worksheet.getRow(1).getCell(1).value === 'Name';
  if (!hasHeader) {
    worksheet.spliceRows(1, 0, ['Name', 'Work Done', 'Date', 'Time']);
  }

  // Get current time
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Add the new data row
  worksheet.addRow([name, work, date, timeString]);

  await workbook.xlsx.writeFile(filePath);
  console.log('✅ Appended to Excel:', name, work, date, timeString);
}

module.exports = { appendToExcel };
