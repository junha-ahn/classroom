
Vue.component('custom-notification', {
  template: '<span v-if="unread_notificaiton_count" class="glyphicon glyphicon-bell" aria-hidden="true">{{unread_notificaiton_count}}</span>',
  props: {
    is_user: Boolean,
  },
  data: function() { 
    return {
      unread_notificaiton_count: null,
    }
  },
  methods: {
    getNotificationCount: function() {
      var __this = this;
      global.ajax({
        url: '/api/notification' + global.serializeQuery({
          is_read: 0,
          page:1,
          page_length:5,
        }),
        type: 'GET',
      },
      function (data, status) {
        __this.unread_notificaiton_count = data.list_count;
      },
      function (message, status, data) {
        alert(message);
      });
    },
  },
  created: function() {
    if (this.is_user) {
      this.getNotificationCount();
    }
  }
})