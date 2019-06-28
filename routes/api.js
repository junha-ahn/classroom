var express = require('express');
var router = express.Router();

let results = require('../data.js');

router.get('/user', function (req, res, next) {
  res.status(200).json({
    results,
    list_count: results.length,
  })
});

router.post('/user', function (req, res, next) {
  let name = req.body.name;

  if (name) {
    results.push({
      user_id: results.length + 1,
      name
    })
    res.status(200).json({
      message: "성공"
    })
  } else {
    res.status(401).json({
      message : "이름을 재대로 입력해주세요"
    })
  }
});

router.delete('/user/:user_id', function (req, res, next) {
  let flag = false;
  for (let i in results) {
    if (results[i].user_id == req.params.user_id) {
      results.splice(i, 1);
      flag = true;
    }
  }
  res.status(200).json({
    message: flag ? '성공' : '삭제 실패'
  })
});
module.exports = router;