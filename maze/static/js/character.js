function Character(posX, posY, direction, spriteImgUrl, downIndex, clockWise, nbHPix, nbVPix, iconUrl ) {
// Image préchargée, nombre de sprite horizontaux, verticaux
// position 'UP', 'DOWN', 'LEFT', 'RIGHT'
// et direction de départ

  this.pX = this.nPosX = posX ? posX : 0;
  this.pY = this.nPosY = posY ? posY : 0;
  this.direction = direction;
  
  this.origPX = this.pX;
  this.origPY = this.pY;
  
  

  var downIndex = downIndex ? downIndex : 0;
  var nbHPix = nbHPix ? nbHPix : 8;
  var nbVPix = nbVPix ? nbVPix : 5;
  var nbPix = nbHPix * nbVPix; // 40
  var downIndex = downIndex ? downIndex : 0;
  
  var x = downIndex+nbPix;
  var clockDir = (clockWise) ? -1:1 ;
  this.DOWN =  x % nbPix ; x = x + clockDir*nbPix/4;
  this.RIGHT = x % nbPix ; x = x + clockDir*nbPix/4;
  this.UP =    x % nbPix ; x = x + clockDir*nbPix/4;
  this.LEFT =  x % nbPix ; x = x + clockDir*nbPix/4;
  
  const OK = ['_', 'C', 'X'];
  
  switch (direction) {
    case 'down' :
      this.dir = this.DOWN;
      break;
    case 'right' :
      this.dir = this.RIGHT;
      break;
    case 'up' :
      this.dir = this.UP;
      break;
    case 'left' :
      this.dir = this.LEFT;
      break;
    default :
      this.dir = this.DOWN;    
  }
  this.origDir = this.nDir = this.dir;
  
  var pixWidth;
  var pixHeight;

  this.sprite = loadImage(spriteImgUrl, successCb);
  this.icon = iconUrl;
  
  this.winner = false;

  function successCb(img) {
    pixWidth = ~~(img.width/nbHPix);
    pixHeight = ~~(img.height/nbVPix);
  }

  var turningTo;

  this.draw = function() {
    // Have to turn
    if (this.dir != this.nDir) {
      if ( ((turningTo=='left') && (clockDir==1)) || ((turningTo=='right') && (clockDir==-1)) ) {
          this.dir++;
          if (this.dir==nbPix) this.dir = 0;
      } else {
          if (this.dir==0) this.dir = nbPix;
          this.dir--;
      }
    }
    // Have to move
    var hasMoved = false;
    if (this.pX < this.nPosX) {this.pX++;hasMoved=true};
    if (this.pY < this.nPosY) {this.pY++;hasMoved=true};
    if (this.pX > this.nPosX) {this.pX--;hasMoved=true};
    if (this.pY > this.nPosY) {this.pY--;hasMoved=true};
    if (hasMoved) {
      if ((this.pX == this.nPosX) && (this.pY == this.nPosY)) {
        xIndex = this.pX/laby.TILE_SIZE;
        yIndex = this.pY/laby.TILE_SIZE;
        if (laby.map[yIndex][xIndex] === 'X') {
          laby.map[yIndex][xIndex] = '_';
          superCoinSound.play();
          this.winner = true;
        }
      }
    }
    // Draw image
    if (pixWidth && pixHeight) {
      image(this.sprite, this.pX-(pixWidth-50), this.pY-(pixHeight-50), pixWidth, pixHeight, (this.dir%nbHPix)*pixWidth, ~~(this.dir/nbHPix)*pixHeight, pixWidth, pixHeight);
    }
  }
  
  /////////////// want to turn left //////////////////////
  this.turnLeft = function(callback) {
    turningTo = 'left';
    switch (this.dir) {
      case this.DOWN : {
        this.nDir = this.RIGHT;
        this.direction = 'right';
        }
        break;
      case this.RIGHT : {
        this.nDir = this.UP;
        this.direction = 'up';
        }
        break;
      case this.UP : {
        this.nDir = this.LEFT;
        this.direction = 'left';
        }
        break;
      case this.LEFT : {
        this.nDir = this.DOWN;
        this.direction = 'down';
        }
        break;
    }
    if (callback) {
      var that = this;
      var wait = function () {
        if (that.dir != that.nDir) {
          setTimeout(wait, 5)
        }
        else {
          callback('turnLeft')
        }
      }
      wait(callback);
    }
  }
  /////////////// want to turn right //////////////////////
  this.turnRight = function(callback) {
    turningTo = 'right';
    switch (this.dir) {
      case this.DOWN : {
        this.nDir = this.LEFT;
        this.direction = 'left';
        }
        break;
      case this.LEFT : {
        this.nDir = this.UP;
        this.direction = 'up';
        }
        break;
      case this.UP : {
        this.nDir = this.RIGHT;
        this.direction = 'right';
        }
        break;
      case this.RIGHT : {
        this.nDir = this.DOWN;
        this.direction = 'down';
        }
        break;
    }
    if (callback) {
      var that = this;
      var wait = function () {
        if (that.dir != that.nDir) {
          setTimeout(wait, 5)
        }
        else {
          callback('turnRight')
        }
      }
      wait(callback);
    }
  }
  ////////////// Turned right //////////////////////
  
  /////////////// Movement asked /////////////
  this.move = function(distance, callback) {
    if (this.isPathForward()) {
      switch (this.dir) {
        case this.DOWN :
          this.nPosY += distance;
          break;
        case this.RIGHT :
          this.nPosX += distance;
          break;
        case this.UP :
          this.nPosY -= distance;
          break;
        case this.LEFT :
          this.nPosX -= distance;
          break;
      }
    }
    if (callback) {
      var that = this;
      var wait = function () {
        if ((that.pX != that.nPosX) || (that.pY != that.nPosY)) {
          setTimeout(wait, 5)
        }
        else {
          callback('moveForward');
        }
      }
      wait();
    }
  }
  this.moveForward = function(callback) {
    this.move(laby.TILE_SIZE, callback);
  }
  
  this.isPathForward = function(callback) {
    xIndex = this.pX/laby.TILE_SIZE;
    yIndex = this.pY/laby.TILE_SIZE;
    switch (this.dir) {
      case this.DOWN :
        block = laby.map[yIndex+1][xIndex];
        break;
      case this.RIGHT :
        block = laby.map[yIndex][xIndex+1];
        break;
      case this.UP :
        block = laby.map[yIndex-1][xIndex];
        break;
      case this.LEFT :
        block = laby.map[yIndex][xIndex-1];
        break;
    }    
    if (callback) {
      callback(OK.includes(block));
    } else {
      return OK.includes(block);
    }
  }
  
  this.isPathLeft = function(callback) {
    xIndex = this.pX/laby.TILE_SIZE;
    yIndex = this.pY/laby.TILE_SIZE;
    switch (this.dir) {
      case this.DOWN :
        block = laby.map[yIndex][xIndex+1];
        break;
      case this.RIGHT :
        block = laby.map[yIndex-1][xIndex];
        break;
      case this.UP :
        block = laby.map[yIndex][xIndex-1];
        break;
      case this.LEFT :
        block = laby.map[yIndex+1][xIndex];
        break;
    }    
    callback(OK.includes(block));
  }
  
  this.isPathRight = function(callback) {
    xIndex = this.pX/laby.TILE_SIZE;
    yIndex = this.pY/laby.TILE_SIZE;
    switch (this.dir) {
      case this.DOWN :
        block = laby.map[yIndex][xIndex-1];
        break;
      case this.RIGHT :
        block = laby.map[yIndex+1][xIndex];
        break;
      case this.UP :
        block = laby.map[yIndex][xIndex+1];
        break;
      case this.LEFT :
        block = laby.map[yIndex-1][xIndex];
        break;
    }    
    callback(OK.includes(block));
  }
  
  this.notDone = function(callback) {
    //~ xIndex = this.pX/laby.TILE_SIZE;
    //~ yIndex = this.pY/laby.TILE_SIZE;
    //~ return !laby.map[yIndex][xIndex] === 'X';
    callback(!this.winner);
    //~ return !this.winner;
  }
  
  /////////////// Moved //////////////////////
} 
