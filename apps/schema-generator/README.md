# schema-generator

This schema-generator can be used to automatically generate the schema json files needed by the dbc-reader

At the moment it supports the azerothcore db but you can add support to any kind of database. Check the tableMaps folder.

## How to use

1. copy the .env.dist file and rename it to .env
2. configure your .env file according to your db parameters
3. run `npm run start` to start the generation process

The json files will be generated inside the "output" folder. You can move those files within the src/schemas folder to allow the dbc-reader to properly read and export dbc data.
