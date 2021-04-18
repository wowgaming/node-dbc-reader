# ACORE-DBC-READER

This command line utility allows you to read and search data within a dbc file and export the result in a json or sql output

!!!THIS IS AN ALPHA VERSION, DO NOT USE EXPORTED SQL ON YOUR DB!!!

## Install

`npm install`

## Getting started

Run this command to read the instructions

`npm run start -- --help`

### Example usage

`npm run start -- --search=Wrath --fields=Name_Lang_enUS --out-type=sql Spell`
