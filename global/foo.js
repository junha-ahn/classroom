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
  resetTime: (date) => {
    date.millisecond(0);
    date.second(0);
    date.minute(0);
    date.hour(0);
    return date;
  },
  parseDateTime: (date_string, is_seoul_tz) => {
    let target_date = new Date(date_string);
    if (is_seoul_tz) {
      target_date.setHours(target_date.getHours() - 9);
    }
    let target_year = target_date.getFullYear();
    let target_month = target_date.getMonth() + 1;
    let target_day = target_date.getDate();
    let target_hours = target_date.getHours();
    let target_minutes = target_date.getMinutes();

    let target_string = `${target_year}-${((target_month<10)? ("0"+target_month): target_month)}-${((target_day<10)? ("0"+target_day): target_day)} ${((target_hours<10)? ("0"+target_hours): target_hours)}:${((target_minutes<10)? ("0"+target_minutes): target_minutes)}`;

    return target_string;
  },
  parseDate: (date_string, is_seoul_tz) => {
    let target_date = new Date(date_string);
    if (is_seoul_tz) {
      target_date.setHours(target_date.getHours() - 9);
    }
    let target_year = target_date.getFullYear();
    let target_month = target_date.getMonth() + 1;
    let target_day = target_date.getDate();

    let target_string = `${target_year}-${((target_month<10)? ("0"+target_month): target_month)}-${((target_day<10)? ("0"+target_day): target_day)}`;

    return target_string;
  },
  parseTimeString: (time_string, show_meridiem) => {
    let res_string = '';
    if (time_string) {
      time_string = time_string.substring(0, 5);
      let getTime = time_string.substring(0, 2);

      if (show_meridiem) {
        res_string += getTime < 12 ? '오전 ' : '오후 ';
        res_string += `${getTime == 12 ? getTime : getTime%12}:${time_string.substring(3,5)}`;

      } else {
        res_string = time_string;
      }
    }
    return res_string || '(미지정)';
  },
  cleaningList: (array, user, is_personal) => {
    for (let i in array) {
      if (array[i].auth_rsv_create != undefined) {
        array[i].available_for_rsv_create = self.checkPermission(user, array[i].auth_rsv_create);
      }
      if (array[i].auth_rsv_cancel != undefined) {
        array[i].available_for_rsv_cancel = self.checkPermission(user, array[i].auth_rsv_cancel);
      }
      array[i].password = undefined
      array[i].date_created = array[i].date_created ? self.parseDate(array[i].date_created, true) : array[i].date_created;
      array[i].date_joined = array[i].date_joined ? self.parseDate(array[i].date_joined, true) : array[i].date_joined;
      array[i].date_last_updated = array[i].date_last_updated ? self.parseDate(array[i].date_last_updated, true) : array[i].date_last_updated;

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
          array[i].name = array[i].name ? array[i].name.slice(0, 1) + ('*'.repeat(array[i].name.length - 1)) : null;
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
    return json
  },
  setRes: (res, set_result, json) => {
    if (set_result.affectedRows) {
      res.status(200).json(json)
    } else {
      res.status(constant.UNCHANGED_STATUS).json({
        display_message: constant.UNCHANGED_MESSAGE
      })
    }
  },
}

module.exports = self