var DBC = require('./dbc');
var inquirer = require('inquirer');
var { Command } = require('commander')
var fs = require("fs");
var command = new Command();

const dbcPath = `${__dirname}/../data/dbc/`;

const dbcList = [];

const SUBST_PATTERN = "{*}";

fs.readdirSync(dbcPath).forEach(file => {
  dbcList.push(file.replace('.dbc', ''));
});

const onlyProperties = (object, keys) => Object.entries(object).reduce((prev, [key, value]) => ({ ...prev, ...(keys.includes(key) && { [key]: value }) }), {})

/**
 * 
 * @param {object} row 
 * @param {string} search 
 * @param {string[]} fields 
 * @returns 
 */
function searchInRow(row, search, fields, isAdvanced = false) {
  if (!search)
    return row;

  let _row = row;

  if (fields) {
    _row = onlyProperties(row, fields);
  }

  for (const prop of Object.values(_row)) {
      if (isAdvanced) {
        let replacement = typeof prop === "string" ?  `"${JSON.stringify(prop).slice(1, -1)}"` : prop;
        let advancedSearch = search.split(SUBST_PATTERN).join(replacement);
        try {
          if (eval(advancedSearch))
            return row;
        } catch(e) {
          console.error(advancedSearch);
          throw e;
        }
      } else {
        if (`${prop}`.search(search)>=0)
          return row;
      }
  }

  return null;
}

function toSql(fileName, row) {
  let tableName = `${fileName}_dbc`;
  let values = Object.values(row).map(v=>typeof v === "string" ? `"${v}"` : v);
  let keys = Object.keys(row).map(v=>"`"+v+"`");
  return `INSERT INTO ${tableName} (${keys})\n VALUES (${values});`;
}

function extractDBC(dbcName, { search, columns, outType, file, condition }) {
  console.log(`Reading ${dbcName}.dbc file`)

  const filePath = `${__dirname}/../data/dbc/${dbcName}.dbc`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`${dbcName}.dbc doesn't exist`)
  }

  var dbc = new DBC(filePath, dbcName);

  return dbc.toJSON().then(function (dbcTable) {
    const foundList = [];

    let isAdvanced = search.includes(SUBST_PATTERN);

    for (const row of dbcTable) {
      const found = searchInRow(row, search, columns, isAdvanced);
      if (found)
        foundList.push(found)
    }

    let result=[];
    switch(outType) {
      case 'sql':
        for (const row of foundList) {
          result.push(toSql(dbcName,row));
        }
      break;
      default:
        result=foundList;
      break;
    }

    if (file) {
      fs.writeFileSync(file,result.join('\n'));
      return;
    }

    console.log(result);
  });
}

/**
 * 
 * @param {string} dbcName 
 * @param {object} options 
 * @param {string} command 
 */
const actionCommand = async (dbcNames, { search, columns, outType, file }, command) => {
  if (!dbcNames.length)
    dbcNames = dbcList;

  for (const dbc of dbcNames) {
    await extractDBC(dbc, { search, columns, outType, file });
  }
}

command.name("acore-dbc")
  .arguments('<dbcname...>')
  .option('-s,--search <text>', 'Search text, it supports regex and advanced patterns. Check the README for further information')
  .option('-c,--columns <columns...>', 'DBC columns to use for the search, if not specified the search will run on all columns')
  .option('-t,--out-type [type]',"Output types: sql, json", "json")
  .option('-f,--file <filename>', 'Whether to save in a file or not')
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


