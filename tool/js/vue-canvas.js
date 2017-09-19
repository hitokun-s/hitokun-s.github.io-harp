(function (){
  
  VueCanvas = {
    draw: function(ctx, children, done){
      
      console.log("VueCanvas.draw1", children);
      
      var children = children.filter(function(child){
        console.log(child);
        return child.componentOptions !== undefined && child.componentInstance !== undefined;
      });

      console.log("VueCanvas.draw2", children);
      
      children.sort(function(child1, child2){
        return (parseInt(child1.componentOptions.propsData.ord) || 9999) - (parseInt(child2.componentOptions.propsData.ord) || 9999);
      });
      var drawFuncs = children.map(function(child){
        return child.componentInstance.draw;
      });
      var promises = drawFuncs.map(function(draw){
        return function(){
          return new Promise(function(resolve){
            draw(ctx, resolve);
          });
        };
      });

      var promise = promises[0]();
      for (var i = 1; i < promises.length; i++){
        promise = promise.then(promises[i]);
      }
      promise.then(done);
    }
  };

  Vue.directive('canvas', {
    bind: function (el, binding, vnode) {

      console.log("bind");
      console.log(vnode.children);

      var canvas = el;
      var ctx = canvas.getContext('2d');

      ctx.clearRect(0,0,canvas.width, canvas.height);
      
      VueCanvas.draw(ctx, vnode.children, function(){
        binding.value ? binding.value(ctx) : null;
      });
    },
    
    update: function(el, binding, vnode){
      console.log("update");
      var bind = binding.def.bind;
      bind(el, binding, vnode);
    }
  });
  
})();