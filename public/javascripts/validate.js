function validate(form, _conf) {
  var key_names = Object.keys(_conf);

  for (var i = 0; i < key_names.length; i++) {
    var key = key_names[i];
    var value = form[key];

    var is_require = _conf[key].is_require;
    var name = config[key].name;
    var data_type = config[key].data_type;
    var max_length = config[key].max_length;
    var min_length = config[key].min_length;

    if (is_require) {
      if (value == undefined) {
        return name + '을/를 입력해주세요'
      }
      if (typeof value == 'string' && data_type == 'string' && value.trim() == '') {
        return name + '을/를 입력해주세요'
      }
    }
    if (value != null && data_type == 'number' && isNaN(value)) {
      return '숫자를 입력해주세요'
    }
    if (value != undefined) {
      if (max_length != undefined && value.length > max_length) {
        return max_length + '자 까지만 입력 가능합니다'
      }
      if (min_length != undefined && value.length < min_length) {
        return min_length + '자 이상 입력해 주세요'
      }
    }
  }
} 


var config = {
  'day_of_the_week' : {
    name: '요일',
    data_type: 'number',
  },
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
    min_length: 6,
    max_length: 20,
  },
  'password_check' : {
    name: '암호 확인',
    data_type: 'string',
    min_length: 6,
    max_length: 20,
  },
  'old_password' : {
    name: '기존 암호',
    data_type: 'string',
    min_length: 6,
    max_length: 20,
  },
  'name' : {
    name: '이름',
    data_type: 'string',
    min_length: 2,
    max_length: 20,
  },
  'phone' : {
    name: '전화번호',
    data_type: 'string',
    min_length: 2,
    max_length: 20,
  },
  'search_value' : {
    name: '검색어',
    data_type: 'string',
    min_length: 2,
    max_length: 20,
  },
  'student_number' : {
    name: '학번',
    data_type: 'string',
    min_length: 6,
    max_length: 20,
  },
  'representative_name' : {
    name: '대표자 이름',
    data_type: 'string',
    min_length: 2,
    max_length: 20,
  },
  'description' : {
    name: '설명',
    data_type: 'string',
  },
  'title' : {
    name: '제목',
    data_type: 'string',
    min_length: 2,
    max_length: 20,
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
  'room_category_id' : {
    name: '강의실 카테고리',
    data_type: 'number',
  },
  'room_number' : {
    name: '호수',
    data_type: 'string',
    min_length: 2,
    max_length: 20,
  },
  'floor' : {
    name: '층',
    data_type: 'number',
  },
  'seat_count' : {
    name: '좌석수',
    data_type: 'number',
  },
  'is_require_rsv_accept' : {
    name: '예약 신청, 자동승인 여부',
    data_type: 'number',
  },
  'is_require_cancel_accept' : {
    name: '예약 취소, 자동승인 여부',
    data_type: 'number',
  },
  'rsv_apply_min_day' : {
    name: '예약 신청 불가능 일수',
    data_type: 'number',
  },
  'rsv_cancel_min_day' : {
    name: '예약 취소 불가능 일수',
    data_type: 'number',
  },
  'auth_rsv_create' : {
    name: '예약 신청 권한',
    data_type: 'number',
  },
  'auth_rsv_cancel' : {
    name: '예약 취소 권한',
    data_type: 'number',
  },
  'room_rsv_category_id' : {
    name: '강의실 예약 카테고리',
    data_type: 'number',
  },
  'rsv_status' : {
    name: '예약 상태',
    data_type: 'number',
  },
  'is_public_holiday' : {
    name: '공휴일 여부',
    data_type: 'number',
  },
  'start_date' : {
    name: '시작일',
    data_type: 'object',
  },
  'end_date' : {
    name: '종료일',
    data_type: 'object',
  },
  'representative_student_number' : {
    name: '대표자 학번',
    data_type: 'string',
  },
}