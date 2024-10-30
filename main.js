const aliceTumbling = [
  { transform: "rotate(0) scale(1)" },
  { transform: "rotate(360deg) scale(0)" },
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: "forwards",
};

const aliceTranslate = [
  { transform: "translateX(0)" },
  { transform: "translateX(100px)" },
];

const aliceTranslateTiming = {
  duration: 1000,
  iterations: 1,
  fill: "forwards",
};

document.addEventListener('DOMContentLoaded', async () => {
  const animateElement = (element, keyframes, timing) => element.animate(keyframes, timing).finished;

  try {
    await animateElement(document.querySelector("#alice1"), aliceTumbling, aliceTiming);
    await animateElement(document.querySelector("#alice2"), aliceTumbling, aliceTiming);
    await animateElement(document.querySelector("#alice3"), aliceTumbling, aliceTiming);

    await animateElement(document.querySelector("#alice1"), aliceTranslate, aliceTranslateTiming);
    await animateElement(document.querySelector("#alice2"), aliceTranslate, aliceTranslateTiming);
    await animateElement(document.querySelector("#alice3"), aliceTranslate, aliceTranslateTiming);

    console.log("All animations are completed.");
  } catch (error) {
    console.error("An error occurred during the animation:", error);
  }
});