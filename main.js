const displayedImage = document.querySelector('.displayed-img'); //获取大图片元素
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

displayedImage.style.width = '640px';  // 设置显示图片宽度
displayedImage.style.height = '480px'; // 设置显示图片高度
overlay.style.width = '640px';  // 设置覆盖层宽度
overlay.style.height = '480px'; // 设置覆盖层高度

const images = ['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg']; //声明一个包含图片文件名的数组images
const alts = {
  'pic1.jpg' : '第一张',
  'pic2.jpg' : '第二张',
  'pic3.jpg' : '第三张',
  'pic4.jpg' : '第四张',
  'pic5.jpg' : '第五张'
} //声明一个对象alts，其中包含图片文件名和对应的替代文本


for (const image of images) //遍历images数组中的每个图片文件名
 {
  const newImage = document.createElement('img'); //创建一个新的img元素用于显示缩略图
  newImage.setAttribute('src', `images/${image}`); //设置新图片元素的src属性为对应的图片路径
  newImage.setAttribute('alt', alts[image]); //设置新图片元素的alt属性为对应的替代文本
  newImage.style.width = '120px';  // 设置缩略图宽度
  newImage.style.height = '100px'; // 设置缩略图高度
  thumbBar.appendChild(newImage); //将新图片元素添加到缩略图栏中
  newImage.addEventListener('click', e => //添加点击事件监听器，当点击时,更换大图的src和alt属性
    {
    displayedImage.src = e.target.src;
    displayedImage.alt = e.target.alt;
  });
}

btn.addEventListener('click', () =>  //为按钮添加点击事件监听器
  {
  const btnClass = btn.getAttribute('class'); //获取按钮的当前类名
  if (btnClass === 'dark') //如果按钮的类名为dark，则将其改为light，并更改按钮文本和覆盖层背景颜色
    {
    btn.setAttribute('class','light');
    btn.textContent = 'Lighten';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  } 
  else //如果按钮的类名不为dark，则将其改为dark，并更改按钮文本和覆盖层背景颜色
  {
    btn.setAttribute('class','dark');
    btn.textContent = 'Darken';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  }
});