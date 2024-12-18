class Player {
    constructor(id, nickname) {
        this.id = id;
        this.nickname = nickname;
        this.gameHistory = [];
    }

    addHistory(record) {
        this.gameHistory.push({
            ...record,
            timestamp: new Date().toISOString()
        });
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem('player', JSON.stringify(this));
    }

    static loadFromStorage() {
        const data = localStorage.getItem('player');
        if (!data) return null;
        const playerData = JSON.parse(data);
        const player = new Player(playerData.id, playerData.nickname);
        player.gameHistory = playerData.gameHistory;
        return player;
    }
}

class AudioController {
    constructor() {
        this.bgMusic = new Audio('audio/flower_dance.mp3');
        this.bgMusic.loop = true;
        this.effectSound = new Audio('audio/effect.mp3');
        
        this.bgMusic.volume = 0.3;
        this.effectSound.volume = 0.5;
    }

    playBackground() {
        this.bgMusic.play();
    }

    stopBackground() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    playEffect() {
        this.effectSound.play();
    }
}

class Treasure {
    static async loadGameData() {
        try {
            const [templeData, libraryData] = await Promise.all([
                fetch('data/temple.txt').then(res => res.text()),
                fetch('data/library.txt').then(res => res.text())
            ]);
            return { templeData, libraryData };
        } catch (error) {
            console.error('加载游戏数据失败:', error);
            throw error;
        }
    }

    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve("解码成功!宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }

    static searchTemple(location) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("找到了一个神秘的箱子...");
            }, 2000);
        });
    }

    static openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("恭喜!你找到了传说中的宝藏!");
            }, 1000);
        });
    }
}

let currentPlayer = null;
const audioController = new AudioController();

async function decodeScript() {
    if (!currentPlayer) {
        const nickname = prompt('请输入你的昵称:');
        if (!nickname) {
            updateResult('请输入昵称以开始游戏');
            return;
        }
        
        currentPlayer = new Player(Date.now().toString(), nickname);
        currentPlayer.saveToStorage();
    }

    try {
        const { libraryData } = await Treasure.loadGameData();
        document.getElementById('result').innerHTML = `
            <div class="game-info">
                <h3>欢迎, ${currentPlayer.nickname}!</h3>
                <div class="scroll-text">${libraryData}</div>
            </div>
        `;
        
        audioController.playBackground();
        document.getElementById('decodeButton').classList.add('hidden');
        document.getElementById('riddleSection').classList.remove('hidden');
        
        currentPlayer.addHistory({
            action: '开始解谜',
            result: '成功'
        });
    } catch (error) {
        console.error('加载游戏数据失败:', error);
        updateResult('加载游戏数据失败,请刷新重试');
    }
}

async function submitRiddle() {
    const answer = document.getElementById('riddleAnswer').value.trim();
    if (answer === '月') {
        try {
            const clueResult = await Treasure.decodeAncientScript('some clue');
            updateResult(clueResult);
            document.body.style.backgroundImage = "url('images/2.jpg')";
            document.getElementById('riddleSection').classList.add('hidden');
            document.getElementById('searchButton').classList.remove('hidden');
        } catch (error) {
            updateResult(error);
        }
    } else {
        updateResult("答案错误，请再试一次。");
    }
}

async function searchTemple() {
    try {
        const { templeData } = await Treasure.loadGameData();
        document.getElementById('result').innerHTML = `
            <div class="game-info">
                <div class="scroll-text">${templeData}</div>
            </div>
        `;
        
        audioController.playEffect();
        document.body.style.backgroundImage = "url('images/3.jpg')";
        document.getElementById('searchButton').classList.add('hidden');
        document.getElementById('grid').classList.remove('hidden');
        
        currentPlayer.addHistory({
            action: '进入神庙',
            result: '成功'
        });
        
        initializeGrid();
    } catch (error) {
        updateResult(error);
    }
}

async function openTreasureBox() {
    try {
        const treasureResult = await Treasure.openTreasureBox();
        updateResult(treasureResult);
        document.body.style.backgroundImage = "url('images/3.jpg')";
        document.getElementById('openBoxButton').classList.add('hidden');
    } catch (error) {
        updateResult(error);
    }
}

function updateResult(message) {
    const resultElement = document.getElementById('result');
    resultElement.classList.add('fade');
    setTimeout(() => {
        resultElement.innerText = message;
        resultElement.classList.remove('fade');
    }, 1000);
}

function initializeGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    // 创建6x6方格
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            grid.appendChild(cell);
        }
    }

    // 预定义一条路径，确保角色能成功找到宝藏
    const path = [
        [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [5, 3], [5, 4], [5, 5]
    ];

    // 放置8个神庙守卫，确保不在预定义路径上
    const guards = new Set();
    while (guards.size < 8) {
        const row = Math.floor(Math.random() * 6);
        const col = Math.floor(Math.random() * 6);
        if (!path.some(position => position[0] === row && position[1] === col)) {
            guards.add(`${row},${col}`);
        }
    }
    guards.forEach(position => {
        const [row, col] = position.split(',').map(Number);
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.classList.add('guard');
    });

    // 放置玩家和宝箱
    const playerCell = document.querySelector(`.cell[data-row='0'][data-col='0']`);
    playerCell.classList.add('player');
    playerCell.innerHTML = '<img src="images/4.jpg" alt="Player">';

    const treasureCell = document.querySelector(`.cell[data-row='5'][data-col='5']`);
    treasureCell.classList.add('treasure');
    treasureCell.innerHTML = '<img src="images/5.jpg" alt="Treasure">';

    // 监听键盘事件控制玩家移动
    document.addEventListener('keydown', movePlayer);
}

function movePlayer(event) {
    const playerCell = document.querySelector('.cell.player');
    const row = parseInt(playerCell.dataset.row);
    const col = parseInt(playerCell.dataset.col);

    let newRow = row;
    let newCol = col;

    switch (event.key) {
        case 'ArrowUp':
            newRow = row > 0 ? row - 1 : row;
            break;
        case 'ArrowDown':
            newRow = row < 5 ? row + 1 : row;
            break;
        case 'ArrowLeft':
            newCol = col > 0 ? col - 1 : col;
            break;
        case 'ArrowRight':
            newCol = col < 5 ? col + 1 : col;
            break;
    }

    const newCell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
    if (!newCell.classList.contains('guard')) {
        playerCell.classList.remove('player');
        playerCell.innerHTML = '';
        newCell.classList.add('player');
        newCell.innerHTML = '<img src="images/4.jpg" alt="Player">';

        if (newCell.classList.contains('treasure')) {
            document.removeEventListener('keydown', movePlayer);
            document.getElementById('grid').classList.add('hidden'); // 立即隐藏6x6方格
            showTreasureImage();
        }
    }
}

function showTreasureImage() {
    const treasureImage = document.getElementById('treasureImage');
    treasureImage.classList.add('show');
    setTimeout(() => {
        const popup = document.getElementById('popup');
        popup.classList.add('show');
    }, 1000); // 延迟1秒显示窗，确保动画完成
}

window.addEventListener('load', () => {
    // 加载玩家数据
    currentPlayer = Player.loadFromStorage();
    if (currentPlayer) {
        updateResult(`欢迎回来, ${currentPlayer.nickname}!`);
    }

    // 确保所有按钮都存在并正确绑定事件
    const decodeButton = document.getElementById('decodeButton');
    const submitRiddle = document.getElementById('submitRiddle');
    const helpButton = document.getElementById('helpButton');
    const searchButton = document.getElementById('searchButton');
    const openBoxButton = document.getElementById('openBoxButton');

    if (decodeButton) decodeButton.addEventListener('click', decodeScript);
    if (submitRiddle) submitRiddle.addEventListener('click', submitRiddle);
    if (helpButton) {
        helpButton.addEventListener('click', async () => {
            try {
                const clueResult = await Treasure.decodeAncientScript('some clue');
                updateResult(clueResult);
                document.body.style.backgroundImage = "url('images/2.jpg')";
                document.getElementById('riddleSection').classList.add('hidden');
                document.getElementById('searchButton').classList.remove('hidden');
            } catch (error) {
                updateResult(error);
            }
        });
    }
    if (searchButton) searchButton.addEventListener('click', searchTemple);
    if (openBoxButton) openBoxButton.addEventListener('click', openTreasureBox);
});