const fs = require("fs");

fs.mkdir("./copy",{recursive : true},  function (err) {
  if (err) console.error(err);
  else console.log("done");
});
const folderPath = './copy'; // Replace with your folder path

// Asynchronous method
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }
  console.log('Files in folder:', files);
});
// Asynchronous method
fs.readFile("hey.txt", 'utf8', (err) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    console.log('File contents:');
  });