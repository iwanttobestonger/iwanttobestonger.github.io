console.log('应用已启动！');

const app = document.getElementById('app');
const paragraph = document.createElement('p');
paragraph.textContent = '这是一个使用 Parcel 构建的应用';
app.appendChild(paragraph); 