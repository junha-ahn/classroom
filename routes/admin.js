const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');

const  {
  select_func,
} = require('../query/index');


const info = require('../global/info');
const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn,
  isAdmin,
} = require('../global/middlewares');

router.get('/', isAdmin, async (req, res, next) => {
  res.render('admin_main', foo.getResJson(req.user, {

  }));
});

module.exports = router;