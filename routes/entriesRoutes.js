const express = require('express');
const router = express.Router();

const { renderAboutus, renderNewEntry, createNewEntry } = require('../controllers/entriesController');
const { render } = require('ejs');

router.get('/', renderAboutus);

router.get('/new-entry', renderNewEntry)

router.post('/new-entry', createNewEntry)

module.exports = router;