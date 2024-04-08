const XLSX = require("xlsx");
const { readFileSync } = require("fs");

const arraybuffer = readFileSync("./data/polling-stations.xlsx")
const data = new Uint8Array(arraybuffer);
const arr = new Array();
for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
const bstr = arr.join("");

const workbook = XLSX.read(bstr, {type:"binary"});

const worksheet = workbook.Sheets[workbook.SheetNames[0]]
const processedData = XLSX.utils.sheet_to_json(worksheet);

const districtsAndConstituencies = processedData.filter(item => item.C_Code || item.Pd_Code);
const constituencies = processedData.filter(item => item.C_Code);
const stationsAndDistricts = processedData.filter(item => item.Pd_Code || item.Ps_Code);


const mysql = require('mysql');
const { database } = require('./config');

const Constituency = require('./models/Constituency');
const PollingDistrict = require('./models/PollingDistrict');
const PollingStation = require('./models/PollingStation');

function loadToSQL() {
  const connection = mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password
  });
  connection.connect();

  connection.query("CREATE DATABASE IF NOT EXISTS db1;", function(err, res) {
    if (err) throw err;
    console.log("Database db1 created");
  });

  const select = `USE db1;`
  connection.query(select);
  Constituency.insertConstituencies(constituencies);
  PollingDistrict.insertPollingDistricts(districtsAndConstituencies);
  PollingStation.insertPollingStations(stationsAndDistricts);

  connection.end();
}

module.exports = { loadToSQL, processedData };