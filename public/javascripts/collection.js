function makeJSCollection() {
  return {
    resetArray: function(array) {
      //array.length = 0;
      array.splice(0, array.length)
    },
  }
}