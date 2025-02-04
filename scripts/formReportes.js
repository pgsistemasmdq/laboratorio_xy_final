const { DateTime } = luxon; // Importar DateTime de Luxon
const fechaDesde = document.getElementById("fechaDesde");
const fechaHasta = document.getElementById("fechaHasta");
const proveedorFiltro = document.getElementById("proveedorFiltro");
const reactivoFiltro = document.getElementById("reactivoFiltro");
const filtrarBtn = document.getElementById("filtrarBtn");
const tablaReportes = document.querySelector("#tablaReportes tbody");



function inicializarPantallaReportes() {
    // Primero cargar los proveedores
    getProveedores()
        .then(() => {
            // Luego cargar los reactivos
            llenarComboboxProveedores();
            return getReactivos();  // Asegúrate de que esta función devuelve la promesa de carga
        })
        .then(() => {
            llenarComboboxReactivos()
            return getMovimientos();
        })

        .catch(error => {
            console.error("Error durante la inicialización de movimientos:", error);
        });
}


function llenarComboboxReactivos() {
    const combobox = document.getElementById("reactivoFiltro");
    combobox.innerHTML = ""; // Limpiar las opciones existentes
    combobox.innerHTML = '<option value="">Todos</option>';
    sistema.reactivos.forEach(reactivo => {
        const option = document.createElement("option");
        option.value = reactivo.codigo; // El código como valor de la opción
        option.textContent = `${reactivo.descripcion}`;
        combobox.appendChild(option);
    });

}

function llenarComboboxProveedores() {
    const combobox = document.getElementById("proveedorFiltro");
    combobox.innerHTML = ""; // Limpiar las opciones existentes
    combobox.innerHTML = '<option value="">Todos</option>';
    sistema.proveedores.forEach(proveedor => {
        const option = document.createElement("option");
        option.value = proveedor.codigo; // El código como valor de la opción
        option.textContent = `${proveedor.razonSocial}`;
        combobox.appendChild(option);
    });

}

const filtrarMovimientos = () => {
    const desde = fechaDesde.value;
    const hasta = fechaHasta.value;
    const proveedorCodigo = proveedorFiltro.value;
    const reactivoCodigo = reactivoFiltro.value;

    const movimientosFiltrados = sistema.movimientos.filter(movimiento => {
        // Filtro por fechas
        const fechaMovimiento = DateTime.fromISO(movimiento.fecha);
        const fechaDesdeFiltro = DateTime.fromISO(desde);
        const fechaHastaFiltro = DateTime.fromISO(hasta);

        const coincideFecha = fechaMovimiento >= fechaDesdeFiltro && fechaMovimiento <= fechaHastaFiltro;

        
        const coincideProveedor = proveedorCodigo === "" 
            ? true 
            : movimiento.reactivo.proveedor.codigo === parseInt(proveedorCodigo);

        // Filtro por reactivo (solo si no es "Todos")
        const coincideReactivo = reactivoCodigo === "" 
            ? true 
            : movimiento.reactivo.codigo === parseInt(reactivoCodigo);

        // Aplicar todos los filtros
        return coincideFecha && coincideProveedor && coincideReactivo;
    });

    // Actualizar la tabla con los movimientos filtrados
    actualizarTabla(movimientosFiltrados);
};

const actualizarTabla = (movimientos) => {
    tablaReportes.innerHTML = "";

    movimientos.forEach(movimiento => {
        const fila = document.createElement("tr");
        fila.classList.add("fila-dinamica"); 
        fila.innerHTML = `
            <td>${movimiento.numero}</td>
            <td>${movimiento.fecha}</td>
            <td>${movimiento.reactivo.codigo}</td>
            <td>${movimiento.reactivo.descripcion}</td>
            <td>${movimiento.reactivo.proveedor.razonSocial}</td>
            <td>${movimiento.movimiento}</td>
        `;
        tablaReportes.appendChild(fila);
    });
};

function inicializarFiltros() {
    // Restablecer fechas
    const hoy = DateTime.now(); // Fecha actual
    const hace30Dias = hoy.minus({ days: 30 }); // Fecha de hace 30 días

    fechaDesde.value = hace30Dias.toISODate(); // Formato YYYY-MM-DD
    fechaHasta.value = hoy.toISODate(); // Formato YYYY-MM-DD

    // Restablecer selects a "Todos"
    proveedorFiltro.value = "";
    reactivoFiltro.value = "";

    // Volver a aplicar el filtro para mostrar todos los movimientos
    filtrarMovimientos();
}

  // Evento para el botón de filtrar
filtrarBtn.addEventListener("click", filtrarMovimientos);
document.getElementById("inicializarFiltros").addEventListener("click", inicializarFiltros);

document.addEventListener("DOMContentLoaded", () => {
    inicializarPantallaReportes();
    inicializarFiltros();
});


