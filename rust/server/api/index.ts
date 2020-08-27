const express = require('express');

const {Router} = express;
export const router = new Router();

const hello = require('./hello');
const quadratic = require('./quadratic');

router.use('/say', hello);
router.use('/solve', quadratic);

module.exports = router;