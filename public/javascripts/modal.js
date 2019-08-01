
Vue.component('custom-modal', {
  template:'<div v-if="is_close==false" id="custom_modal" class="alert alert-warning fade in" role="alert">' 
  +'<button @click="close()" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'
  +' <strong> {{ title }}</strong><br/>{{ message }}</div>'
  ,
  props: {
    title: String,
    message : String,
  },
  data: function() { 
    return {
      is_close: false,
    }
  },
  methods: {
    close: function() {
      this.is_close = true;
    },
  },
})