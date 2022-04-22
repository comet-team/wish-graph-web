var express = require('express');
var request = require('request')
const Web3 = require('web3');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {need_print: false, list_url: [], list_id: []});
});

async function drawPage(req, res) {
  let owner = req.body.owner;
  var lst = [];
  var id_arr = [];
  let api_req = new Promise((resolve, reject) => {
    let is_valid = Web3.utils.isAddress(owner);
    if (!is_valid) {
      resolve();
    }
    request('http://5.63.159.42:8081/user_recommend/' + owner, (err, response, body) => {
      if (err) { return console.log(err); }
      var p_body = JSON.parse(body.replace('NaN', "null"));
      for (let i = 0; i < p_body.length; ++i) {
        for (let j = 0; j < p_body[i].nft.length; ++j) {
          lst.push(p_body[i].nft[j].url);
          let id = p_body[i].nft[j].id;
          let idx = 0;
          while (id[idx] != ':') {
            ++idx;
          }
          id = id.slice(idx + 1);
          id_arr.push(id);
        }
      }
      resolve();
    });
  });
  vvv = await api_req;
  res.render('index', {need_print: true, list_url: lst, list_id: id_arr});
}

router.post('/', function(req, res, next) {
  drawPage(req, res);
});

module.exports = router;
