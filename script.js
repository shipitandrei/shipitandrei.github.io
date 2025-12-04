// Install button logic
let deferredPrompt;
const installButton = document.getElementById('installButton');
const iosHint = document.getElementById('iosHint');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installButton) installButton.style.display = 'block';

  installButton.addEventListener('click', async () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt = null;
  });
});

// iOS hint
const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;
if (iosHint && isIos && !isInStandaloneMode) iosHint.style.display = 'block';

// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registered!'))
    .catch((err) => console.error('Service Worker failed:', err));
}
