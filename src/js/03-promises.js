import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

async function sleep(delayMs) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
}

async function createPromise(position, delay) {
  if (delay > 0) {
    await sleep(delay);
  }

  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    if (shouldResolve) {
      resolve({ position, delay });
    } else {
      reject({ position, delay });
    }
  });
}

const form = document.querySelector('.form');
form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const step = Number(form.elements.step.value);
  const amount = Number(form.elements.amount.value);

  let position = 1;
  let promiseDelay = delay;

  while (position <= amount) {
    createPromise(position, promiseDelay)
      .then(data => {
        iziToast.success({
          title: 'Promise fulfilled',
          message: `✅ Fulfilled promise ${data.position} in ${data.delay}ms`,
          position: 'topCenter',
        });
      })
      .catch(data => {
        iziToast.error({
          title: 'Promise rejected',
          message: `❌ Rejected promise ${data.position} in ${data.delay}ms`,
          position: 'topCenter',
        });
      });

    position += 1;
    promiseDelay += step;
  }
});
