function Character(posX, posY, direction, spriteImgUrl, downIndex, clockWise, nbHPix, nbVPix ) {
// Image préchargée, nombre de sprite horizontaux, verticaux
// position 'UP', 'DOWN', 'LEFT', 'RIGHT'
// et direction de départ

  this.pX = this.nPosX = posX ? posX : 0;
  this.pY = this.nPosY = posY ? posY : 0;
  this.direction = direction;

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
  this.nDir = this.dir;
  var pixWidth;
  var pixHeight;

  var sprite = loadImage(spriteImgUrl, successCb);

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
    if (this.pX < this.nPosX) this.pX++;
    if (this.pY < this.nPosY) this.pY++;
    if (this.pX > this.nPosX) this.pX--;
    if (this.pY > this.nPosY) this.pY--;
    
    // Draw image
    if (pixWidth && pixHeight) {
      image(sprite, this.pX, this.pY, pixWidth, pixHeight, (this.dir%nbHPix)*pixWidth, ~~(this.dir/nbHPix)*pixHeight, pixWidth, pixHeight);
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
          callback('moveForward')
        }
      }
      wait();
    }
  }
  this.moveForward = function(callback) {
    this.move(laby.TILE_SIZE, callback);
  }
  
  this.isPathForward = function() {
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
    return OK.includes(block);
  }
  
  this.isPathLeft = function() {
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
    return OK.includes(block);
  }
  
  this.isPathRight = function() {
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
    return OK.includes(block);
  }
  
  this.notDone = function() {
    xIndex = this.pX/laby.TILE_SIZE;
    yIndex = this.pY/laby.TILE_SIZE;
    var finished = laby.map[yIndex][xIndex] === 'X';
    if (finished) {
      laby.map[yIndex][xIndex] = '_';
      return false;
    }
    return true;
  }
  
  /////////////// Moved //////////////////////
} 
