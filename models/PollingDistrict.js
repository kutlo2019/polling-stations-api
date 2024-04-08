const mysql = require('mysql');
const { database } = require('../config');

class PollingDistrict {
  constructor(pd_code, pd_name, c_code) {
    this.pd_code = pd_code;
    this.pd_name = pd_name;
    this.c_code = c_code;
  }

  static getAll(callback) {
    const connection = mysql.createConnection(database);
    connection.query('SELECT * FROM pollingdistricts', (err, results) => {
      if (err) {
        callback(err);
        return;
      }
      const constituencies = results.map(row => new PollingDistrict(row.pd_code, row.pd_name, row.c_code));
      callback(null, constituencies);
    });
    connection.end();
  }

  static getByConstituencyName(c_name, callback) {
    const connection = mysql.createConnection(database);
    connection.query(`SELECT * FROM pollingdistricts pd JOIN constituencies c on pd.c_code = c.c_code where c.c_name = '${c_name}';`, (err, results) => {
      if (err) {
        callback(err);
        return;
      }
      const districts = results.map(row => new PollingDistrict(row.pd_code, row.pd_name, row.c_code));
      callback(null, districts);
    });
    connection.end();
  }

  static insertPollingDistricts(data) {
    const connection = mysql.createConnection(database);
    connection.connect();

    const createTableSQL = "CREATE TABLE IF NOT EXISTS pollingdistricts (pd_code int unique, pd_name varchar(255), c_code int);";
    connection.query(createTableSQL, function (err, res) {
      if (err) throw err;
      console.log("PollingDistricts table created");
    });
  
    let C_Code = 0;
    const pollingDistricts = [];
    data.forEach(item => {
      if (item.C_Code) {
        C_Code = item.C_Code
      } else {
        pollingDistricts.push([item.Pd_Code, item.Pd_Name, C_Code ])
      }
    });
  
    const insertDistrictsSQL = "INSERT IGNORE INTO pollingdistricts (pd_code, pd_name, c_code) VALUES ?";
    connection.query(insertDistrictsSQL, [pollingDistricts], function (err, res) {
      if (err) throw err;
      console.log("Number of records inserted: " + res.affectedRows);    
    })
  
    connection.end();
  }
}

module.exports = PollingDistrict;
