// Lấy canvas và context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Thiết lập kích thước canvas
const CANVAS_WIDTH = canvas.width = 400;
const CANVAS_HEIGHT = canvas.height = 600;

// Đối tượng chim
const bird = {
  x: 50,
  y: CANVAS_HEIGHT / 2,
  width: 30,
  height: 30,
  gravity: 0.5,
  lift: -10,
  velocity: 0
};

// Mảng ống cống
let pipes = [];
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
let pipeSpeed = 2;
let frameCount = 0;
let score = 0;

// Vòng lặp game
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Cập nhật trạng thái game
function update() {
  // Cập nhật vị trí chim
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Kiểm tra va chạm với mép màn hình
  if (bird.y + bird.height > CANVAS_HEIGHT || bird.y < 0) {
    gameOver();
    return;
  }

  // Tạo ống cống mới
  if (frameCount % 100 === 0) {
    const pipeY = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
    pipes.push({
      x: CANVAS_WIDTH,
      y: pipeY
    });
  }
  frameCount++;

  // Di chuyển và kiểm tra ống cống
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    // Kiểm tra va chạm với ống cống
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + PIPE_WIDTH &&
      (bird.y < pipe.y || bird.y + bird.height > pipe.y + PIPE_GAP)
    ) {
      gameOver();
      return;
    }

    // Tăng điểm khi vượt qua ống cống
    if (pipe.x + PIPE_WIDTH < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }

    // Xóa ống cống ra khỏi màn hình
    if (pipe.x + PIPE_WIDTH < 0) {
      pipes.splice(index, 1);
    }
  });
}

// Vẽ các thành phần game
function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Vẽ chim
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Vẽ ống cống
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y); // Ống trên
    ctx.fillRect(pipe.x, pipe.y + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.y - PIPE_GAP); // Ống dưới
  });

  // Vẽ điểm số
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Xử lý khi game over
function gameOver() {
  alert(`Game Over! Score: ${score}`);
  document.location.reload();
}

// Điều khiển chim
document.addEventListener('keydown', e => {
  if (e.key === ' ') {
    bird.velocity = bird.lift;
  }
});

// Bắt đầu game
gameLoop();
