let currentFilter = 'all';
let allData = purchasesData;

function init() {
  renderTable(allData);
  renderCharts();
  setupEventListeners();
  loadTheme();
}

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  const filtered = currentFilter === 'all' ? data : data.filter(d => d.dimension === currentFilter);
  filtered.forEach(item => {
    const row = `<tr><td>${item.nombre}</td><td>${item.fecha}</td><td>${getDimensionName(item.dimension)}</td><td class="text-right">$${item.monto.toLocaleString('es-CL')}</td></tr>`;
    tbody.innerHTML += row;
  });
}

function getDimensionName(dim) {
  const names = {pedagogica: 'Gestión Pedagógica', recursos: 'Gestión de Recursos', liderazgo: 'Liderazgo', convivencia: 'Convivencia Escolar'};
  return names[dim] || dim;
}

function renderCharts() {
  const ctx1 = document.getElementById('distributionChart')?.getContext('2d');
  const ctx2 = document.getElementById('executionChart')?.getContext('2d');
  
  if(ctx1) {
    new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: dimensiones.map(d => d.nombre),
        datasets: [{data: dimensiones.map(d => d.porcentaje), backgroundColor: ['#667eea', '#f093fb', '#f5576c', '#4facfe']}]
      },
      options: {responsive: true, plugins: {legend: {position: 'bottom'}}}
    });
  }
  
  if(ctx2) {
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Presupuesto', 'Ejecutado'],
        datasets: [{label: 'Monto ($)', data: [resumen.total, resumen.ejecutado], backgroundColor: ['#667eea', '#f5576c']}]
      },
      options: {responsive: true, scales: {y: {beginAtZero: true}}}
    });
  }
}

function setupEventListeners() {
  document.getElementById('scrollBtn')?.addEventListener('click', () => {
    document.getElementById('summary').scrollIntoView({behavior: 'smooth'});
  });
  
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderTable(allData);
    });
  });
  
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = allData.filter(d => d.nombre.toLowerCase().includes(search) || d.fecha.includes(search) || getDimensionName(d.dimension).toLowerCase().includes(search));
    renderTable(filtered);
  });
  
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if(theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

window.addEventListener('DOMContentLoaded', init);
