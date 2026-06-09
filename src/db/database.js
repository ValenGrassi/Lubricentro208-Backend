import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite conectado");
  }
});

export default db;