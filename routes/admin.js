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

router.get('/admin/user/lookup', isAdmin, async (req, res, next) => {
  res.render('admin_users', foo.getResJson(req.user, {

  }))
});
router.get('/admin/user/single/:user_id', isAdmin, async (req, res, next) => {
  res.render('admin_user', foo.getResJson(req.user, {

  }))
});
router.get('/admin/holiday', isAdmin, async (req, res, next) => {
  res.render('admin_holiday', foo.getResJson(req.user, {

  }))
});
router.get('/admin/schedule', isAdmin, async (req, res, next) => {
  res.render('admin_schedule', foo.getResJson(req.user, {

  }))
});
router.get('/admin/room/lookup', isAdmin, async (req, res, next) => {
  res.render('admin_rooms', foo.getResJson(req.user, {

  }))
});
router.get('/admin/room/single/:room_id', isAdmin, async (req, res, next) => {
  res.render('admin_room', foo.getResJson(req.user, {

  }))
});
router.get('/admin/reservation/lookup', isAdmin, async (req, res, next) => {
  res.render('admin_reservations', foo.getResJson(req.user, {

  }))
});
router.get('/admin/reservation/single/:room_reservation_id', isAdmin, async (req, res, next) => {
  res.render('admin_reservation', foo.getResJson(req.user, {

  }))
});


module.exports = router;