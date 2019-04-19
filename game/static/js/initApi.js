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
      interpreter.player.workspace.highlightBlock(id)
      setTimeout(callback, 500, 'highlighted block (' + id + ')');
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
    var wrapper = function(blockId) {
      return interpreter.createPrimitive(isPathForward(blockId));
    }

    interpreter.setProperty(scope, 'isPathForward',
      interpreter.createNativeFunction(wrapper));

    function isPathForward(blockId) {
      return interpreter.player.isPathForward();
    }
    
    // Left
    var wrapper = function(blockId) {
      return interpreter.createPrimitive(isPathLeft(blockId));
    }

    interpreter.setProperty(scope, 'isPathLeft',
      interpreter.createNativeFunction(wrapper));

    function isPathLeft(blockId) {
      return interpreter.player.isPathLeft();
    }
    // Right
     var wrapper = function(blockId) {
      return interpreter.createPrimitive(isPathRight(blockId));
    }

    interpreter.setProperty(scope, 'isPathRight',
      interpreter.createNativeFunction(wrapper));

    function isPathRight(blockId) {
      return interpreter.player.isPathRight();
    }
    
    ///////////////////////////////////////////////
    // Is not done
    var wrapper = function(blockId) {
      return interpreter.createPrimitive(notDone(blockId));
    }

    interpreter.setProperty(scope, 'notDone',
      interpreter.createNativeFunction(wrapper));

    function notDone(blockId) {
      return interpreter.player.notDone();
    }
    /*------- End initAPI-----------*/
  }
