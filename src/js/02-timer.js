import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function onDatePickerOpen() {
  picker.setDate(new Date());
}

function onDatePickerClose(selectedDates) {
  const currentDate = Date.now();
  const selectedDate = selectedDates[0].getTime();

  if (selectedDate < currentDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      closeOnEscape: true,
      position: 'topCenter',
    });
    return;
  }

  startButton.disabled = false;
  selectedFutureDate = selectedDate;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateClockface() {
  let { days, hours, minutes, seconds } = convertMs(
    selectedFutureDate - Date.now()
  );

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);

  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    selectedFutureDate = null;
    dateInput.disabled = false;
    clearInterval(intervalId);

    iziToast.success({
      title: 'Success',
      message: 'Time is up!',
      closeOnEscape: true,
      position: 'topCenter',
    });
  }
}

function onStartButtonClick() {
  startButton.disabled = true;
  dateInput.disabled = true;

  updateClockface();

  intervalId = setInterval(updateClockface, 1000);
}

let selectedFutureDate = null;
let intervalId = null;

const daysElement = document.querySelector('span[data-days]');
const hoursElement = document.querySelector('span[data-hours]');
const minutesElement = document.querySelector('span[data-minutes]');
const secondsElement = document.querySelector('span[data-seconds]');

const dateInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
startButton.disabled = true;

startButton.addEventListener('click', onStartButtonClick);

const picker = flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onOpen: onDatePickerOpen,
  onClose: onDatePickerClose,
});
