let gameInProgress = false;
let bar, ball;
let ballStartPosition, barStartPosition;
const mainColor = "#00ff00";

function getScoreEl() {
  return document.querySelector("#score");
}

function getGameStartEl() {
  return document.querySelector("#start-game");
}

function getGameOverEl() {
  return document.querySelector("#game-over");
}

function changeScore(value) {
  const el = getScoreEl();
  el.innerHTML = Number(el.innerHTML) + value || 0;
}

function resetScore() {
  const el = getScoreEl();
  el.innerHTML = 0;
}

function startGame() {
  getGameStartEl().style.display = "none";
  getGameOverEl().style.display = "none";
  bar.x = barStartPosition.x;
  bar.y = barStartPosition.y;
  ball.x = ballStartPosition.x;
  ball.y = ballStartPosition.y;
  resetScore();
  gameInProgress = true;
}

function onGameOver() {
  gameInProgress = false;
  getGameStartEl().style.display = "none";
  getGameOverEl().style.display = "flex";
}

// Create our application instance
(async () => {
  const app = new PIXI.Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "black",
  });
  document.body.appendChild(app.canvas);

  const barWidth = 150;
  const barHeight = 50;
  bar = new PIXI.Graphics()
    .rect(0, 0, barWidth, 10)
    .fill({ color: mainColor, width: barHeight });
  bar.x = app.view.width / 2 - barWidth / 2;
  bar.y = app.view.height - 100;
  barStartPosition = { x: bar.x, y: bar.y };
  app.stage.addChild(bar);

  ball = new PIXI.Graphics()
    .circle(0, 0, 15)
    .fill({ color: mainColor, width: 50 });
  ball.x = app.view.width / 2;
  ball.y = 100;
  ballStartPosition = { x: ball.x, y: ball.y };
  app.stage.addChild(ball);

  const keys = {};
  window.addEventListener("keydown", (e) => (keys[e.code] = true));
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  const ballSpeed = 10;
  const barSpeed = 10;
  let ballYDirection = "down";
  let ballXValue = Math.random() * (3 - 1) + 1;
  let ballXDirection = "right";

  app.ticker.add(function (ticker) {
    if (!gameInProgress) {
      return;
    }
    if (keys["ArrowLeft"] && bar.x > 0) {
      bar.x -= barSpeed * ticker.deltaTime;
    } else if (keys["ArrowRight"] && bar.x < app.view.width - barWidth) {
      bar.x += barSpeed * ticker.deltaTime;
    }

    if (ballYDirection === "down") {
      ball.y += ballSpeed * ticker.deltaTime;
    } else {
      ball.y -= ballSpeed * ticker.deltaTime;
    }
    if (ballXDirection === "right") {
      ball.x += ballXValue * ticker.deltaTime;
    } else {
      ball.x -= ballXValue * ticker.deltaTime;
    }
    if (ball.x >= app.view.width) {
      ballXDirection = "left";
    } else if (ball.x <= 0) {
      ballXDirection = "right";
    }

    if (ballYDirection === "up" && ball.y < 0) {
      ballYDirection = "down";
    } else if (ballYDirection === "down") {
      const ballBarDelta = ball.y - bar.y;
      if (ballBarDelta >= 0 && ballBarDelta <= ballSpeed) {
        const barXStart = bar.x;
        const barXEnd = bar.x + barWidth;
        if (ball.x >= barXStart && ball.x <= barXEnd) {
          ballYDirection = "up";
          changeScore(1);
        } else {
          onGameOver();
        }
      }
    }
  });
})();
