const info = require('./info')
const constant = require('./constant')
const foo = require('./foo')

const db_func = require('./db_func')

const {
  select_func,
} = require('../query/index');

let self = {
  getRerservationLookup: (is_adminpage) => {
    return async function (req, res, next) {
      let building_id = (is_adminpage) ? req.user.building_id : req.query.building_id;
      let {
        room_id,
        department_id,
        study_group_id,
        rsv_status,
        is_mine,
        date,
        search_type,
        search_value,
        page,
        page_length,
      } = req.query;
      page_length = page_length || 10;
      rsv_status = rsv_status ? rsv_status : null;
      if (search_type != undefined &&  !constant.SEARCH_TYPE_LIST.includes(search_type)) {
        res.status(401).render('error', foo.getResJson(req.user, {
          error_name: "비허용 검색 타입",
          message: "검색 타입을 다시 선택해주세요"
        }));
      } else if (building_id == null && (is_mine != 1 || req.user == undefined)) {
        res.status(403).render('error', foo.getResJson(req.user, {
          error_name: "학습관을 선택해주세요",
          message: "상단 예약 메뉴를 이용해주세요"
        }));
      } else {
        let connection;
        try {
          connection = await db_func.getDBConnection();
          let {
            results,
            list_count,
          } = await select_func.vRoomRsvList(connection, {
            room_id,
            building_id,
            department_id,
            study_group_id,
            rsv_status,
            is_mine,
            user_id: req.user ? req.user.user_id : null,
            date,
            search_type,
            search_value,
            page,
            page_length,
            sort_key: 'start_datetime',
            sort_type: false,
          })
          foo.cleaningList(results, req.user);
          res.render((is_adminpage ? 'admin' : 'user') + '/reservation_lookup', foo.getResJson(req.user, {
            is_adminpage,
            params: req.params,
            query: {
              ...req.query,
              room_id: room_id || 0,
              department_id: department_id || 0,
              study_group_id: study_group_id || 0,
              rsv_status: rsv_status || 0,
              is_search: search_type ? 1 : 0,
              search_type: search_type || 'title',
            },
            building_id: is_adminpage ? req.user.building_id : req.params.building_id,
            department_results: info.department_results,
            rsv_status_results: info.rsv_status_results,
            results,
            list_count,
          }));
        
        } catch (error) {
          next(error)
        } finally {
          db_func.release(connection);
        }
      }
    }
  },
  getRerservationSingle: (is_adminpage) => {
    return db_func.inDBStream(async (req, res, next, conn) => {
      let room_rsv_id = req.params.room_rsv_id;
      let {
        results
      } = await select_func.vRoomRsvSingle(conn, {
        room_rsv_id,
        user_id: req.user ? req.user.user_id : null,
        building_id: is_adminpage ? req.user.building_id : null,
      });

      if (!results[0]) {
        res.status(401).render('error', foo.getResJson(req.user, {
          error_name: "예약을 찾을수 없습니다",
          message: "다시 확인해주세요"
        }));
      } else {
        foo.cleaningList(results, req.user);
        res.render((is_adminpage ? 'admin' : 'user') + '/reservation_single', foo.getResJson(req.user, {
          is_adminpage,
          params: req.params,
          room_rsv: results[0],
          rsv_status_results: info.rsv_status_results,
          room_rsv_category_results: info.room_rsv_category_results,
          building_id: is_adminpage ? req.user.building_id : req.params.building_id,
          department_results: is_adminpage ? info.department_results : null,
        }));
      }
    });
  },
  getUserSingle: (is_adminpage) => {
    return db_func.inDBStream(async (req, res, next, conn) => {
      let user_id = is_adminpage ? req.params.user_id : req.user.user_id;

      let {
        results,
        list_count
      } = await select_func.vUser(conn, {
        user_id,
        campus_id: req.user.campus_id,
        building_id: req.user.building_id,
      });

      if (!results[0]) {
        res.status(401).render('error', foo.getResJson(req.user, {
          error_name: '404 NOT FOUND',
          message: '유저를 찾을 수 없습니다',
        }));
      } else {
        foo.cleaningList(results);
        res.render(is_adminpage ? 'admin/user_single' : 'user/mypage_account', foo.getResJson(req.user, {
          user: results[0],
          query: req.query,
          params: req.params,
          department_results: info.department_results,
          campus_results: info.campus_results,
          buildings: info.buildings,
        }))
      }
    });
  },
}

module.exports = self;