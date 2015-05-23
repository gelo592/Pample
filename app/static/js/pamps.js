$(function() {
  border = 20;
  footer = 57;
  canvas = $("#game")[0];
  canvas.width = $(window).innerWidth() - (2 * border);
  canvas.height = $(window).innerHeight() - footer;

  spritesToLoad = 1;
  mapSprite = new Image();
  mapSprite.src ='static/img/mapsprite.png';
  mapSprite.onload = spriteLoaded;

  mapWidth = 31;
  mapHeight = 19;

  //visibleMapWidth = canvas.
  tileWidth = 50;
  tileHeight = 84;

  moMap = {
    left: false,
    up: false,
    right: true,
    down: true
  };

  player = {
    x: 0,
    y: 0,
    globalX: 0,
    globalY: 0
  };

  mapArray = [
      [0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,2,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,0,1,1,0,1,1,0,0,0,0,0,0,0,0,3],
      [1,1,2,1,2,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,0,1,2,2,1,2,0,0,0,0,3,4,4],
      [1,1,1,1,0,1,1,1,1,2,0,0,0,2,0,0,0,3,4,4],
      [1,0,0,1,1,1,1,2,2,1,0,0,0,0,0,0,3,0,4,4],
      [0,0,0,1,1,1,1,1,2,1,0,0,0,0,0,0,3,0,3,3],
      [0,0,0,0,0,2,2,1,1,1,0,0,0,0,0,0,4,3,3,0],
      [0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,3,3,4,3,0],
      [0,0,0,0,0,0,0,2,2,0,0,0,0,0,3,3,4,4,3,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,3,4,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,5,3,3,3,3,4,0],
      [1,1,0,0,0,0,0,0,0,0,0,0,5,5,5,4,4,4,4,0],
      [1,2,2,0,0,0,0,0,0,0,0,5,5,5,5,4,0,4,4,0],
      [1,1,2,0,0,0,0,0,0,0,0,5,5,5,5,4,0,3,0,0],
      [1,1,0,0,0,0,0,0,0,0,0,5,5,5,5,0,1,4,4,0],
      [2,1,1,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0],
      [1,2,2,2,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0],
      [1,2,0,0,0,1,0,0,0,5,5,5,0,0,0,1,0,0,0,0],
      [1,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0],
      [2,1,1,0,0,1,2,1,1,0,0,1,0,0,0,0,0,0,0,0],
      [1,0,1,1,0,1,1,0,1,1,0,1,1,0,0,0,0,0,0,0],
      [2,1,1,0,0,2,2,1,1,0,0,1,1,1,1,0,0,0,0,0],
      [1,1,1,0,1,2,1,1,1,0,1,2,2,1,2,0,0,0,0,4],
      [0,1,1,1,1,1,0,1,1,1,1,2,0,0,0,2,0,0,0,4],
      [1,1,1,2,2,1,1,1,1,2,2,1,0,0,0,0,0,0,0,0],
      [1,1,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0,0,0,0],
      [0,2,2,1,1,0,0,2,2,1,1,1,0,0,0,0,0,0,0,3],
      [0,0,2,0,1,0,0,0,2,0,1,0,0,0,0,0,0,3,4,4],
      [1,2,2,1,1,0,0,2,1,2,1,1,0,0,0,0,0,0,0,3],
      [1,1,2,0,1,0,0,0,0,0,1,0,0,0,0,0,0,3,3,3]
    ];

  context = canvas.getContext('2d');
  function spriteLoaded() {
    spritesToLoad--;
    if(!spritesToLoad){ run(); }
  }

  function run() {
    pample.gameBoard.drawMap();
    pample.gameBoard.drawPlayer();
  }

  var pample = pample || {};

  pample.gameBoard = {
    canvas: canvas,
    context: context,
    mapSprite: mapSprite,

    bgTileMap: mapArray,

    mapDimensions: {
      fullWidth: mapArray.length,
      fullHeight: mapArray[0].length,
      visibleWidth: Math.floor(canvas.width / tileWidth),
      visibleHeight: Math.floor(canvas.height / (tileHeight / 2)),
      movementAreaLeft: Math.floor((canvas.width / tileWidth) / 4),
      movementAreaUp: Math.ceil((canvas.height / tileHeight) / 4),
      movementAreaRight: 3 * Math.floor((canvas.width / tileWidth) / 4),
      movementAreaDown: 3 * Math.ceil((canvas.height / tileHeight) / 4),
      xOffset: 0,
      yOffset: 0
    },

    tileMapSprites: [
      {'x': 101, 'y': 0},
      {'x': 0, 'y': 0},
      {'x': 51, 'y': 0},
      {'x': 152, 'y': 0},
      {'x': 202, 'y': 0},
      {'x': 252, 'y': 0}
    ],

    mapWidth: mapWidth,
    mapHeight: mapHeight,
    tileWidth: tileWidth,
    tileHeight: tileHeight,

    redraw: function(){
      // draw fill rect to clear out old map
      context.fillStyle = "#454545";
      context.fillRect(0, 0, canvas.width, canvas.height);
      this.drawMap();
      this.drawPlayer();
    },

    drawMap: function() {
      for(var i=0; i < this.mapDimensions.fullHeight - this.mapDimensions.yOffset; i++) {
        for(var j=0; j < this.mapDimensions.fullWidth - this.mapDimensions.xOffset; j++) {
          this.drawTile(j, i);
        }
      }
    },

    drawTile: function(x, y) {
      var sourceCoords = this.tileMapSprites[this.bgTileMap[x + this.mapDimensions.xOffset][y + this.mapDimensions.yOffset]];
      this.context.drawImage(
        this.mapSprite,
        sourceCoords.x,
        sourceCoords.y,
        this.tileWidth,
        this.tileHeight,
        (x * this.tileWidth),
        (y * (this.tileHeight/2)),
        this.tileWidth,
        this.tileHeight);
    },

    drawPlayer: function(){
      this.context.fillRect(player.x * this.tileWidth, (player.y * (this.tileHeight / 2)) + (this.tileHeight / 2), 20, 20);
    },

    move: function(keycode) {
      centerTile = {
        x: Math.floor((canvas.width/tileWidth)/2),
        y: Math.floor((canvas.height/tileHeight)/2)
      };
      movementBorder = {
        37: centerTile.x - (centerTile.x/2), // lefty loozle
        38: centerTile.y - (centerTile.y/2), // upper dups
        39: centerTile.x + (centerTile.x/2), // righty-o
        40: centerTile.y + (centerTile.y/2)  // down town
      };

      switch(keycode) {
        case 37:
          if(player.x <= 0) {
            player.x = 0;
            player.globalX = 0;
            // play bump sound or something
            console.log("oww there is a wall there");
          }
          else if(player.x < this.mapDimensions.movementAreaLeft && moMap.left) {
            this.mapDimensions.xOffset--;
            player.globalX--;
            moMap.left = this.mapDimensions.xOffset > 0;
            moMap.right = this.mapDimensions.xOffset + this.mapDimensions.visibleWidth < this.mapDimensions.fullWidth;
          }
          else {
            player.x--;
            player.globalX--;
          }
          break;
        case 38:
          if(player.y <= 0) {
            player.y = 0;
            player.globalY = 0;
            // play bump sound or something
            console.log("oww there is a wall there");
          }
          else if(player.y < this.mapDimensions.movementAreaUp && moMap.up) {
            this.mapDimensions.yOffset--;
            player.globalY--;
            moMap.up = this.mapDimensions.yOffset > 0;
            moMap.down = this.mapDimensions.yOffset + this.mapDimensions.visibleHeight < this.mapDimensions.fullHeight;
          }
          else if(player.y){
            player.y--;
            player.globalY--;
          }
          break;

        case 39:
          if(player.globalX >= this.mapDimensions.fullWidth - 1) {
            player.x = this.mapDimensions.visibleWidth - 1;
            player.globalX = this.mapDimensions.fullWidth - 1;
            console.log("oww there is a wall there");
          }
          else if(player.x > this.mapDimensions.movementAreaRight && moMap.right) {
            this.mapDimensions.xOffset++;
            player.globalX++;
            moMap.left = this.mapDimensions.xOffset > 0;
            moMap.right = this.mapDimensions.xOffset + this.mapDimensions.visibleWidth < this.mapDimensions.fullWidth;
          }
          else {
            player.x++;
            player.globalX++;
            console.log("movin playa right");
          }
          break;
        case 40:
          if(player.globalY >= this.mapDimensions.fullHeight - 1) {
            player.y = this.mapDimensions.visibleHeight - 1;
            player.globalY = this.mapDimensions.fullHeight - 1;
            console.log("wall");
          }
          else if(player.y > this.mapDimensions.movementAreaDown && moMap.down) {
            this.mapDimensions.yOffset++;
            player.globalY++;
            moMap.up = this.mapDimensions.yOffset > 0;
            moMap.down = this.mapDimensions.yOffset + this.mapDimensions.visibleHeight < this.mapDimensions.fullHeight;
          }
          else {
            player.y++;
            player.globalY++;
          }
          break;
      }
      this.redraw();
    },

    moveMap: function() {
    },

    movePlayer: function() {
    }
  };

  pample.util = {
    border: 20,
    footer: 57,

    resizeCanvas: function(e) {
      console.log("resizing");
      canvas.width = $(window).innerWidth() - (2 * this.border);
      canvas.height = $(window).innerHeight() - this.footer;
      pample.gameBoard.mapDimensions = {
        fullWidth: mapArray.length,
        fullHeight: mapArray[0].length,
        visibleWidth: Math.floor(canvas.width / tileWidth),
        visibleHeight: Math.floor(canvas.height / (tileHeight / 2)),
        movementAreaLeft: Math.floor((canvas.width / tileWidth) / 4),
        movementAreaUp: Math.ceil((canvas.height / tileHeight) / 4),
        movementAreaRight: 3 * Math.floor((canvas.width / tileWidth) / 4),
        movementAreaDown: 3 * Math.ceil((canvas.height / tileHeight) / 4),
        xOffset: pample.gameBoard.mapDimensions.xOffset,
        yOffset: pample.gameBoard.mapDimensions.yOffset
      };

      pample.gameBoard.redraw();
    },

    keydown: function(e) {
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        pample.gameBoard.move(e.keyCode);
      }
      else {
        console.log("other command used");
      }
    }
  };

  $(window).resize(pample.util.resizeCanvas);
  $(window).keydown(pample.util.keydown);
});