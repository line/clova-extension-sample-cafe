const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const tutorial1 = require('../tutorials/tutorial-1')
const tutorial2 = require('../tutorials/tutorial-2')
const tutorial3 = require('../tutorials/tutorial-3')
const tutorial4 = require('../tutorials/tutorial-4')

router.post('/tutorial-1', bodyParser.json(), tutorial1);
router.post('/tutorial-2', bodyParser.json(), tutorial2);
router.post('/tutorial-3', bodyParser.json(), tutorial3);
router.post('/tutorial-4', bodyParser.json(), tutorial4);

module.exports = router;
