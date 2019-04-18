DEBUG = true;
const STEP_DELAY = 50
var default_game = [
  ["I","H","H","H","H","H","H","H","H","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","_","_","_","_","_","_","_","_","I"],
  ["I","I","I","I","I","I","I","I","I","I"]]

var game_layout; // To be filled during initialization
var laby;

function Laby(parent, game_layout) {
  this.TILE_SIZE = 50;
  const OK = ['_','C','X'] // Free spots
  const COINS = ['C','X'] // Available coins

  var coinPos = 0; // initialize coin rotation index
    
  this.map = game_layout;
  this.yBlocks = this.map.length;
  this.xBlocks = this.map[0].length;
  this.canvas = createCanvas(this.xBlocks*this.TILE_SIZE, this.yBlocks*this.TILE_SIZE);
  this.canvas.parent(parent);
  
  this.draw = function() {
    // Draw coins
    coinPos = (coinPos + 1)%30 // Mod 30 and div 5 to slow down coins rotation
    coin = coinsPng.get(~~(coinPos/5)*15, 0, 15, 15);
    superCoin = superCoinsPng.get(~~(coinPos/5)*20, 0, 20, 20);
    
    //~ // Draw map
    for (y=0; y < this.yBlocks; y++) {
      for (x=0; x < this.xBlocks; x++) {
        switch (this.map[y][x]) {
          case 'H' :
            image(hWall, x*this.TILE_SIZE, y*this.TILE_SIZE);
            break;
          case 'I' :
            image(vWall, x*this.TILE_SIZE, y*this.TILE_SIZE);
            break;
          case '_' :
            image(stoneFloor, x*this.TILE_SIZE, y*this.TILE_SIZE);
            break;
          case 'C' :
            image(stoneFloor, x*this.TILE_SIZE, y*this.TILE_SIZE);
            image(coin, x*this.TILE_SIZE+17, y*this.TILE_SIZE+25)
            break;
          case 'X' :
            image(stoneFloor, x*this.TILE_SIZE, y*this.TILE_SIZE);
            image(superCoin, x*this.TILE_SIZE+15, y*this.TILE_SIZE+20)
            break;
        }
      }
    }
  }
}
