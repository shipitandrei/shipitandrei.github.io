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
   let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent automatic prompt
      e.preventDefault();
      deferredPrompt = e;

      // Only show button if on mobile
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        const btn = document.getElementById('installButton');
        btn.style.display = 'block';

        btn.addEventListener('click', async () => {
          btn.style.display = 'none'; // hide button after click
          deferredPrompt.prompt();    // show browser install prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response: ${outcome}`);
          deferredPrompt = null;
        });
      }
    });
