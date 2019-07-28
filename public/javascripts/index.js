function makeGlobal() {
  var USER_TYPE = 10;
  var ADMIN_TYPE = 30;
  var message = {
    NEED_LOGIN : '로그인이 필요합니다'
  }
  var resetTime = function(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
  var parseDate = function(date_string, is_seoul_tz) {
    var date = new Date(date_string);
    if (is_seoul_tz) {
      date.setHours(date.getHours() - 9);
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var string = year + '-' + ((month<10)? ("0"+month): month) + '-' + ((day<10)? ("0"+day): day);
    return string;
  }
  var parseDateTime = function(date_string, is_seoul_tz) {
    var date = new Date(date_string);
    if (is_seoul_tz) {
      date.setHours(date.getHours() - 9);
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hours = date.getHours();
    var minutes = date.getMinutes();

    var string = year + '-' + ((month<10)? ("0"+month): month) + '-' + ((day<10)? ("0"+day): day)
      + ' ' + ((hours<10)? ("0"+hours): hours) + ':' + ((minutes<10)? ("0"+minutes): minutes);
    return string;
  }
  var parseTime = function(date_string, is_seoul_tz) {
    var date = new Date(date_string);
    if (is_seoul_tz) {
      date.setHours(date.getHours() - 9);
    }

    var hours = date.getHours();
    var minutes = date.getMinutes();

    var string = ((hours<10)? ("0"+hours): hours) + ':' + ((minutes<10)? ("0"+minutes): minutes);
    return string;
  }
  var header_name_by_class = {
    'main' : 'main',
    'study_group_lookup' : 'study_group',
    'study_group_single' : 'study_group',
    'study_group_write' : 'study_group',
    'mypage_dashboard' : 'mypage',
    'mypage_account' : 'mypage',
    'login' : 'login',
    'reservation_intro' : 'reservation',
    'reservation' : 'reservation',
    'reservation_lookup' : 'reservation',
    'reservation_single' : 'reservation',

    'admin_user_lookup' : 'admin',
    'admin_user_single' : 'admin',
    'admin_room_lookup' : 'admin',
    'admin_room_single' : 'admin',
    'admin_room_write' : 'admin',
    'admin_reservation_lookup' : 'admin',
    'admin_reservation_single' : 'admin',
    'admin_reservation_write' : 'admin',
  };
  var admin_name_by_class = {
    'admin_user_lookup' : 'user',
    'admin_room_lookup' : 'room',
    'admin_reservation_lookup' : 'reservation',
  };
  var mypage_name_by_class = {
    'mypage_dashboard' : 'dashboard',
    'mypage_account' : 'account',
  };
  var getHeaderMenuName = function (page_class_name) {
    return header_name_by_class[page_class_name];
  };
  var getAdminMenuName = function (page_class_name) {
    return admin_name_by_class[page_class_name];
  };
  var getMypageMenuName = function (page_class_name) {
    return mypage_name_by_class[page_class_name];
  };
  var serializeQuery =  function(query) {
    if (!query)
      return '';
    var data = Object.keys(query);
    if (!data.length) 
      return ''; 
    
    var queryString = ''
    for (var i = 0; i < data.length; i++) {
      var key = data[i];
      var value = query[key];
      if ((value !== '' && value !== null && value !== undefined)) {
        if (queryString === '') {
          queryString += '?'
        } else {
          queryString += '&'
        }
        queryString += key + '=' + value;
      }
    }
    return queryString;
  }
  var ajax = function (object, done, err) {
    var url = object.url;
    var type = object.type || 'get';
    var data = object.data;
    var query = object.query;

    jQuery.ajax({
      url: url + serializeQuery(query),
      type: type,
      cache: false,
      contentType: "application/json; charset=UTF-8",
      data: data != null ? JSON.stringify(data) : null,
      success: function (rd) {
        var status;
        done(rd, status);
      },
      error: function (e) {
        var status = e.status;
        var rd = e.responseJSON;
        var msg = rd ? rd.message : '죄송합니다 오류가 발생했습니다.'
        msg = msg ? msg : '죄송합니다 오류가 발생했습니다.'
        err(msg, status, rd)
      }
    });
  };
  return {
    USER_TYPE: USER_TYPE,
    ADMIN_TYPE: ADMIN_TYPE,
    REQ_RSV_STATUS : 20,
    CANCEL_RSV_STATUS : 40,
    CANCEL_REQ_RSV_STATUS : 60,
    SUBMIT_RSV_STATUS : 80,

    resetTime : resetTime,
    parseDate : parseDate,
    parseDateTime : parseDateTime,
    parseTime : parseTime,
    serializeQuery: serializeQuery,
    ajax: ajax,
    getHeaderMenuName: getHeaderMenuName,
    getAdminMenuName: getAdminMenuName,
    getMypageMenuName: getMypageMenuName,
    message : message,
  }
}

/** 
 * @const @function pagenation
 * @desc 페이지네이션 로직 처리 함수
 * 
 * @param {object} data - 모든 설정과 데이터, 상태를 하나의 객체로 받는다.
 *   @property {number} numberOfItems - 총 항목 수 (데이터 길이)
 *   @property {number} itemsPerPage - 페이지당 항목 수 (설정값)
 *   @property {number} pagesPerNav - 페이지네이션당 페이지 수 (설정값)
 *   @property {number} indexOfPage - 현재페이지 번호 (상태)
 *   @property {boolean} hasPrevAndNext - 이전/다음페이지 항목을 만들지 (설정값)
 *   @property {string} prevText - 이전페이지 항목의 이름 (설정값)
 *   @property {string} nextText - 다음페이지 항목의 이름 (설정값)
 * 
 * @returns {object[]} - [ {name, value, isSelf}, ...] 각각의 페이지
 *   @property {string|number} name - 표시되어야 할 이름 (페이지번호 또는 이전다음 문자)
 *   @property {number} value - 페이지번호
 *   @property {boolean} isSelf - 현재페이지와 이 객체가 같은 번호라면 true
*/

function pagenation(data) {
  var pageCount = Math.ceil(data.numberOfItems / data.itemsPerPage);
  var navCount = Math.ceil(pageCount / data.pagesPerNav);
  var navIndex = Math.ceil(data.indexOfPage / data.pagesPerNav);
  function getFirstOfNav(index){
    return data.pagesPerNav * (index - 1) + 1;
  }
  function getLastOfNav(index){
    return (data.pagesPerNav * index > pageCount)
    ? pageCount
    : data.pagesPerNav * index;
  }
  var firstOfNav = getFirstOfNav(navIndex);
  var lastOfNav = getLastOfNav(navIndex);
  var pages = [];
  if(data.hasPrevAndNext && navIndex != 1){
    pages.push({
      name: data.prevText || 'prev',
      value: getLastOfNav(navIndex - 1),
      isSelf: false
    });
  }
  for(var i = firstOfNav; i <= lastOfNav; i++){
    pages.push({
      name: i,
      value: i,
      isSelf: (data.indexOfPage == i),
    });
  }
  if(data.hasPrevAndNext && navIndex != navCount && pageCount > 0){
    pages.push({
      name: data.nextText || 'next',
      value: getFirstOfNav(navIndex + 1),
      isSelf: false
    });
  }
  return pages;
}
