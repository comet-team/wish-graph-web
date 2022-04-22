var express = require('express');
var request = require('request')
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {need_print: false, list_url: [], list_id: []});
});

async function drawPage(req, res) {
  let owner = req.body.owner;
  var lst = [];
  var id_arr = []
  let promise_info = new Promise((resolve, reject) => {
    request('https://api.rarible.org/v0.1/items/byOwner?owner=ETHEREUM%3A' + owner, (err, response, body) => {
      if (err) { return console.log(err); }
      var p_body = JSON.parse(body);
      let arr = [];
      for (let i = 0; i < p_body.items.length; ++i) {
        if (p_body.items[i].meta != undefined && p_body.items[i].meta.content != undefined) {
          if (p_body.items[i].meta.content[0] != undefined) {
            arr.push(p_body.items[i].meta.content[0].url);
            let id = p_body.items[i].id;
            let idx = 0;
            while (id[idx] != ':') {
              ++idx;
            }
            ++idx;
            id = id.slice(idx);
            id_arr.push(id);
          }
        }
      }
      resolve(arr);
    });
  });
  lst = await promise_info;
  res.render('index', {need_print: true, list_url: lst, list_id: id_arr});
}

router.post('/', function(req, res, next) {
  drawPage(req, res);
});

module.exports = router;
