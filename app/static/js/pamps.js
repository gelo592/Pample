$(function() {
  var pample = pample || {};

  $.ajax({
    url: "/api/level?level=1"
  })
  .done(function(data) {
    border = 20;
    footer = 57;
    canvas = $("#game")[0];
    canvas.width = $(window).innerWidth() - (2 * border);
    canvas.height = $(window).innerHeight() - footer;

    spritesToLoad = 1;
    sprite = new Image();
    sprite.src ='static/img/allsprite.png';
    sprite.onload = spriteLoaded;

    context = canvas.getContext('2d');
    function spriteLoaded() {
      spritesToLoad--;
      if(!spritesToLoad){ run(); }
    }

    pample.gameBoard = {
      canvas: canvas,
      context: context,
      //mapSprite: mapSprite,
      //objectSprite: objectSprite,
      sprite: sprite,
      tileWidth: data.tileWidth,
      tileHeight: data.tileHeight,

      moMap: {
        left: false,
        up: false,
        right: true,
        down: true
      },

      player: data.player,

      bgTileMap: data.tileMap,

      objectArray: data.objectArray,

      objTileMap: pample.util.buildObjTileMap(data.objectArray, data.tileMap.length, data.tileMap[0].length),

      mapDimensions: {
        fullWidth: data.tileMap.length, // width of map (in # of tiles)
        fullHeight: data.tileMap[0].length, // height of map
        visibleWidth: Math.floor(canvas.width / data.tileWidth), // # of tiles drawn on screen horizontally
        visibleHeight: Math.floor(canvas.height / (data.tileHeight / 2)), // vertically
        // inner moveable area to ensure character stays more central
        // only moving to edge if no more tiles can be drawn
        movementAreaLeft: Math.floor((canvas.width / data.tileWidth) / 4),
        movementAreaUp: Math.ceil((canvas.height / data.tileHeight) / 4),
        movementAreaRight: 3 * Math.floor((canvas.width / data.tileWidth) / 4),
        movementAreaDown: 3 * Math.ceil((canvas.height / data.tileHeight) / 4),
        xOffset: 0,
        yOffset: 0
      },

      // Mappings to the location of each image in the sprite
      tileMapSprites: [
        {'x': 101, 'y': 84}, // grass
        {'x': 0, 'y': 84}, // dirt
        {'x': 51, 'y': 84}, // rocky dirt
        {'x': 152, 'y': 84}, // stone
        {'x': 202, 'y': 84}, // cobble
        {'x': 252, 'y': 84} // water
      ],

      objectMapSprites: [
        {'x': 150, 'y': 0}, // tree
        {'x': 200, 'y': 0}, // bush
        {'x': 250, 'y': 0} // rock
      ],

      peopleMapSprites: [
        {'x': 0, 'y': 0},
        {'x': 50, 'y': 0},
        {'x': 100, 'y': 0}
      ],

      redraw: function(){
        // draw fill rect to clear out old map
        context.fillStyle = "#323744";
        context.fillRect(0, 0, canvas.width, canvas.height);
        this.drawMap();
        this.drawPlayer();
      },

      // draw the map tiles, objects, and character
      drawMap: function() {
        for(var i=0; i < this.mapDimensions.fullHeight - this.mapDimensions.yOffset; i++) {
          for(var j=0; j < this.mapDimensions.fullWidth - this.mapDimensions.xOffset; j++) {
            this.drawTile(j, i);
            var objIndex = this.objTileMap[j + this.mapDimensions.xOffset][i + this.mapDimensions.yOffset];
            if(objIndex >= 0) {
              this.drawObject(this.objectArray[objIndex], j, i);
            }
          }
        }
      },

      // draw the individual tile of map
      drawTile: function(x, y) {
        var sourceImageCoords = this.tileMapSprites[this.bgTileMap[x + this.mapDimensions.xOffset][y + this.mapDimensions.yOffset]]

        this.drawSprite(
          this.sprite,
          sourceImageCoords.x,
          sourceImageCoords.y,
          this.tileWidth,
          this.tileHeight,
          x * this.tileWidth,
          y * (this.tileHeight / 2),
          this.tileWidth,
          this.tileHeight
        );
      },

      // draw npc and map objects
      drawObject: function(obj, x, y) {
        var spriteMap = obj.type === "person" ? this.peopleMapSprites : this.objectMapSprites;
        console.log(obj);
        var sourceImageCoords = spriteMap[obj.spriteMapOffset];
        this.drawSprite(
          this.sprite,
          sourceImageCoords.x,
          sourceImageCoords.y,
          this.tileWidth,
          this.tileHeight,
          x * this.tileWidth,
          y * (this.tileHeight / 2),
          this.tileWidth,
          this.tileHeight
        );
      },

      // draw sprite on canvas
      drawSprite: function(sprite, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.context.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh);
      },

      // draw character squaracter on canvas
      drawPlayer: function(){
        this.context.fillRect(this.player.x * this.tileWidth, (this.player.y * (this.tileHeight / 2)) + (this.tileHeight / 2), 20, 20);
      },

      causesCollision: function(keycode) {
        switch(keycode) {
          case 37:
            if(this.bgTileMap[this.player.globalX - 1][this.player.globalY] == 5) {
              return "map";
            }
            else if(this.objTileMap[this.player.globalX - 1][this.player.globalY] >= 0) {
              return "object";
            }
            else {
              return false;
            }
            //return (this.bgTileMap[this.player.globalX - 1][this.player.globalY] == 5 || this.objTileMap[this.player.globalX - 1][this.player.globalY] >= 0);
            break;
          case 38:
            if(this.bgTileMap[this.player.globalX][this.player.globalY - 1] == 5) {
              return "map";
            }
            else if(this.objTileMap[this.player.globalX][this.player.globalY - 1] >= 0) {
              return "object";
            }
            else {
              return false;
            }
            //return (this.bgTileMap[this.player.globalX][this.player.globalY - 1] == 5 || this.objTileMap[this.player.globalX][this.player.globalY - 1] >= 0);
            break;
          case 39:
            if(this.bgTileMap[this.player.globalX + 1][this.player.globalY] == 5) {
              return "map";
            }
            else if(this.objTileMap[this.player.globalX + 1][this.player.globalY] >= 0) {
              return "object";
            }
            else {
              return false;
            }
            //return (this.bgTileMap[this.player.globalX + 1][this.player.globalY] == 5 || this.objTileMap[this.player.globalX + 1][this.player.globalY] >= 0);
            break;
          case 40:
                      if(this.bgTileMap[this.player.globalX][this.player.globalY + 1] == 5) {
              return "map";
            }
            else if(this.objTileMap[this.player.globalX][this.player.globalY + 1] >= 0) {
              return "object";
            }
            else {
              return false;
            }
            //return (this.bgTileMap[this.player.globalX][this.player.globalY + 1] == 5 || this.objTileMap[this.player.globalX][this.player.globalY + 1] >= 0);
            break;
        }
      },

      move: function(keycode) {
        $('.speech-bubble').remove();
        centerTile = {
          x: Math.floor((canvas.width/this.tileWidth)/2),
          y: Math.floor((canvas.height/this.tileHeight)/2)
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
            if(this.player.x <= 0) { // player at horizontal edge of map
              this.player.x = 0;
              this.player.globalX = 0;
              // play bump sound or something
              console.log("oww there is a wall there");
            }
            else if(this.causesCollision(keycode)){ // player colliding with mapObject
              collision = true;
              collisionX = this.player.globalX - 1;
              collisionY = this.player.globalY;
              indeX = this.player.x - 1;
              indeY = this.player.y;
            }
            else {
              if(this.player.x < this.mapDimensions.movementAreaLeft && this.moMap.left) { //
                this.mapDimensions.xOffset--;
                this.player.globalX--;
                this.moMap.left = this.mapDimensions.xOffset > 0;
                this.moMap.right = this.mapDimensions.xOffset + this.mapDimensions.visibleWidth < this.mapDimensions.fullWidth;
              }
              else {
                this.player.x--;
                this.player.globalX--;
              }
            }
            break;
          case 38:
            if(this.player.y <= 0) {
              this.player.y = 0;
              this.player.globalY = 0;
              // play bump sound or something
              console.log("oww there is a wall there");
            }
            else if(this.causesCollision(keycode)){
              collision = true;
              collisionX = this.player.globalX;
              collisionY = this.player.globalY - 1;
              indeX = this.player.x;
              indeY = this.player.y - 1;
            }
            else {
              if(this.player.y < this.mapDimensions.movementAreaUp && this.moMap.up) {
                this.mapDimensions.yOffset--;
                this.player.globalY--;
                this.moMap.up = this.mapDimensions.yOffset > 0;
                this.moMap.down = this.mapDimensions.yOffset + this.mapDimensions.visibleHeight < this.mapDimensions.fullHeight;
              }
              else if(this.player.y){
                this.player.y--;
                this.player.globalY--;
              }
            }
            break;

          case 39:
            if(this.player.globalX >= this.mapDimensions.fullWidth - 1) {
              this.player.x = this.mapDimensions.visibleWidth - 1;
              this.player.globalX = this.mapDimensions.fullWidth - 1;
              console.log("oww there is a wall there");
            }
            else if(this.causesCollision(keycode)){
              collision = true;
              collisionX = this.player.globalX + 1;
              collisionY = this.player.globalY;
              indeX = this.player.x + 1;
              indeY = this.player.y;
            }
            else {
              if(this.player.x > this.mapDimensions.movementAreaRight && this.moMap.right) {
                this.mapDimensions.xOffset++;
                this.player.globalX++;
                this.moMap.left = this.mapDimensions.xOffset > 0;
                this.moMap.right = this.mapDimensions.xOffset + this.mapDimensions.visibleWidth < this.mapDimensions.fullWidth;
              }
              else {
                this.player.x++;
                this.player.globalX++;
              }
            }
            break;
          case 40:
            if(this.player.globalY >= this.mapDimensions.fullHeight - 1) {
              this.player.y = this.mapDimensions.visibleHeight - 1;
              this.player.globalY = this.mapDimensions.fullHeight - 1;
              console.log("wall");
            }
            else if(this.causesCollision(keycode)){
              collision = true;
              collisionX = this.player.globalX;
              collisionY = this.player.globalY + 1;
              indeX = this.player.x;
              indeY = this.player.y + 1;
            }
            else {
              if(this.player.y > this.mapDimensions.movementAreaDown && this.moMap.down) {
                this.mapDimensions.yOffset++;
                this.player.globalY++;
                this.moMap.up = this.mapDimensions.yOffset > 0;
                this.moMap.down = this.mapDimensions.yOffset + this.mapDimensions.visibleHeight < this.mapDimensions.fullHeight;
              }
              else {
                this.player.y++;
                this.player.globalY++;
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
        $('.content').append(bubble);
        $('.speech-bubble').css('top', (indeY * (this.tileHeight / 2) + 7)+ 'px');
        $('.speech-bubble').css('left', (indeX * this.tileWidth + this.tileWidth + 10) + 'px');
      },

      moveMap: function() {
      },

      movePlayer: function() {
      }
    };

    function run() {
      pample.gameBoard.redraw();
    }
  });

  pample.util = {
    border: 20,
    footer: 57,

    resizeCanvas: function(e) {
      canvas.width = $(window).innerWidth() - (2 * this.border);
      canvas.height = $(window).innerHeight() - this.footer;
      pample.gameBoard.mapDimensions = {
        fullWidth: pample.gameBoard.mapDimensions.fullWidth,
        fullHeight: pample.gameBoard.mapDimensions.fullHeight,
        visibleWidth: Math.floor(canvas.width / pample.gameBoard.tileWidth),
        visibleHeight: Math.floor(canvas.height / (pample.gameBoard.tileHeight / 2)),
        movementAreaLeft: Math.floor((canvas.width / pample.gameBoard.tileWidth) / 4),
        movementAreaUp: Math.ceil((canvas.height / pample.gameBoard.tileHeight) / 4),
        movementAreaRight: 3 * Math.floor((canvas.width / pample.gameBoard.tileWidth) / 4),
        movementAreaDown: 3 * Math.ceil((canvas.height / pample.gameBoard.tileHeight) / 4),
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
        //console.log("other command used");
      }
    },

    textCommand: function(e) {
      var commandKeyMap = {
        "move left": 37,
        "left": 37,
        "move up": 38,
        "up": 38,
        "move right": 39,
        "right": 39,
        "move down":  40,
        "down":  40
      };
      console.log(e.keyCode);
      if(e.keyCode == 13) {
        var command = $("#main-input").val().toLowerCase();

        if(commandKeyMap[command]) pample.gameBoard.move(commandKeyMap[command]);
      }
    },

    buildObjTileMap: function(objArr, mapWidth, mapHeight) {
      var objTileMap = [];

      // fill the obj map with neggies
      for(var i=0; i < mapWidth; i++) {
        objTileMap[i] = [];
        for(var j=0; j < mapHeight; j++) {
          objTileMap[i][j] = -1;
        }
      }

      // fill object (x,y) spots with index in obj array
      for(var k=0; k < objArr.length; k++) {
        var x = objArr[k].mapX;
        var y = objArr[k].mapY;
        objTileMap[x][y] = k;
      }
      return objTileMap;
    }
  };

  $(window).resize(pample.util.resizeCanvas);
  $(window).keydown(pample.util.keydown);
  $("#main-input").keypress(pample.util.textCommand);
});