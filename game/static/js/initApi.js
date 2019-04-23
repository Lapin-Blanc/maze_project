  function initApi(interpreter, scope) {
    //////////////////////////////////////////
    // Gestion basique des boucles infinies
    interpreter.setProperty(scope, 'trap', window.LoopTrap);
    
    ///////////////////////////////////////////////
    // Add an API function for highlighting blocks.
    var wrapper = function(id, callback) {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(highlightBlock(id, callback));
    };

    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createAsyncFunction(wrapper));

    function highlightBlock(id, callback) {
      interpreter.player.workspace.highlightBlock(id);
      setTimeout(callback, 100, 'highlighted block (' + id + ')');
    }

    ///////////////////////////////////////////////
    // Move
    var wrapper = function(blockId, callback) {
      moveForward(blockId, callback);
    }

    interpreter.setProperty(scope, 'moveForward',
      interpreter.createAsyncFunction(wrapper));

    function moveForward(blockId, callback) {
      interpreter.player.moveForward(callback);
    }
    ///////////////////////////////////////////////
    // Turning
    // Left
    var wrapper = function(blockId, callback) {
      turnLeft(blockId, callback);
    }

    interpreter.setProperty(scope, 'turnLeft',
      interpreter.createAsyncFunction(wrapper));

    function turnLeft(blockId, callback) {
      interpreter.player.turnLeft(callback);
    }
    // Right
    var wrapper = function(blockId, callback) {
      turnRight(blockId, callback);
    }

    interpreter.setProperty(scope, 'turnRight',
      interpreter.createAsyncFunction(wrapper));

    function turnRight(blockId, callback) {
      interpreter.player.turnRight(callback);
    }
    ///////////////////////////////////////////////
    // Is path
    // Forward
    var wrapper = function(blockId, callback) {
      interpreter.player.isPathForward(callback);
    }
    interpreter.setProperty(scope, 'isPathForward',
      interpreter.createAsyncFunction(wrapper));
    
    
    // Left
    var wrapper = function(blockId, callback) {
      interpreter.player.isPathLeft(callback);
    }
    interpreter.setProperty(scope, 'isPathLeft',
      interpreter.createAsyncFunction(wrapper));

    
    // Right
    var wrapper = function(blockId, callback) {
      interpreter.player.isPathRight(callback);
    }
    interpreter.setProperty(scope, 'isPathRight',
      interpreter.createAsyncFunction(wrapper));
    
    ///////////////////////////////////////////////
    // Is not done
    var wrapper = function(blockId, callback) {
      interpreter.player.notDone(callback)
    }

    interpreter.setProperty(scope, 'notDone',
      interpreter.createAsyncFunction(wrapper));

    /*------- End initAPI-----------*/
  }
