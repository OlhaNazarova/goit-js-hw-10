import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
const refs = {
  dateInput: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  daySpan: document.querySelector('span[data-days]'),
  hourSpan: document.querySelector('span[data-hours]'),
  minSpan: document.querySelector('span[data-minutes]'),
  secSpan: document.querySelector('span[data-seconds]'),
};

class Timer {
  static isActive = false;
  constructor(onTick) {
    this.intervalId = null;
    this.onTick = onTick;
  }

  start() {
   
    Timer.isActive = true;
    this.intervalId = setInterval(() => {
      const currentTime = Date.now(); 
      const deltaTime = userSelectedDate - currentTime;
      if (deltaTime <= 0) {
        this.stop(this.intervalId);
        return;
      }
      const convertedDeltaTime = this.convertMs(deltaTime);
      const time = this.addLeadingZero(convertedDeltaTime);
      this.onTick(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    Timer.isActive = false;
    refs.startBtn.disabled = false;
  }
convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    const {
      days: inputDays,
      hours: inputHours,
      minutes: inputMinutes,
      seconds: inputSeconds,
    } = value;
    const days = inputDays.toString().padStart(2, '0');
    const hours = inputHours.toString().padStart(2, '0');
    const minutes = inputMinutes.toString().padStart(2, '0');
    const seconds = inputSeconds.toString().padStart(2, '0');

    return { days, hours, minutes, seconds };
  }
}
const timer = new Timer(updateClockFace);
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
   if (selectedDates[0].getTime() < Date.now()) {
        iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      refs.startBtn.disabled = true;
      userSelectedDate = selectedDates[0].getTime();
      return;
    }
      userSelectedDate = selectedDates[0].getTime();
    if (!Timer.isActive) {
      refs.startBtn.disabled = false;
    }
  },
};

const fp = flatpickr(refs.dateInput, options);
refs.startBtn.addEventListener('click', () => {
 if (!userSelectedDate) {
    return;
  }
  timer.start();
  refs.startBtn.disabled = true;
});

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.daySpan.textContent = `${days}`;
  refs.hourSpan.textContent = `${hours}`;
  refs.minSpan.textContent = `${minutes}`;
  refs.secSpan.textContent = `${seconds}`;
}