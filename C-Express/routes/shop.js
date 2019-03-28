const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('In the next middleware');
    res.send('<h1>Hello world!!!</h1>');
});

module.exports = router;
