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
