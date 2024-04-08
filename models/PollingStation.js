const mysql = require('mysql');
const { database } = require('../config');

class PollingStation {
  constructor(ps_code, ps_name, pd_code) {
    this.ps_code = ps_code;
    this.ps_name = ps_name;
    this.pd_code = pd_code;
  }

  static getAll(callback) {
    const connection = mysql.createConnection(database);
    connection.query('SELECT * FROM pollingstations', (err, results) => {
      if (err) {
        callback(err);
        return;
      }
      const stations = results.map(row => new PollingStation(row.ps_code, row.ps_name, row.pd_code));
      callback(null, stations);
    });
    connection.end();
  }

  static getByDistrictName(districtName, callback) {
    const connection = mysql.createConnection(database);
    connection.connect();

    const sql = `SELECT * FROM pollingstations ps JOIN pollingdistricts pd ON ps.pd_code = pd.pd_code where pd.pd_name = '${districtName}';`
    connection.query(sql, (err, results) => {
      if (err) {
        callback(err);
        return;
      }
      const stations = results.map(row => new PollingStation(row.ps_code, row.ps_name, row.pd_code));
      callback(null, stations);
    });
    connection.end();
  }

  static insertPollingStations(data) {
    const connection = mysql.createConnection(database);
    connection.connect();
    const createTableSQL = "CREATE TABLE IF NOT EXISTS pollingstations (ps_code int unique, ps_name varchar(255), pd_code int);";
    connection.query(createTableSQL, function (err, res) {
      if (err) throw err;
      console.log("PollingStations table created");
    });
  
    let Pd_Code = 0;
    const pollingStations = [];
    data.forEach(item => {
      if (item.Pd_Code) {
        Pd_Code = item.Pd_Code
      } else {
        pollingStations.push([item.Ps_Code, item.Ps_Name, Pd_Code ])
      }
    });
  
    const insertStationSQL = "INSERT IGNORE INTO pollingstations (ps_code, ps_name, pd_code) VALUES ?";
    connection.query(insertStationSQL, [pollingStations], function (err, res) {
      if (err) throw err;
      console.log("Number of records inserted: " + res.affectedRows);    
    })
  
    connection.end();
  }
}

module.exports = PollingStation;
