eruda.init();
fetch("https://api.countapi.xyz/hit/wa019a.github.io/sitecounter")
  .then(res => res.json())
  .then(data => {
    document.getElementById("visits").textContent = data.value;
  });
