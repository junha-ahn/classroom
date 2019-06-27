var express = require('express');
var router = express.Router();

let results = [{
    user_id: 1,
    name: '보라돌이'
  },
  {
    user_id: 2,
    name: '뚜비'
  },
  {
    user_id: 3,
    name: '나나'
  },
];

router.get('/user', function (req, res, next) {
  res.status(200).json({
    results,
    list_count: results.length,
  })
});

router.post('/user', function (req, res, next) {
  results.push({
    user_id: results.length + 1,
    name: req.body.name
  })
  res.status(200).json({
    message: "성공"
  })
});
module.exports = router;