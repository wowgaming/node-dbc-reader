require('dotenv').config();
const mysqldump = require('mysqldump');
const fs = require("fs");
const { Parser } = require('sql-ddl-to-json-schema');

const { getTableMap } = require(`./tableMaps/${process.env.TABLE_MAP_FILE}.js`);

async function main() {
  const tableList = getTableMap();

  const sql = await mysqldump.default({
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
    },
    dump: {
      tables: Object.keys(tableList),
    }
  });

  const parser = new Parser('mysql');

  /**
   * Feed the parser with the SQL DDL statements...
   */
  parser.feed(sql.dump.schema);

  /**
   * You can get the parsed results in JSON format...
   */
  const parsedJsonFormat = parser.results;

  /**
   * And pass it to be formatted in a compact JSON format...
   */
  const compactJsonTablesArray = parser.toCompactJson(parsedJsonFormat);

  for (const table of compactJsonTablesArray) {
    dbcSchema=[];
    for (const column of table.columns) {
      let dbcColumn = { name : column.name}

      switch (column.type.datatype) {
        case "int":
          dbcColumn.type = column.options.unsigned ? 'uint' : 'int';
        break;
        case "varchar":
        case "text":
          dbcColumn.type = "string";
        break;
        case "byte":
          dbcColumn.type = "byte";
        break;
        case "float":
          dbcColumn.type = "float";
        break;
        default:
          console.error("Field not supported yet, please open a PR for it:", JSON.stringify(column, null, 2))
        break
      }

      dbcSchema.push(dbcColumn);
    }
    
    fs.writeFileSync(`output/${tableList[table.name]}.json`, JSON.stringify(dbcSchema, null, 2));
  }

  console.log("Schemas exported! Check the output folder");
}

main();
