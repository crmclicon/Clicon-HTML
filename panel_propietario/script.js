document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view-section');
  const navItems = document.querySelectorAll('aside nav li');
  const addBtn = document.querySelector('.add-btn');
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-btn');
  const saveBtn = document.querySelector('.save-btn');
  const tableBody = document.querySelector('#empresas tbody');
  const pagosBody = document.getElementById('pagos-body');

  const nombreInput = document.getElementById('empresa-nombre');
  const emailInput = document.getElementById('empresa-email');
  const passInput = document.getElementById('empresa-password');
  const carpetaInput = document.getElementById('empresa-carpeta');
  const fechaInput = document.getElementById('empresa-fecha');

  // Navegación entre vistas
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      views.forEach(view => view.classList.remove('active'));
      const target = item.getAttribute('data-view');
      if (target) document.getElementById(target).classList.add('active');
    });
  });

  // Abrir y cerrar modal
  addBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    carpetaInput.value = ''; // limpia al abrir
    fechaInput.value = ''; // limpia al abrir
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Autocompletar carpeta automáticamente
  nombreInput.addEventListener('input', () => {
    const nombre = nombreInput.value.trim().toLowerCase().replace(/\s+/g, '-');
    carpetaInput.value = nombre ? `clicon-${nombre}` : '';
  });

  // Guardar nueva empresa
  saveBtn.addEventListener('click', () => {
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    let password = passInput.value.trim();
    let carpeta = carpetaInput.value.trim();
    let fecha = fechaInput.value;

    if (!nombre || !email) return alert("Faltan completar nombre o email.");

    if (!password) password = "123456";
    if (!carpeta) carpeta = `clicon-${nombre.toLowerCase().replace(/\s+/g, '-')}`;
    if (!fecha) {
      const hoy = new Date();
      fecha = hoy.toISOString().split('T')[0];
      fechaInput.value = fecha;
    }

    // Agregar a tabla empresas
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${nombre}</td>
      <td>${email}</td>
      <td class="estado">Activo</td>
      <td>
        <button class="deshabilitar">Deshabilitar</button>
        <button class="eliminar">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
    attachRowEvents(row);
    agregarFilaPagos(nombre);

    console.log({
      nombre,
      email,
      password,
      carpeta,
      fecha
    });

    modal.style.display = 'none';
    nombreInput.value = '';
    emailInput.value = '';
    passInput.value = '';
    carpetaInput.value = '';
    fechaInput.value = '';
  });

  // Agregar fila a control de pagos
  function agregarFilaPagos(nombre) {
    const pagosRow = document.createElement('tr');
    pagosRow.innerHTML = `
      <td>${nombre}</td>
      ${Array(12).fill('<td><input type="checkbox" /></td>').join('')}
    `;
    pagosBody.appendChild(pagosRow);
  }

  // Botones: eliminar, deshabilitar/habilitar
  function attachRowEvents(row) {
    const eliminarBtn = row.querySelector('.eliminar');
    const toggleBtn = row.querySelector('.deshabilitar');
    const estadoCell = row.querySelector('.estado');

    eliminarBtn.addEventListener('click', () => row.remove());

    toggleBtn.addEventListener('click', () => {
      const activo = estadoCell.textContent === 'Activo';
      estadoCell.textContent = activo ? 'Inactivo' : 'Activo';
      toggleBtn.textContent = activo ? 'Habilitar' : 'Deshabilitar';
    });
  }

  // Sincronizar filas precargadas en Empresas con Pagos
  document.querySelectorAll('#empresas tbody tr').forEach(row => {
    attachRowEvents(row);
    const nombreEmpresa = row.querySelector('td').textContent.trim();
    agregarFilaPagos(nombreEmpresa);
  });
});
