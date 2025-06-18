export const showAlert = (message: string, bgColor: string) => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce`;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
};