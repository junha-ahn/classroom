function makeGlobal() {
  return {
    ajax: function (object, done, err) {
      var url = object.url;
      var type = object.type || 'get';
      var data = object.data;
      var query = object.query;

      $.ajax({
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
          var msg = rd.message || '죄송합니다 오류가 발생했습니다.'
          err(msg, status, rd)
        }
      });
    }
  }
  function serializeQuery(query) {
    if (!query)
      return '';
    var data = Object.keys(query);
    return data.length
    ? '?' + data.map(function(key){
      var value = query[key];
      return (value !== '' && value !== null && value !== undefined)
      ? key + '=' + value
      : ''
    }).join('&')
    : '';
  };
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