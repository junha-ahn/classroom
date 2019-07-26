function validate(form, _conf) {
  var key_names = Object.keys(_conf);

  for (var i = 0; i < key_names.length; i++) {
    var key = key_names[i];
    var value = form[key];

    var is_require = _conf[key].is_require;
    var name = config[key].name;
    var data_type = config[key].data_type;

    if (is_require) {
      if (value == undefined) {
        return name + '을/를 입력해주세요'
      }
      if (typeof value == 'string' && data_type == 'string' && value.trim() == '') {
        return name + '을/를 입력해주세요'
      }
    }
  }
} 


var config = {
  'department_id' : {
    name: '학과',
    data_type: 'number',
  },
  'study_group_id' : {
    name: '스터디',
    data_type: 'number',
  },
  'campus_id' : {
    name: '캠퍼스',
    data_type: 'number',
  },
  'building_id' : {
    name: '학습관',
    data_type: 'number',
  },
  'email' : {
    name: '이메일',
    data_type: 'string',
  },
  'email_password' : {
    name: '이메일 인증 암호',
    data_type: 'string',
  },
  'password' : {
    name: '암호',
    data_type: 'string',
  },
  'password_check' : {
    name: '암호 확인',
    data_type: 'string',
  },
  'old_password' : {
    name: '기존 암호',
    data_type: 'string',
  },
  'name' : {
    name: '이름',
    data_type: 'string',
  },
  'phone' : {
    name: '전화번호',
    data_type: 'string',
  },
  'student_number' : {
    name: '학번',
    data_type: 'string',
  },
  'representative_name' : {
    name: '대표자 이름',
    data_type: 'string',
  },
  'description' : {
    name: '설명',
    data_type: 'string',
  },
  'title' : {
    name: '제목',
    data_type: 'string',
  },
  'date' : {
    name: '날짜',
    data_type: 'object',
  },
  'room_id' : {
    name: '강의실',
    data_type: 'number',
  },
  'student_count' : {
    name: '학생 인원',
    data_type: 'number',
  },
  'non_student_count' : {
    name: '비학생 인원',
    data_type: 'number',
  },
  'representative_phone' : {
    name: '대표자 번호',
    data_type: 'string',
  },
  'is_student' : {
    name: '학생/교직원',
    data_type: 'number',
  },
}