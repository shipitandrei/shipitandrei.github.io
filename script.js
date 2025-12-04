let deferredPrompt;
const installButton = document.getElementById('installButton');
const iosHint = document.getElementById('iosHint');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
      installButton.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt = null;
    });
  }
});

// iOS hint
const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;
if (isIos && !isInStandaloneMode) iosHint.style.display = 'block';
