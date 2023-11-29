(() => {
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BOX_SIZE = 100;
  const BOX_HALF_SIZE = BOX_SIZE/2;
  const LENGTH = 300.0;
  let gfx = null;
  let canvas = null;
  let startTime = null;
  let totalTime = 0.0;
  let c = LENGTH;
  let p = 0.0;
  
  window.addEventListener('load', () => {
    canvas = document.body.querySelector('#main');
    gfx = new Graphics(canvas);
    initialize();
    render();
  }, false);

  function initialize() {
    startTime = Date.now();
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  function render() {
    let w = canvas.width;
    let h = canvas.height;
    let cx = w/2;
    let cy = h/2;
    gfx.drawRect(0, 0, canvas.width, canvas.height, '#eee');
    gfx.drawLine(0, cy, w, cy, '#ccc');
    gfx.drawLine(cx, 0, cx, h, '#ccc');

    let nowTime = (Date.now() - startTime) / 1000;
    let deltaTime = nowTime - totalTime;
    // c = Math.cos(nowTime) * LENGTH;
    c += -p * deltaTime;
    p +=  c * deltaTime;
    let x = Math.sin(nowTime) * LENGTH;
    gfx.drawRect(cx+p-BOX_HALF_SIZE, cy-BOX_HALF_SIZE, BOX_SIZE, BOX_SIZE, '#900');
    gfx.drawRect(cx+x-BOX_HALF_SIZE, cy+BOX_SIZE, BOX_SIZE, BOX_SIZE, '#090');
    gfx.drawText('x: ' + x.toString(), 0, 10, '#000');
    gfx.drawText('p: ' + x.toString(), 0, 20, '#000');

    // totalTime += deltaTime;
    totalTime = nowTime;

    requestAnimationFrame(render);
  }
})();
