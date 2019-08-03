
Vue.component('custom-modal', {
  template:'<div v-if="is_close==false" id="custom_modal" class="alert alert-warning fade in" role="alert">' 
  +'<button @click="close()" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'
  +' <strong> {{ title }}</strong><br/>{{ message }}</div>'
  ,
  props: {
  },
  data: function() { 
    return {
      modal_type: 'ie',
      is_close: true,
      title: '',
      message : '',
    }
  },
  methods: {
    close: function() {
      this.is_close = true;
    },
    openSizeModal: function() {
      this.modal_type = 'size';
      this.is_close = false;
      this.title = '본 웹사이트는 PC버전에 최적화되어 있습니다.'
      this.message = '창 크기를 키워주세요. 모바일일 경우 PC버전을 사용해주세요.'
    },
    closeSizeModal: function() {
      if (this.modal_type == 'size') {
        this.is_close = true;
      }
    },
  },
  created: function() {
    var __this = this;
    window.addEventListener("resize", function(){
      if (window.innerWidth < 768) {
        __this.openSizeModal();
      } else {
        __this.closeSizeModal();
      }
    });
    
    if (global.ieVersion != null && global.ieVersion < 11) {
      this.openModal();
      this.modal_type = 'ie';
      this.is_close = false;
      this.title = '본 웹사이트는 크롬 브라우저에 최적화되어 있습니다'
      this.message = '인터넷 익스플로러 버전 10 이하일 경우, 예약 관련 기능은 이용 불가능합니다.'
    } else {
      var size = getBrowserSize();
      if (size.x < 768) {
        this.openSizeModal();
      }
    }
  },
})