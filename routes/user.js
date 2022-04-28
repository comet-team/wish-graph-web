var express = require('express');
var request = require('request')
var router = express.Router();

async function drawPage(req, res) {
  let owner = req.query.id;
  var lst = [];
  var id_arr = [];
  var names_arr = [];
  let api_req = new Promise((resolve, reject) => {
    request('http://localhost:8080/v0.1/user-items?walletToken=' + owner, (err, response, body) => {
      if (err) { return console.log(err); }
      var p_body = JSON.parse(body);
      for (let i = 0; i < p_body.length; ++i) {
        lst.push(p_body[i].url);
        let id = p_body[i].id;
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
        names_arr.push(p_body[i].title);
      }
      resolve();
    });
  });
  vvv = await api_req;
  res.render('user', {list_url: lst, list_id: id_arr, list_names: names_arr});
}

router.get('/', function(req, res, next) {
  drawPage(req, res);
});

module.exports = router;
