export const clickSound = () => {
  const audio = new Audio("assets/click.wav");
  audio.play();
  if (navigator.vibrate) navigator.vibrate(50);
};
