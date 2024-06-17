'use strict';

const fsp = require('fs').promises;
const path = require('path');
const Schema = require(path.join(__dirname, 'schema'));
const MAGIC_NUMBER = 1128416343;

function readFile (filename, options) {
    return fsp.readFile(filename, options).then(data => data);
}

function toCSV(array) {
    // let rows;
    const lineBreak = "\n";
    const delimiter = ",";

    const header = Object.keys(array[0]);

    array.unshift(header);

    const csv = array
        .map(obj => Object.keys(obj)
            .map(key => obj[key])
            .join(delimiter))
        .join(lineBreak);

    return csv;
}

function DBC(path, schemaName) {
    if (!schemaName) {
        throw new Error('You must define a schemaName before continue.');
    }

    this.path = path;
    this.schemaName = schemaName;
}

DBC.prototype.getSchema = function() {
    const schemaName = this.schemaName;
    const schema = require(path.join(__dirname, 'schemas', schemaName + '.json'));

    return new Schema(schema);
};

DBC.prototype.toJSON = function() {
    return this.read();
};

DBC.prototype.toCSV = function() {
    return this.read().then(rows => toCSV(rows));
};

// Put all the buffer strings in an array.
DBC.prototype.parseStringBlock = function(buffer) {
    let pointer = 0;
    let currentString = '';
    let strings = [];

    for (let i = 0; i < buffer.length; i++) {
        let byte = buffer[i];

        if (byte === 0) {
            strings[pointer - currentString.length] = currentString;
            currentString = '';
        } else {
            currentString += String.fromCharCode(byte);
        }

        pointer++;
    }

    return strings;
};

DBC.prototype.read = function() {
    const dbc = this;
    const schema = this.getSchema();

    this.signature = '';
    this.records = 0;
    this.fields = 0;
    this.recordSize = 0;

    return readFile(this.path).then(buffer => {
        dbc.signature = buffer.toString('utf8', 0, 4);

        if (dbc.signature !== 'WDBC') {
            throw new Error('DBC \'' + path + '\' has an invalid signature and is therefore not valid');
        }

        if (buffer.readUInt32LE(0) !== MAGIC_NUMBER) {
      throw new Error("File isn't valid DBC (missing magic number: " + MAGIC_NUMBER + ")");
        }

        dbc.fields = buffer.readUInt32LE(8);
        dbc.records = buffer.readUInt32LE(4);
        dbc.recordSize = buffer.readUInt32LE(12);

    /**@type {buffer} */
        let recordBlock;
    /**@type {buffer} */
        let recordData;
        let stringBlockPosition = buffer.length - buffer.readUInt32LE(16);
        let strings = dbc.parseStringBlock(buffer.slice(stringBlockPosition));

        recordBlock = buffer.slice(20, stringBlockPosition);

        let rows;

        dbc.rows = rows = [];

        for (let i = 0; i < dbc.records; i++) {
            let row = {};
            recordData = recordBlock.slice(i * dbc.recordSize, (i + 1) * dbc.recordSize);
            let pointer = 0;

            schema.getFields().forEach(function (key, index) {
                let value;
                let type = key.type;
                let colName = key.name || 'field_' + (index + 1);

                switch(type) {
                    case 'int':
                        value = recordData.readInt32LE(pointer)
                        break;
                    case 'uint':
                        value = recordData.readUInt32LE(pointer);
                        break;
                    case 'float':
                        value = recordData.readFloatLE(pointer);
                        break;
                    case 'byte':
                        value = recordData.readInt8(pointer);
                        pointer += 1;
                        break;
                    case 'string':
                        value = strings[recordData.readInt32LE(pointer)];
                        break;
                    default:
                        value = recordData.readInt32LE(pointer)
                        break;
                    }

                row[colName] = value;

                if (type !== 'byte' && type !== 'null' && type !== 'localization') {
                    pointer += 4;
                }
            });

            rows.push(row);
        }

        return dbc.rows;
    });
};

module.exports = DBC;
