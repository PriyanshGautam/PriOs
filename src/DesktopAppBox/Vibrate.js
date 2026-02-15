// utils/vibration.js
export const vibrate = (duration = 50) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};
