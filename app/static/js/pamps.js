$(function() {
  border = 20;
  footer = 57;
  canvas = $("#game")[0];
  canvas.width = $(window).innerWidth() - (2 * border);
  canvas.height = $(window).innerHeight() - footer;

  spritesToLoad = 2;
  mapSprite = new Image();
  mapSprite.src ='static/img/mapsprite.png';
  mapSprite.onload = spriteLoaded;

  objectSprite = new Image();
  objectSprite.src = 'static/img/objectsprite.png';
  objectSprite.onload = spriteLoaded;

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

  objectArray = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0],
    [0,1,1,2,3,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];


  context = canvas.getContext('2d');
  function spriteLoaded() {
    spritesToLoad--;
    if(!spritesToLoad){ run(); }
  }

  function run() {
    pample.gameBoard.redraw();
  }

  var pample = pample || {};

  pample.gameBoard = {
    canvas: canvas,
    context: context,
    mapSprite: mapSprite,
    objectSprite: objectSprite,

    bgTileMap: mapArray,

    objTileMap: objectArray,

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

    objectMapSprites: [
      {'x': 0, 'y': 0},
      {'x': 50, 'y': 0},
      {'x': 100, 'y': 0}
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
          this.drawObject(j,i);
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

    drawObject: function(x, y) {
      var objectIndex = this.objTileMap[x + this.mapDimensions.xOffset][y + this.mapDimensions.yOffset] - 1;
      if(objectIndex >= 0) {
        var sourceCoords = this.objectMapSprites[objectIndex];
        this.context.drawImage(
          this.objectSprite,
          sourceCoords.x,
          sourceCoords.y,
          this.tileWidth,
          this.tileHeight,
          (x * this.tileWidth),
          (y * (this.tileHeight/2)),
          this.tileWidth,
          this.tileHeight);
      }
    },

    drawPlayer: function(){
      this.context.fillRect(player.x * this.tileWidth, (player.y * (this.tileHeight / 2)) + (this.tileHeight / 2), 20, 20);
    },

    causesCollision: function(keycode) {
      switch(keycode) {
        case 37:
          return (this.bgTileMap[player.globalX - 1][player.globalY] == 5 || this.objTileMap[player.globalX - 1][player.globalY] > 0);
          break;
        case 38:
          return (this.bgTileMap[player.globalX][player.globalY - 1] == 5 || this.objTileMap[player.globalX][player.globalY - 1] > 0);
          break;
        case 39:
          return (this.bgTileMap[player.globalX + 1][player.globalY] == 5 || this.objTileMap[player.globalX + 1][player.globalY] > 0);
          break;
        case 40:
          return (this.bgTileMap[player.globalX][player.globalY + 1] == 5 || this.objTileMap[player.globalX][player.globalY + 1] > 0);
          break;
      }
    },

    move: function(keycode) {
      $('.speech-bubble').remove();
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
      var collision = false;

      switch(keycode) {
        case 37:
          if(player.x <= 0) {
            player.x = 0;
            player.globalX = 0;
            // play bump sound or something
            console.log("oww there is a wall there");
          }
          else if(this.causesCollision(keycode)){
            collision = true;
            collisionX = player.globalX - 1;
            collisionY = player.globalY;
            indeX = player.x - 1;
            indeY = player.y;
          }
          else {
            if(player.x < this.mapDimensions.movementAreaLeft && moMap.left) {
              this.mapDimensions.xOffset--;
              player.globalX--;
              moMap.left = this.mapDimensions.xOffset > 0;
              moMap.right = this.mapDimensions.xOffset + this.mapDimensions.visibleWidth < this.mapDimensions.fullWidth;
            }
            else {
              player.x--;
              player.globalX--;
            }
          }
          break;
        case 38:
          if(player.y <= 0) {
            player.y = 0;
            player.globalY = 0;
            // play bump sound or something
            console.log("oww there is a wall there");
          }
          else if(this.causesCollision(keycode)){
            collision = true;
            collisionX = player.globalX;
            collisionY = player.globalY - 1;
            indeX = player.x;
            indeY = player.y - 1;
          }
          else {
            if(player.y < this.mapDimensions.movementAreaUp && moMap.up) {
              this.mapDimensions.yOffset--;
              player.globalY--;
              moMap.up = this.mapDimensions.yOffset > 0;
              moMap.down = this.mapDimensions.yOffset + this.mapDimensions.visibleHeight < this.mapDimensions.fullHeight;
            }
            else if(player.y){
              player.y--;
              player.globalY--;
            }
          }
          break;

        case 39:
          if(player.globalX >= this.mapDimensions.fullWidth - 1) {
            player.x = this.mapDimensions.visibleWidth - 1;
            player.globalX = this.mapDimensions.fullWidth - 1;
            console.log("oww there is a wall there");
          }
          else if(this.causesCollision(keycode)){
            collision = true;
            collisionX = player.globalX + 1;
            collisionY = player.globalY;
            indeX = player.x + 1;
            indeY = player.y;
          }
          else {
            if(player.x > this.mapDimensions.movementAreaRight && moMap.right) {
              this.mapDimensions.xOffset++;
              player.globalX++;
              moMap.left = this.mapDimensions.xOffset > 0;
              moMap.right = this.mapDimensions.xOffset + this.mapDimensions.visibleWidth < this.mapDimensions.fullWidth;
            }
            else {
              player.x++;
              player.globalX++;
            }
          }
          break;
        case 40:
          if(player.globalY >= this.mapDimensions.fullHeight - 1) {
            player.y = this.mapDimensions.visibleHeight - 1;
            player.globalY = this.mapDimensions.fullHeight - 1;
            console.log("wall");
          }
          else if(this.causesCollision(keycode)){
            collision = true;
            collisionX = player.globalX;
            collisionY = player.globalY + 1;
            indeX = player.x;
            indeY = player.y + 1;
          }
          else {
            if(player.y > this.mapDimensions.movementAreaDown && moMap.down) {
              this.mapDimensions.yOffset++;
              player.globalY++;
              moMap.up = this.mapDimensions.yOffset > 0;
              moMap.down = this.mapDimensions.yOffset + this.mapDimensions.visibleHeight < this.mapDimensions.fullHeight;
            }
            else {
              player.y++;
              player.globalY++;
            }
          }
          break;
      }
      this.redraw();
      if(collision) {
        this.collisionHandling(indeX, indeY, collisionX, collisionY);
      }
    },

    collisionHandling: function(indeX, indeY, x, y) {
      $('.speech-bubble').remove();
      var bubble = document.createElement("div");

      switch(this.objTileMap[x][y]){
        case 1:
          bubble.innerHTML = "ya like climbing trees?";
          //this.context.fillStyle = 'black';
          //this.context.fillText("ya like climbing trees?", indeX * tileWidth, indeY * (tileHeight / 2));
          break;
        case 2:
          bubble.innerHTML = "im a bush im a bush im a BUSH!";
          //this.context.fillStyle = 'black';
          //this.context.fillText("im a bush im a bush im a BUSH!", indeX * tileWidth, indeY * (tileHeight / 2));
          break;
        case 3:
          bubble.innerHTML = "excuse me, rock here.";
          //this.context.fillStyle = 'black';
          //this.context.fillText("excuse me, rock here.", indeX * tileWidth, indeY * (tileHeight / 2));
          break;
      }
      bubble.setAttribute("class", "speech-bubble");
      $('#content').append(bubble);
      $('.speech-bubble').css('top', (indeY * (tileHeight / 2) + 7)+ 'px');
      $('.speech-bubble').css('left', (indeX * tileWidth + tileWidth + 10) + 'px');
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