
// acceptable : img, json
var loadResources = function(paths){
  var promises = paths.map(function(path){
    if(!path){
      var d = $.Deferred();
      d.resolve(null);
      return d.promise();
    }
    var ext = path.split('.').pop();
    if(ext == "png" || ext == "jpg" || ext == "svg"){
      var d = $.Deferred();
      var img = new Image();
      img.src = path;
      img.onload = function(){
        d.resolve(img);
      };
      return d.promise();
    }else if(ext == "json"){
      return $.getJSON(path);
    }
    return null;
  });
  return Promise.all(promises);
};

Vue.component('v-canvas', Vue.extend({
  props: ['bg','cb'],
  template: '<canvas></canvas>',
  mounted: function() {
    var self = this;
    var el = this.$el;
    var ctx = el.getContext('2d');
    loadResources([this.bg]).then(function (resources) {
      ctx.drawImage(resources[0], 0, 0);
      self.cb(ctx);
    });
  }
}));