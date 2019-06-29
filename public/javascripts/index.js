function makeGlobal() {
  return {
    ajax: function (object, done, err) {
      var url = object.url;
      var type = object.type;
      var data = object.data;
      if (data != null) {
        data = JSON.stringify(data);
      }
      $.ajax({
        url,
        type,
        cache: false,
        contentType: "application/json; charset=UTF-8",
        data,
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
}