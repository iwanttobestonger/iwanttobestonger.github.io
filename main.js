const aliceTumbling = [
  { transform: "rotate(0) scale(1)" },
  { transform: "rotate(360deg) scale(0)" },
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: "forwards",
};

document.addEventListener('DOMContentLoaded', (event) => {
  const alice1 = document.querySelector("#alice1");
  const alice2 = document.querySelector("#alice2");
  const alice3 = document.querySelector("#alice3");


//回调地狱版本

  // 启动第一个动画
  alice1.animate(aliceTumbling, aliceTiming).finished
    .then(() => {
      // 当alice1动画完成时启动alice2动画
      return alice2.animate(aliceTumbling, aliceTiming).finished;
    })
    .then(() => {
      // 当alice2动画完成时启动alice3动画
      return alice3.animate(aliceTumbling, aliceTiming).finished;
    })
    .then(() => {
      // 所有动画都完成了
      console.log("All animations are completed.");
    });
});

//使用 Promise 链
document.addEventListener('DOMContentLoaded', () => {
  const animateElement = (element, keyframes, timing) => element.animate(keyframes, timing).finished;

  animateElement(document.querySelector("#alice1"), aliceTumbling, aliceTiming)
    .then(() => animateElement(document.querySelector("#alice2"), aliceTumbling, aliceTiming))
    .then(() => animateElement(document.querySelector("#alice3"), aliceTumbling, aliceTiming))
    .then(() => console.log("All animations are completed."));
});

//使用 async 和 await
document.addEventListener('DOMContentLoaded', async () => {
  const animateElement = (element, keyframes, timing) => element.animate(keyframes, timing).finished;

  try {
    await animateElement(document.querySelector("#alice1"), aliceTumbling, aliceTiming);
    await animateElement(document.querySelector("#alice2"), aliceTumbling, aliceTiming);
    await animateElement(document.querySelector("#alice3"), aliceTumbling, aliceTiming);
    console.log("All animations are completed.");
  } catch (error) {
    console.error("An error occurred during the animation:", error);
  }
});
