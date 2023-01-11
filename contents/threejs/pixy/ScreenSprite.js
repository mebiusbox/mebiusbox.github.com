PixScreenSprite = function(material, canvas = null) {
  
  var sw = window.innerWidth;
  var sh = window.innerHeight;
  if (canvas) {
    sw = canvas.width;
    sh = canvas.height;
  }
  
  var scope = this;
  var frame = {
    x: 10, y: 10, width: sw, height: sh
  };
  
  var camera = new THREE.OrthographicCamera(-sw/2, sw/2, sh/2, -sh/2, 1, 10);
  camera.position.set(0,0,2);
  var scene = new THREE.Scene();
  var plane = new THREE.PlaneBufferGeometry(frame.width, frame.height);
  var mesh = new THREE.Mesh(plane, material);
  scene.add(mesh);
  
  function resetPosition() {
    scope.position.set(scope.position.x, scope.position.y);
  }
  
  // API
  
  // Set to false to disable displaying this sprite
  this.enabled = true;
  
  // Set the size of the displayed sprite on the HUD
  this.size = {
    width: frame.width,
    height: frame.height,
    set: function(width, height) {
      this.width = width;
      this.height = height;
      mesh.scale.set(this.width / frame.width, this.height / frame.height, 1);
      
      // Reset the position as it is off when we scale stuff
      resetPosition();
    }
  };
  
  // Set the position of the displayed sprite on the HUD
  this.position = {
    x: frame.x,
    y: frame.y,
    set: function(x,y) {
      this.x = x;
      this.y = y;
      var width = scope.size.width;
      var height = scope.size.height;
      mesh.position.set(-sw/2 + width / 2 + this.x, sh/2 - height/2 - this.y, 0);
    }
  };
  
  this.render = function(renderer) {
    if (this.enabled) {
      // console.log(camera);
      renderer.render(scene, camera);
    }
  };
  
  this.updateForWindowResize = function() {
    if (this.enabled) {
      sw = window.innerWidth;
      sh = window.innerHeight;
      camera.left = -window.innerWidth / 2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = -window.innerHeight / 2;
    }
  };
  
  this.updateForCanvasResize = function(canvas) {
    if (this.enabled) {
      sw = canvas.width;
      sh = canvas.height;
      camera.left = -canvas.width / 2;
      camera.right = canvas.width / 2;
      camera.top = canvas.height / 2;
      camera.bottom = -canvas.height / 2;
    }
  };
  
  this.update = function() {
    this.position.set(this.position.x, this.position.y);
    this.size.set(this.size.width, this.size.height);
  }
  
  // Force an update to set position/size
  this.update();
};

PixScreenSprite.prototype.constructor = PixScreenSprite;