# berlin-datahub-harvester
NodeJS Script to harvest data from TTN applications and push it into PostgreSQL DB

## Install dependencies
type: `npm install`

## Start harvester
type: `npm start`

## Config of credentials
In order to connect to the TTN application and the postgreSQL all credentials have to be stored within the `.env`-file. Use the `.envTEMPLATE` file to fill in your very personal credentials and make sure to rename the file afterwards to `.env` to make sure it\`s gonna be ignored by `.gitignore` and won\`t be pushed to GitHub.