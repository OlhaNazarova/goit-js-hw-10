import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
  delayInput: document.querySelector('input[name="delay"]'),
  startBtn: document.querySelector('button'),
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  const delay = refs.delayInput.value;

  createPromiss(delay)
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  refs.form.reset();
});

const createPromiss = delay => {
  return new Promise((resolve, reject) => {
    const value = refs.form.elements.state.value;
    setTimeout(() => {
      if (value === 'fulfilled') {
        resolve(delay);
      } else if (value === 'rejected') {
        reject(delay);
      }
    }, delay);
  });
};