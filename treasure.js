class Treasure {
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

async function decodeScript() {
    document.getElementById('decodeButton').classList.add('hidden');
    document.getElementById('riddleSection').classList.remove('hidden');
}

async function submitRiddle() {
    const answer = document.getElementById('riddleAnswer').value.trim();
    if (answer === '月') {
        try {
            const clueResult = await Treasure.decodeAncientScript('some clue');
            updateResult(clueResult);
            document.body.style.backgroundImage = "url('2.jpg')";
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
        const templeResult = await Treasure.searchTemple('some location');
        updateResult(templeResult);
        document.body.style.backgroundImage = "url('3.jpg')";
        document.getElementById('searchButton').classList.add('hidden');
        document.getElementById('grid').classList.remove('hidden');
        updateResult("糟糕，附近有神庙守卫！请避开守卫并拿到宝箱。");

        // 初始化6x6方格
        initializeGrid();
    } catch (error) {
        updateResult(error);
    }
}

async function openTreasureBox() {
    try {
        const treasureResult = await Treasure.openTreasureBox();
        updateResult(treasureResult);
        document.body.style.backgroundImage = "url('3.jpg')";
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
    playerCell.innerHTML = '<img src="4.jpg" alt="Player">';

    const treasureCell = document.querySelector(`.cell[data-row='5'][data-col='5']`);
    treasureCell.classList.add('treasure');
    treasureCell.innerHTML = '<img src="5.jpg" alt="Treasure">';

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
        newCell.innerHTML = '<img src="4.jpg" alt="Player">';

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
    }, 1000); // 延迟1秒显示弹窗，确保动画完成
}

document.getElementById('decodeButton').addEventListener('click', decodeScript);
document.getElementById('submitRiddle').addEventListener('click', submitRiddle);
document.getElementById('helpButton').addEventListener('click', async () => {
    try {
        const clueResult = await Treasure.decodeAncientScript('some clue');
        updateResult(clueResult);
        document.body.style.backgroundImage = "url('2.jpg')";
        document.getElementById('riddleSection').classList.add('hidden');
        document.getElementById('searchButton').classList.remove('hidden');
    } catch (error) {
        updateResult(error);
    }
});
document.getElementById('searchButton').addEventListener('click', searchTemple);
document.getElementById('openBoxButton').addEventListener('click', openTreasureBox);