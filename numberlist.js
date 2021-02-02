const fs = require('fs');
const nodeXlsx = require('node-xlsx');

const xlsxFilePath = process.argv[2];
if (!xlsxFilePath) {
  return 'Path is Empty!'
}
try {
  const workSheetsFromFile = nodeXlsx.parse(xlsxFilePath);
  const numberArray = workSheetsFromFile[0]?.data?.map(item => item[0]);
  let writeStream = fs.createWriteStream('text.txt');
  numberArray.forEach(element => {
    const digitString = element.toString();
    let result = '';
    isDevidedByFive = digitString.endsWith('0') || digitString.endsWith('5');
    // Для больших чисел, лучше находить делится ли сумма цифр на 3
    isDevidedByTree = element % 3 === 0;
    if (isDevidedByTree)
      result = 'Fizz';
    if (isDevidedByFive) 
      result += 'Buzz';
    isDevidedByTree = false;
    writeStream.write(`${ result || digitString }\n`);
  });
  writeStream.end();
} catch (error) {
  console.log(`Error: ${error}`);
}