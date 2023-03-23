# Nunua
A simple, half baked nodejs backend

## Prerequisites
install nodejs and ensure npm works
install mysql or mariadb as a database

## Usage
create a database with a relevant name and create the tables users

this can be done with
```sql
create database logindb;
use logindb;
CREATE TABLE users( ID INT NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY ( ID ) );
```
Make sure you edit index.js here to reflect the name of your database,table,database user and password
```js
const db = mysql.createConnection({
    host:'localhost',
    user:'lawrence',
    password:'password',
    database:'logindb'
})
```
install dependencies and start your server

```bash
npm install
npm start
```

## Contribution
Pull requests are welcomed.
And you can report the issues on the issues page.