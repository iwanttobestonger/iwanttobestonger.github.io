console.log('应用已启动！');

const app = document.getElementById('app');
const paragraph = document.createElement('p');
paragraph.textContent = '这是一个使用 Parcel 构建的应用';
app.appendChild(paragraph);

import { SnakeGame } from './snake.js';

let game = null;
let animationId = null;

function gameLoop(timestamp) {
    if (game) {
        game.update(timestamp);
        game.draw();
        if (!game.gameOver) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
}

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    game = new SnakeGame(canvas);

    // 添加键盘控制
    document.addEventListener('keydown', (e) => {
        if (game.gameOver) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (game.direction !== 'down') game.direction = 'up';
                break;
            case 'ArrowDown':
                if (game.direction !== 'up') game.direction = 'down';
                break;
            case 'ArrowLeft':
                if (game.direction !== 'right') game.direction = 'left';
                break;
            case 'ArrowRight':
                if (game.direction !== 'left') game.direction = 'right';
                break;
        }
    });

    // 添加按钮控制
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');

    startButton.addEventListener('click', () => {
        if (!animationId) {
            gameLoop();
        }
    });

    restartButton.addEventListener('click', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        game = new SnakeGame(canvas);
        gameLoop();
    });
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 