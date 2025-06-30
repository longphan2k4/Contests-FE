export const createRipple = (color: string) => {
  const rippleContainer = document.createElement('div');
  rippleContainer.className = `ripple-container ${color}-ripple`;
  document.body.appendChild(rippleContainer);

  setTimeout(() => {
    document.body.removeChild(rippleContainer);
  }, 2000);
};