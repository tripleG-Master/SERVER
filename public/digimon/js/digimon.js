document.addEventListener('DOMContentLoaded', function() {
  switchLogo()
  (()=>{
    initTooltips();
  })();
})

function switchLogo() {
  setInterval(() => {
    const logo = document.getElementById('img-logo');
    const image = Math.floor(Math.random() * (13 - 1 + 1) + 1);
    logo.src = `./img/digimon-logo-${image}.webp`;
    console.log("logo cambiado")
  }, 3000);
}


function initTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
    trigger: 'hover'
  }));
}

function prueba() {
  alert('js server ubicacion')
}
