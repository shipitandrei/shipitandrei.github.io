/*
window.onload = function() {
  const span = document.getElementById("visits");

  if (!span) return; // stop if the span doesn't exist

  // Try fetching global counter from countapi.xyz
  fetch("https://api.countapi.xyz/hit/wa019a.github.io/sitecounter")
    .then(res => res.json())
    .then(data => {
      span.textContent = data.value;
    })
    .catch(err => {
      console.warn("Global counter failed, using local fallback:", err);

      // Local per-device counter fallback
      let visits = localStorage.getItem("wa019a_visits") || 0;
      visits++;
      localStorage.setItem("wa019a_visits", visits);
      span.textContent = visits;
    });
};
*/
// Elements on your page
const installButton = document.getElementById('installButton');
const iosHint = document.getElementById('iosHint');

let deferredPrompt;

// --- Android / Chrome install ---
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent automatic prompt
  deferredPrompt = e;

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (installButton) installButton.style.display = 'block';

    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      installButton.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
    });
  }
});

// --- iOS hint ---
const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;

if (isIos && !isInStandaloneMode) {
  if (iosHint) iosHint.style.display = 'block';
}
