var express = require('express');
var request = require('request')
var router = express.Router();

async function drawPage(req, res) {
  let owner = req.query.id;
  let g_from = [];
  let g_to = [];
  let bd;
  let api_req = new Promise((resolve, reject) => {
    request('http://localhost:8080/v0.1/graph?walletToken=ETHEREUM:' + owner, (err, response, body) => {
      if (err) { return console.log(err); }
      bd = body;
      resolve();
    });
  });
  vvv = await api_req;
  res.render('graph', {body: bd});
}

router.get('/', function(req, res, next) {
  drawPage(req, res);
});

module.exports = router;
