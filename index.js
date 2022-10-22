let app = new PIXI.Application({ width: 1000, height: 600 , backgroundColor: 0xdedede});
document.body.appendChild(app.view);

const avatar = new PIXI.Sprite.from("bunny.png")
// avatar.skew(2);
avatar.scale.set(2);
avatar.pivot.set(0.5);
avatar.anchor.set(0.5);

let root = document.getElementById("root"); 
console.log(avatar)
avatar.vx = 0;
avatar.vy = 0;
avatar.position.set(200, 220)

const graphics = new PIXI.Graphics();
graphics.beginFill("0xf3f3f3")
graphics.drawRoundedRect(0, 0, 204, 360, 10);
graphics.endFill();

app.stage.addChild(avatar, graphics);

const message = new PIXI.Text("No collision");
app.stage.addChild(message);

const left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

left.press = () => {
    avatar.vx = -5;
    avatar.vy = 0;
}
left.release = () => {
    if (!right.isDown && avatar.vy === 0) {
      avatar.vx = 0;
      console.log(avatar.x + "," + avatar.y)
      if (hitTestRectangle(avatar, graphics)) {
        //There's a collision
        console.log("Collision");
        message.text = "Collision"
      } else {
        //There's no collision
        console.log("No collision");
        message.text = "No collision"
      }
    }
};

right.press = () => {
    avatar.vx = 5;
    avatar.vy = 0;
}
right.release = () => {
    if (!left.isDown && avatar.vy === 0) {
      avatar.vx = 0;
      console.log(avatar.x + "," + avatar.y)
      if (hitTestRectangle(avatar, graphics)) {
        //There's a collision
        console.log("Collision");
        message.text = "Collision"
      } else {
        //There's no collision
        console.log("No collision");
        message.text = "No collision"
      }
    }
};

up.press = () => {
    avatar.vx = 0;
    avatar.vy = -5;
}
up.release = () => {
    if (!down.isDown && avatar.vx === 0) {
      avatar.vy = 0;
      console.log(avatar.x + "," + avatar.y)
      if (hitTestRectangle(avatar, graphics)) {
        //There's a collision
        console.log("Collision");
        message.text = "Collision"
      } else {
        //There's no collision
        console.log("No collision");
        message.text = "No collision"
      }
    }
};

down.press = () => {
    avatar.vx = 0;
    avatar.vy = 5;
}
down.release = () => {
    if (!up.isDown && avatar.vx === 0) {
      avatar.vy = 0;
      console.log(avatar.x + "," + avatar.y)
      if (hitTestRectangle(avatar, graphics)) {
        //There's a collision
        console.log("Collision");
        message.text = "Collision"
      } else {
        //There's no collision
        console.log("No collision");
        message.text = "No collision"
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
    
    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
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
};