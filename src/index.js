var DBC = require('./dbc');
var inquirer = require('inquirer');
var { Command } = require('commander')
var fs = require("fs");
var command = new Command();

const dbcPath = `${__dirname}/../data/dbc/`;

const dbcList = [];

fs.readdirSync(dbcPath).forEach(file => {
  dbcList.push(file.replace('.dbc', ''));
});

const onlyProperties = (object, keys) => Object.entries(object).reduce((prev, [key, value]) => ({ ...prev, ...(keys.includes(key) && { [key]: value }) }), {})

function searchInRow(row, search, fields) {
  if (!search)
    return row;

  let _row = row;

  if (fields) {
    _row = onlyProperties(row, fields);
  }

  for (const prop of Object.values(_row)) {
    if (`${prop}`.search(search)>=0)
      return row;
  }

  return null;
}

function toSql(fileName, row) {
  let tableName = `${fileName}_dbc`;
  return `INSERT INTO ${tableName} (${Object.keys(row)}) VALUES (${Object.values(row).map(v=>typeof v === "string" ? `"${v}"` : v)});`;
}

function extractDBC(dbcName, { search, fields, outType }) {
  console.log(`Reading ${dbcName}.dbc file`)

  const filePath = `${__dirname}/../data/dbc/${dbcName}.dbc`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`${dbcName}.dbc doesn't exist`)
  }

  var dbc = new DBC(filePath, dbcName);

  return dbc.toJSON().then(function (dbcTable) {
    const foundList = [];
    for (const row of dbcTable) {
      const found = searchInRow(row, search, fields);
      if (found)
        foundList.push(found)
    }

    switch(outType) {
      case 'sql':
        for (const row of foundList) {
          console.log(toSql(dbcName,row));
        }
      break;
      default:
        console.log(foundList);
      break;
    }
  });
}

/**
 * 
 * @param {string} dbcName 
 * @param {object} options 
 * @param {string} command 
 */
const actionCommand = async (dbcNames, { search, fields, outType }, command) => {
  if (!dbcNames.length)
    dbcNames = dbcList;

  for (const dbc of dbcNames) {
    await extractDBC(dbc, { search, fields, outType });
  }
}

command.name("acore-dbc")
  .arguments('<dbcname...>')
  .option('-s,--search <text>', 'search text')
  .option('-f,--fields <fields...>', 'DBC fields to use for the search')
  .option('-t,--out-type [type]',"Output types: sql, json","json")
  .action(actionCommand);


command.parse();

// inquirer
//   .prompt([
//     /* Pass your questions in here */
//   ])
//   .then(answers => {
//     // Use user feedback for... whatever!!
//   })
//   .catch(error => {
//     if(error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }
//   });


