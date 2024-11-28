export class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.gameOver = false;
        this.score = 0;
        
        // 添加速度控制
        this.speed = 200; // 毫秒/帧，数值越大速度越慢
        this.lastUpdateTime = 0;
        
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    update(currentTime) {
        // 添加时间控制
        if (currentTime - this.lastUpdateTime < this.speed) {
            return; // 如果时间间隔不够，就不更新
        }
        this.lastUpdateTime = currentTime;

        if (this.gameOver) return;

        // 获取蛇头
        const head = {...this.snake[0]};

        // 根据方向移动蛇头
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver = true;
            return;
        }

        // 检查是否撞到自己
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        // 在蛇头位置添加新节点
        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
        } else {
            // 如果没有吃到食物，删除尾部
            this.snake.pop();
        }
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制蛇
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // 绘制食物
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // 绘制分数
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`分数: ${this.score}`, 10, 30);

        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('游戏结束!', this.canvas.width/2 - 60, this.canvas.height/2);
            this.ctx.fillText(`最终分数: ${this.score}`, this.canvas.width/2 - 70, this.canvas.height/2 + 40);
        }
    }
} 