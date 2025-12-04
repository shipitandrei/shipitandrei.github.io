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
