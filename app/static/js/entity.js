define(function(require){
  require('prototype');

  return Class.create({
    initialize: function(type, sprite, collidable, update) {
      this.type = type;
      this.sprite = sprite;
      this.collidable = collidable;
      this.update = update;
    },
  }
});
