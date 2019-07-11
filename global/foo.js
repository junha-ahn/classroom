let info = require('./info');
let constant = require('./constant');

let self = {
  makeRandomPassword: () => {
    //Math.floor(Math.random() * (max - min + 1)) + min;
    let email_password = '';
    let max_length = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // 10~20
    for (let i = 0; i <= max_length; i++) {
      let flag = Math.floor(Math.random() * (1 - 0 + 1)) + 0; // 0~1
      let ascii_code = Math.floor(Math.random() * (122 - 65 + 1)) + 65; // 65~122 (아스키 코드 문자 범위)
      // 91~96 : 특수문자 범위
      if (ascii_code >= 91 && ascii_code <= 96) {
        ascii_code += 10;
      }
      email_password += (flag) ? String.fromCharCode(ascii_code) : ascii_code;
    }
    return email_password;
  },
  getDateSerial: () => {
    let now = new Date(Date.now());
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();

    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    let mili_second = now.getMilliseconds();
    return `${year}${month < 10 ? "0" + month : month}${date}_${hour}${minute}${second}_${mili_second}`
  },
  getIp: (req) => {
    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress || null;
    ip = (ip) ? ip.replace(/f/gi, "") : ip;
    ip = (ip) ? ip.replace(/:/g, "") : ip;
    return ip;
  },
  makeErrContext: (category, status, detail) => {
    let max = (detail && detail.max != null) ? detail.max : null;
    let message = {
      0: {
        0: `다른 것을 선택해주세요`,
        404: `대상의 상위존재를 찾을 수 없습니다`,
      },
      1: {
        0: `삭제 상태입니다`,
        1: `블라인드 상태입니다`,
        2: `블라인드 상태입니다`,
        3: `비밀 상태입니다, 본인 또는 관리자 계정으로 로그인해주세요`,
        404: `대상을 찾을 수 없습니다`,
      },
      3: {
        0: `운영자로 로그인 해주세요`,
        10: `로그인 해주세요`,
        100: `운영자 일부만 사용 가능합니다`,
        110: `운영자와 회원 일부만 사용 가능합니다`,
      },
      5: {
        1: `${max}분부터 수정/삭제 불가능합니다`,
        2: `자식이 ${max}개부터 수정/삭제 불가능합니다`,
        3: `댓글 ${max}개부터 수정/삭제 불가능합니다`,
        4: `${max}단계부터 작성 불가능합니다 (답글/대댓글)`,
        5: `답글/대댓글은 한 단계에서 ${max}까지 작성 가능합니다`,
        6: `임시 닉네임을 입력해주세요`,
        7: `카테고리를 다시 선택해주세요`,
        8: `해당 글의 작성자가 답글을 비허용 했습니다`,
      },
      7: {
        0: `운영자나 해당 회원으로 로그인 해주세요`,
        1: `해당 회원으로 로그인 해주세요`,
        2: `비밀번호를 입력해주세요`,
        3: `비밀번호가 일치하지 않습니다`,
      },
    }
    return {
      category,
      status,
      message: message[category][status],
      detail
    };
  },
  parseDateTimeFromDB: (string_from_db) => {
    let target_date = new Date(string_from_db);
    let target_year = target_date.getFullYear();
    let target_month = target_date.getMonth() + 1;
    let target_day = target_date.getDate();
    let target_hours = target_date.getHours();
    let target_minutes = target_date.getMinutes();

    let target_string = `${target_year}-${((target_month<10)? ("0"+target_month): target_month)}-${((target_day<10)? ("0"+target_day): target_day)} ${((target_hours<10)? ("0"+target_hours): target_hours)}:${((target_minutes<10)? ("0"+target_minutes): target_minutes)}`;

    return target_string;
  },
  parseDateFromDB: (string_from_db) => {
    let target_date = new Date(string_from_db);
    let target_year = target_date.getFullYear();
    let target_month = target_date.getMonth() + 1;
    let target_day = target_date.getDate();

    let target_string = `${target_year}-${((target_month<10)? ("0"+target_month): target_month)}-${((target_day<10)? ("0"+target_day): target_day)}`;

    return target_string;
  },
  cleaningList: (array, user, is_personal) => {
    for (let i in array) {
      if (array[i].auth_rsv_create != undefined) {
        array[i].available_for_rsv_create = self.checkPermission(user, array[i].auth_rsv_create);
      }
      if (array[i].auth_rsv_cancel != undefined) {
        array[i].available_for_rsv_cancel = self.checkPermission(user, array[i].auth_rsv_cancel);
      }
      array[i].date_created = array[i].date_created ? self.parseDateFromDB(array[i].date_created) : array[i].date_created;
      array[i].date_joined = array[i].date_joined ? self.parseDateFromDB(array[i].date_joined) : array[i].date_joined;
      array[i].date_last_updated = array[i].date_last_updated ? self.parseDateFromDB(array[i].date_last_updated) : array[i].date_last_updated;

      if (array[i].campus_id) {
        array[i].campus_name = info.campus_object[array[i].campus_id].name;
      }
      if (array[i].building_id) {
        array[i].building_name = info.building_object[array[i].building_id].name;
      }
      if (array[i].department_id) {
        array[i].department_name = info.department_object[array[i].department_id].name;
      }
      if (array[i].room_category_id) {
        array[i].room_category_name = info.room_category_object[array[i].room_category_id].name;
      }


      if (is_personal) {
        if (!user || user.user_type != info.ADMIN_TYPE) {
          array[i].name = array[i].name ? array[i].name.slice(0,1) + ('*'.repeat(array[i].name.length - 1)) : null;
          array[i].phone = array[i].phone ? '비공개' : undefined;
          array[i].student_number = array[i].student_number ? '비공개' : undefined
        }
      }
    }
  },
  checkPermission: (user, auth) => {
    let permission_results = info.permission_results;
    let type_name = (!user) ? 'non_user' : (user.user_type == info.ADMIN_TYPE) ? 'admin' : 'user';
    for (let i in permission_results) {
      if (permission_results[i].permission_id == auth) 
        if (permission_results[i][`${type_name}_is_allow`] == 1)
          return true;
    }
    return false;
  },
  getResJson: (user, json) => {
    json.is_user = (user) ? true : false;
    json.is_admin = (user && user.user_type == info.ADMIN_TYPE) ? true : false;
    return {
      ...json,
    }
  },
  setRes: (res, set_result, json) => {
    if (set_result.affectedRows) {
      res.status(200).json({
        ...json,
      })
    } else {
      res.status(constant.UNCHANGED_STATUS).json({
        display_message: constant.UNCHANGED_MESSAGE
      })
    }
  },
}

module.exports = self