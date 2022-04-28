var express = require('express');
var request = require('request')
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {need_print: false, list_url: [], list_id: [], list_names: []});
});

async function drawPage(req, res) {
  let owner = req.body.owner;
  var lst = [];
  var id_arr = [];
  var names_arr = [];
  let api_req = new Promise((resolve, reject) => {
    request('http://localhost:8080/v0.1/recommend?walletToken=ETHEREUM:' + owner, (err, response, body) => {
      if (err) { return console.log(err); }
      var p_body = JSON.parse(body.replace('NaN', "null"));
      for (let i = 0; i < p_body.authors.length; ++i) {
        for (let j = 0; j < p_body.authors[i].nft.length; ++j) {
          if (p_body.authors[i].nft[j].url == null || p_body.authors[i].nft[j].id == null) {
            continue;
          }
          lst.push(p_body.authors[i].nft[j].url);
          let id = p_body.authors[i].nft[j].id;
          let idx = 0;
          while (id[idx] != ':') {
            ++idx;
          }
          let crypto_name = id.slice(0, idx).toLowerCase();
          id = id.slice(idx + 1);
          if (crypto_name != 'ethereum') {
            id = crypto_name + '/' + id;
          }
          id_arr.push(id);
          names_arr.push(p_body.authors[i].nft[j].title);
        }
      }
      resolve();
    });
  });
  vvv = await api_req;
  res.render('index', {need_print: true, list_url: lst, list_id: id_arr, list_names: names_arr});
}

router.post('/', function(req, res, next) {
  drawPage(req, res);
});

module.exports = router;
