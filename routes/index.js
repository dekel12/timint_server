var express = require('express');
var faker = require('faker');
var moment = require('moment')
var chance = require('chance')
var router = express.Router();

function log(a){console.log(a); return a;}
function generate(){
  function generateNetos(bruto){
      var lastDate = moment(bruto.start)
      for (let index = 0; index < 30; index++) {
          var start = moment(lastDate).add(chance().integer({min: 1, max: 10}), 'm')
          var end = moment(start).add(chance().integer({min: 1, max: 20}),'m')
          if (end.diff(bruto.end) > 0)
              continue
          var description = faker.random.words()
          var name = faker.random.word()
          var neto = {
              name: name,
              start: new Date(start),
              end: new Date(end),
              description:description,
          }
          lastDate = moment(end)
          bruto.netosArray.push(neto)
      }
  }

  brutos = []
  // generate bruto
  for (let index = 0; index < 5; index++) {
      var yesterday = moment().subtract(1,'day')
      var now = moment()
      var start = moment(faker.date.between(yesterday,now))
      var end = moment(faker.date.between(start,now))
      if (end.diff(start,'hours') < 3){
          index --
          continue
      }
      var description = faker.random.words()
      var name = faker.random.word()
      var bruto = {
          name: name,
          start: start,
          end: end,
          description:description,
          netosArray: [],
          addedToDB: moment(faker.date.between(start, end))
      }
      generateNetos(bruto)
      brutos.push(bruto)
  }

  console.log(JSON.stringify(brutos))
  return brutos
}

router.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(generate());
});

module.exports = router;
