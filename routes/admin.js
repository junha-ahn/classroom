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

router.get('/user/lookup', isAdmin, async (req, res, next) => {
  res.render('admin_users', foo.getResJson(req.user, {

  }))
});
router.get('/user/single/:user_id', isAdmin, async (req, res, next) => {
  res.render('admin_user', foo.getResJson(req.user, {

  }))
});

router.get('/schedule', isAdmin, async (req, res, next) => {
  res.render('admin_schedule', foo.getResJson(req.user, {

  }))
});
router.get('/room/lookup', isAdmin, async (req, res, next) => {
  res.render('admin_rooms', foo.getResJson(req.user, {

  }))
});
router.get('/room/single/:room_id', isAdmin, async (req, res, next) => {
  res.render('admin_room', foo.getResJson(req.user, {

  }))
});
router.get('/reservation/lookup', isAdmin, async (req, res, next) => {
  res.render('admin_reservations', foo.getResJson(req.user, {

  }))
});
router.get('/reservation/single/:room_reservation_id', isAdmin, async (req, res, next) => {
  res.render('admin_reservation', foo.getResJson(req.user, {

  }))
});


module.exports = router;