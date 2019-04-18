
Laby.prototype.resize = function(width, height) {
  resizeCanvas(width*this.TILE_SIZE, height*this.TILE_SIZE);
  var newMap = [[]];
  // First line
  newMap[0].push('I');
  for (x=1; x < width-1; x++) {
    newMap[0].push('H');
  }
  newMap[0].push('I');
  
  // Following lines
  for (y=1; y < height-1; y++) {
    var t = [];
    t.push('I');
    for (x=1; x < width-1; x++) {
      t.push('_');
    }
    t.push('I');      
    newMap.push(t);      
  }
  
  //~ // last line
  t = [];
  for (x=0; x < width; x++) {
    t.push('I');
  }
  newMap.push(t);
  this.map = newMap;
  this.yBlocks = this.map.length;
  this.xBlocks = this.map[0].length;
  this.save_map();
}

Laby.prototype.save_map = function() {
  document.getElementById('id_lvl_map').value = JSON.stringify(this.map);
}

mouseClicked = function() {
  var mX = ~~(mouseX/laby.TILE_SIZE);
  var mY = ~~(mouseY/laby.TILE_SIZE);
  if ( mX < 1 || mX > laby.xBlocks-2 || mY < 1 || mY > laby.yBlocks-2 ) {
    return;
  }
  var elt = document.querySelector('input[name="element"]:checked').value;
  var above = laby.map[mY-1][mX];
  var below = laby.map[mY+1][mX];
  
  // Eventually placing block, with wall adjustment
  if (elt == 'H') {
    if (above == 'H') laby.map[mY-1][mX] = 'I';
    if (below == 'I' || below == 'H') elt = 'I';
  } else if (above == 'I') {
    laby.map[mY-1][mX] = 'H';
  }
  laby.map[mY][mX] = elt;  
  laby.save_map();
  
}
