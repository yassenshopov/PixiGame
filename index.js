let app = new PIXI.Application({
  width: 1000,
  height: 600,
  backgroundColor: 0xdedede,
});
document.body.appendChild(app.view);

idle_array = [];
texture1 = PIXI.Texture.from("img/idle_01.png");
texture2 = PIXI.Texture.from("img/idle_02.png");
idle_array.push(texture1, texture2);

run_array = [];
texture1 = PIXI.Texture.from("img/run_01.png");
texture2 = PIXI.Texture.from("img/run_02.png");
texture3 = PIXI.Texture.from("img/run_03.png");
texture4 = PIXI.Texture.from("img/run_04.png");
texture5 = PIXI.Texture.from("img/run_05.png");
texture6 = PIXI.Texture.from("img/run_06.png");
texture7 = PIXI.Texture.from("img/run_07.png");
texture8 = PIXI.Texture.from("img/run_08.png");
run_array.push(texture1, texture2, texture3, texture4, texture5, texture6, texture7, texture8);

let avatar = new PIXI.AnimatedSprite(idle_array);
avatar.play();
avatar.animationSpeed = 0.05;
avatar.scale.set(3, 3);
avatar.pivot.set(0.5);
avatar.anchor.set(0.5);

let root = document.getElementById('root');
avatar.vx = 0;
avatar.vy = 0;
avatar.position.set(300, 220);
avatar.zIndex = 3;

const graphics = new PIXI.Graphics();
graphics.beginFill('0xf3f3f3');
graphics.drawRoundedRect(0, 0, 204, 360, 50);
graphics.endFill();
graphics.zIndex = 1;

app.stage.addChild(avatar, graphics);

const message = new PIXI.Text('No collision');
message.zIndex = 2
app.stage.addChild(message);

const left = keyboard('ArrowLeft'),
  up = keyboard('ArrowUp'),
  right = keyboard('ArrowRight'),
  down = keyboard('ArrowDown');

left.press = () => {
  avatar.textures = run_array
  avatar.animationSpeed = 0.2;
  avatar.play()
  avatar.vx = -5;
  avatar.vy = 0;
  avatar.scale.x = -Math.abs(avatar.scale.x);
};
left.release = () => {
  if (!right.isDown && avatar.vy === 0) {
    avatar.textures = idle_array
    avatar.animationSpeed = 0.05;
    avatar.play()
    avatar.vx = 0;
    console.log(avatar.x + ',' + avatar.y);
    if (hitTestRectangle(avatar, graphics)) {
      //There's a collision
      console.log('Collision');
      message.text = 'Collision';
      // avatar.alpha = 0.8*avatar.alpha
    } else {
      //There's no collision
      console.log('No collision');
      message.text = 'No collision';
    }
  }
};

right.press = () => {
  avatar.textures = run_array
  avatar.animationSpeed = 0.2;
  avatar.play()
  avatar.vx = 5;
  avatar.vy = 0;
  avatar.scale.x = Math.abs(avatar.scale.x);
};
right.release = () => {
  if (!left.isDown && avatar.vy === 0) {
    avatar.textures = idle_array;
    avatar.animationSpeed = 0.05;
    avatar.play()
    avatar.vx = 0;
    console.log(avatar.x + ',' + avatar.y);
    if (hitTestRectangle(avatar, graphics)) {
      //There's a collision
      console.log('Collision');
      message.text = 'Collision';
    } else {
      //There's no collision
      console.log('No collision');
      message.text = 'No collision';
    }
  }
};

up.press = () => {
  avatar.vx = 0;
  avatar.vy = -5;
};
up.release = () => {
  if (!down.isDown && avatar.vx === 0) {
    avatar.vy = 0;
    console.log(avatar.x + ',' + avatar.y);
    if (hitTestRectangle(avatar, graphics)) {
      //There's a collision
      console.log('Collision');
      message.text = 'Collision';
    } else {
      //There's no collision
      console.log('No collision');
      message.text = 'No collision';
    }
  }
};

down.press = () => {
  avatar.vx = 0;
  avatar.vy = 5;
};
down.release = () => {
  if (!up.isDown && avatar.vx === 0) {
    avatar.vy = 0;
    console.log(avatar.x + ',' + avatar.y);
    if (hitTestRectangle(avatar, graphics)) {
      //There's a collision
      console.log('Collision');
      message.text = 'Collision';
    } else {
      //There's no collision
      console.log('No collision');
      message.text = 'No collision';
    }
  }
};

app.ticker.add((delta) => gameLoop(delta));
function gameLoop(delta) {
  avatar.x += avatar.vx;
  avatar.y += avatar.vy;
}

function keyboard(value) {
  const key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}
