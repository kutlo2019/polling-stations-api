const mysql = require('mysql');
const { database } = require('../config');

class Constituency {
  constructor(c_code, c_name) {
    this.c_code = c_code;
    this.c_name = c_name;
  }

  static getAll(callback) {
    const connection = mysql.createConnection(database);
    connection.query('SELECT * FROM constituencies', (err, results) => {
      if (err) {
        callback(err);
        return;
      }
      
      const constituencies = results.map(row => new Constituency(row.c_code, row.c_name));
      console.log(constituencies)
      callback(null, constituencies);
    });
    connection.end();
  }

  static insertConstituencies(constituencies) {
  
    const connection = mysql.createConnection(database);
    connection.connect();
  
    const createTableSQL = "CREATE TABLE IF NOT EXISTS constituencies (c_code int unique, c_name varchar(255));";
    connection.query(createTableSQL, function (err, res) {
      if (err) throw err;
      console.log("Constituencies table created");
    });
  
    const constituenciesArray = constituencies.map(item => Object.values(item));

    const sql = `INSERT IGNORE INTO constituencies (c_code, c_name) VALUES ?`;

    connection.query(sql, [constituenciesArray], (err, result) => {
      if (err) throw err;
      console.log(`Inserted ${result.affectedRows} row(s) into constituencies`);
    });
  
    connection.end();
  }
}

module.exports = Constituency;
