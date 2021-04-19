# NODE-DBC-READER

This command line utility allows you to read and search data within a dbc file and export the result in a json or sql output

!!!THIS IS AN ALPHA VERSION, DO NOT USE EXPORTED SQL ON YOUR DB!!!

Only Spell.dbc is supported at the moment. You can contribute by adding schemas to the /src/schemas folder

## Requirements

You need latest LTS [nodejs](https://nodejs.org/en/)

## Install

`npm install`

## Getting started

Run this command to read the instructions

`npm run start -- --help`

### Example usage

`npm run start -- --search=Wrath --columns=Name_Lang_enUS --out-type=sql --file=output.sql Spell`

### Advanced search

The --search option supports regex, however, if you need to search a set of numeric values or running a strict-equal research, you can use the following syntax:

`{*} <condition> <yourvalue>`

the `{*}` placeholder will be replaced by the value of the column, while you can apply to it any kind of javascript supported condition. This condition will be evaluated at runtime.

Examples:

* `npm run start -- --search="{*} == 100" --columns=ID Spell` to search a specific spell by ID

* `npm run start -- --search="[2,3,4].includes({*})" --columns=ID Spell` to search an array of provided IDs

* `npm run start -- --search="{*} >= 100 && {*} <= 200" --columns=ID Spell` it will search all spells with an ID between 75000 and 76000

* `npm run start -- --search="{*} == 'Wrath'" --columns=Name_Lang_enUS Spell` it will search all spells with a name that is strict equal to **Wrath**

NOTE: this is a runtime eval, it means that you can even use more advanced conditions using any compatible method available in javascript.
