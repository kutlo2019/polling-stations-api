const express = require('express');
const { authenticateToken } = require('./middleware');
const Constituency = require('./models/Constituency');
const PollingDistrict = require('./models/PollingDistrict');
const PollingStation = require('./models/PollingStation');
const paginateJSON = require('./paginateJSON');

const router = express.Router();

// Public endpoints
router.get('/constituencies', (req, res) => {
  Constituency.getAll((err, constituencies) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(paginateJSON(req, constituencies));
  });
});

router.get('/pollingdistricts', (req, res) => {
  PollingDistrict.getAll((err, districts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(paginateJSON(districts));
  });
});

router.get('/pollingdistricts/:constituencyName', (req, res) => {
  const { constituencyName } = req.params;
  PollingDistrict.getByConstituencyName(constituencyName, (err, districts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(paginateJSON(req, districts));
  });
});

router.get('/pollingstations', (req, res) => {
  PollingStation.getAll((err, stations) => {
    if (err) return res.status(500).json({ error: err.message });
    const paginated = paginateJSON(req, stations)
    res.json(paginated);
  });
});

router.get('/pollingstations/:districtName', (req, res) => {
  const { districtName } = req.params;
  PollingStation.getByDistrictName(districtName, (err, stations) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(paginateJSON(stations));
  });
});

// Private endpoint
router.get('/private', authenticateToken, (req, res) => {
  res.json({ message: 'This is a private endpoint' });
});

module.exports = router;
