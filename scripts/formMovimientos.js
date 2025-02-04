
const agregarBtn = document.getElementById("agregarBtn");
const aceptarBtn = document.getElementById("aceptarBtn");
const cancelarBtn = document.getElementById("cancelarBtn");
const formFields = document.querySelectorAll("#movimientosForm input, #movimientosForm select");
const formAceptarCancelar = document.getElementById("formAceptarCancelar");
const titulo = document.getElementById("titulo");
const numeroInput = document.getElementById("numero");
const reactivoSelect = document.getElementById("reactivo");
const cantidadInput = document.getElementById("cantidad");
const fechaInput = document.getElementById("fecha");
let movimientoCounter = 1; // Contador para código autonumérico


/**
* Obtiene la fecha actual en formato de cadena "YYYY-MM-DD".
* 
* @returns {string} Devuelve la fecha actual en formato "YYYY-MM-DD".
*/
const obtenerFechaActual = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};


const habilitarFormulario = () => {
    // Habilitar los campos del formulario
    formFields.forEach(field => (field.disabled = false));
    titulo.textContent = "Cargar Movimientos";

    // Enfocar el select de reactivos
    reactivoSelect.focus();

    // Seleccionar el primer reactivo si hay opciones disponibles
    if (reactivoSelect.options.length > 0) {
        reactivoSelect.selectedIndex = 0;  // Selecciona el primer elemento
    }

    // Configuración de valores por defecto
    cantidadInput.value = "1";
    fechaInput.value = obtenerFechaActual();

    // Calcular el siguiente número de movimiento
    const maxNumero = sistema.movimientos.length > 0
        ? Math.max(...sistema.movimientos.map(movimiento => parseInt(movimiento.numero, 10)))
        : 0;
    numeroInput.value = String(maxNumero + 1);

    // Mostrar los botones de aceptar/cancelar
    formAceptarCancelar.style.display = "flex";
};

/**
 * Función para deshabilitar formulario y ocultar botones
 */

const resetFormulario = () => {
    formFields.forEach(field => {
        if (field.type !== "checkbox") {
            field.value = "";
        }
        field.disabled = true;
    });
    formAceptarCancelar.style.display = "none";
    if (reactivoSelect.options.length > 0) {
        reactivoSelect.selectedIndex = 0;  // Selecciona el primer elemento
    }

};

const DeshabilitarFormulario = () => {
    formFields.forEach(field => {
        field.checked = false; // Resetear checkbox
        field.disabled = true;
    });
    formAceptarCancelar.style.display = "none";
};

//
// EVENTOS
//
// Evento para el botón Agregar
agregarBtn.addEventListener("click", () => {
    habilitarFormulario();
    agregarBtn.disabled = true;

});


// Evento para el botón Cancelar
cancelarBtn.addEventListener("click", () => {
    resetFormulario();
    agregarBtn.disabled = false;
    seleccionarPrimeraFila();
});


//evento solo numeros enteros en stock
cantidadInput.addEventListener("input", (e) => {
    let valor = e.target.value;
    // Expresión regular que permite números enteros positivos y negativos
    if (!/^-?\d*$/.test(valor)) {
        // Reemplaza cualquier carácter que no sea un dígito o un signo negativo al principio
        valor = valor.replace(/(?!^-)\D/g, "");
        e.target.value = valor;

        cantidadInput.style.borderColor = "red"; // Borde rojo si es inválido
    } else {
        cantidadInput.style.borderColor = ""; // Restaurar borde si es válido
    }
});
cantidadInput.addEventListener("blur", (e) => {
    if (e.target.value.trim() === "") {
        e.target.value = "0"; // Establecer valor por defecto a 0
    }
});
//
//
// Evento para el botón Aceptar

function actualizarStockReactivo(codigo, cantidad) {
    const reactivo = sistema.reactivos.find(r => r.codigo === codigo);
    if (reactivo) {
        reactivo.stock = (reactivo.stock || 0) + cantidad;  // Actualiza el stock
        localStorage.setItem("reactivos", JSON.stringify(sistema.reactivos));  // Guarda los cambios en localStorage
    }
}

const agregarFilaATabla = (movimiento) => {
    const fila = document.createElement("tr");
    fila.dataset.codigo = movimiento.numero; // Para identificarla fácilmente
    fila.innerHTML = `
            <td>${movimiento.numero}</td>
            <td>${movimiento.fecha}</td>
            <td>${movimiento.reactivo.codigo}</td>
            <td>${movimiento.reactivo.descripcion}</td>
            <td>${movimiento.reactivo.proveedor.razonSocial}</td>
            <td>${movimiento.movimiento}</td>
        `;
    fila.addEventListener("click", () => seleccionarFila(fila, movimiento));
    tablaMovimientos.appendChild(fila);

            // Evento para seleccionar una fila

    return fila;
};

// Evento para el botón Aceptar
aceptarBtn.addEventListener("click", () => {
    const reactivoCodigo = parseInt(reactivoSelect.value); // Código del proveedor seleccionado en el combobox
    const cantidad = parseInt(cantidadInput.value.trim());
    const fecha = fechaInput.value;

    // Validaciones

    if (isNaN(reactivoCodigo)) {
        mensajeAlert("Debe seleccionar un reactivo válido.", "rgb(247, 27, 27)", "rgb(247, 27, 27)")
        return;
    }

    if (isNaN(cantidad) || cantidad <= -999999 || cantidad > 999999) {
        mensajeAlert("La cantidad debe ser un número entre -99999 y 999999.", "rgb(247, 27, 27)", "rgb(247, 27, 27)")
        return;
    }

    // Buscar el reactivo seleccionado
    const reactivoSeleccionado = sistema.reactivos.find(r => r.codigo === reactivoCodigo);

    if (!reactivoSeleccionado) {
        mensajeAlert("Reactivo no encontrado.", "rgb(247, 27, 27)", "rgb(247, 27, 27)")

        return;
    }

    const nuevoMovimiento = {
        numero: sistema.movimientos.length + 1,
        reactivo: {
            codigo: reactivoSeleccionado.codigo,
            descripcion: reactivoSeleccionado.descripcion,
            proveedor: {
                codigo: reactivoSeleccionado.proveedor.codigo,
                razonSocial: reactivoSeleccionado.proveedor.razonSocial
            }
        },
        fecha: fecha,
        movimiento: cantidad
    }


    // Guardar en el array global y en localStorage
    sistema.movimientos.push(nuevoMovimiento);
    localStorage.setItem("movimientos", JSON.stringify(sistema.movimientos));

    // Actualizar el stock del reactivo
    actualizarStockReactivo(reactivoCodigo, cantidad);
    // Actualizar la tabla
    //agregarFilaATabla(unmovimiento);
    const nuevaFila = agregarFilaATabla(nuevoMovimiento);

    // Mensaje de éxito
    mensajeAlert("Movimiento ingresado correctamente.", "rgb(50, 61, 219)", "rgb(140, 118, 236)");

    seleccionarFila(nuevaFila, nuevoMovimiento);

    DeshabilitarFormulario();
    agregarBtn.disabled = false;

});


function inicializarPantallaMovimientos() {
    // Primero cargar los proveedores
    getProveedores()
        .then(() => {
            // Luego cargar los reactivos
            return getReactivos();  // Asegúrate de que esta función devuelve la promesa de carga
        })
        .then(() => {
            llenarComboboxReactivos()
            return getMovimientos();
        })
        .then(() => {
            // Generar las filas para los reactivos después de que estén cargados
            generarFilastablaMovimientos();

            // Habilitar los botones cuando todo esté listo
            agregarBtn.disabled = false;

            // Seleccionar la primera fila después de cargar la tabla
            seleccionarPrimeraFila();
        })
        .catch(error => {
            console.error("Error durante la inicialización de movimientos:", error);
        });
}


function llenarComboboxReactivos() {
    const combobox = document.getElementById("reactivo");
    combobox.innerHTML = ""; // Limpiar las opciones existentes

    sistema.reactivos.forEach(reactivo => {
        const option = document.createElement("option");
        option.value = reactivo.codigo; // El código como valor de la opción
        option.textContent = `${reactivo.descripcion}`;
        combobox.appendChild(option);
    });

}

function generarFilastablaMovimientos() {
    const tabla = document.querySelector("#tablaMovimientos tbody");
    if (!tabla) {
        console.error("El elemento <tbody> de la tabla con ID 'tablaMovimientos' no se encuentra en el DOM.");
        return;
    }

    // Limpiar las filas existentes
    tabla.innerHTML = "";

    sistema.movimientos.forEach((movimiento) => {
        agregarFilaATabla(movimiento);
    });
}

function seleccionarFila(fila, movimiento) {
    // Quitar selección previa
    const filas = document.querySelectorAll("#tablaMovimientos tr");
    filas.forEach(f => f.classList.remove("selected"));

    // Agregar selección a la fila actual
    fila.classList.add("selected");

    // Rellenar el formulario con los datos del movimiento seleccionado
    document.getElementById("numero").value = movimiento.numero;
    document.getElementById("fecha").value = movimiento.fecha;
    document.getElementById("reactivo").value = movimiento.reactivo.codigo;  // Reactivo (código)
    document.getElementById("cantidad").value = movimiento.movimiento;  // Cantidad (movimiento)
}


const seleccionarPrimeraFila = () => {
    // Obtener la tabla
    const tabla = document.getElementById("tablaMovimientos");

    // Verificar si hay filas en la tabla
    const filas = tabla.querySelectorAll("tbody tr");

    if (filas.length > 0) {
        // Seleccionar la primera fila
        const primeraFila = filas[0];

        // Obtener las celdas de la fila por orden
        const celdas = primeraFila.querySelectorAll("td");

        // Crear un objeto movimiento con los datos necesarios (por índice de celda)
        const movimiento = {
            numero: celdas[0]?.textContent.trim() || "", // Número (columna 1)
            fecha: celdas[1]?.textContent.trim() || "",  // Fecha (columna 2)
            reactivo: {
                codigo: parseInt(celdas[2]?.textContent.trim()) || 0,  // Código del reactivo (columna 3)
                descripcion: celdas[3]?.textContent.trim() || "",     // Descripción del reactivo (columna 4)
                proveedor: {
                    razonSocial: celdas[4]?.textContent.trim() || ""  // Razón social del proveedor (columna 5)
                }
            },
            movimiento: parseInt(celdas[5]?.textContent.trim()) || 0  // Movimiento (columna 6)
        };

        // Usar la función existente para seleccionar la fila y pasar el movimiento
        seleccionarFila(primeraFila, movimiento);
    }
};


/**
 * B U S Q U E D A
 * Aca va lo referente a la busqueda en la tabla
 * 
 * 
 */
// Filtra y renderiza los datos en la tabla
// Actualiza la tabla con los datos filtrados
const actualizarTabla = (datos) => {
    const tablaBody = document.querySelector("#tablaMovimientos tbody");
    tablaBody.innerHTML = ""; // Limpiar la tabla

    // Crear nuevas filas
    datos.forEach((movimiento) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${movimiento.numero}</td>
            <td>${movimiento.fecha}</td>
            <td>${movimiento.reactivo.codigo}</td>
            <td>${movimiento.reactivo.descripcion}</td>
            <td>${movimiento.reactivo.proveedor.razonSocial || completar}</td>
            <td>${movimiento.movimiento}</td>
         `;
        tablaBody.appendChild(fila);
    });
};

const buscarTabla = () => {
    const busqueda = document.getElementById("busqueda").value.toLowerCase(); // Texto en minúsculas

    const datosFiltrados = sistema.movimientos.filter((movimiento) => {
        return (
            movimiento.numero.toString().toLowerCase().includes(busqueda) ||
            movimiento.reactivo.codigo.toString().toLowerCase().includes(busqueda) ||
            movimiento.reactivo.descripcion.toLowerCase().includes(busqueda) ||
            movimiento.reactivo.proveedor.razonSocial.toLowerCase().includes(busqueda) ||
            movimiento.movimiento.toString().toLowerCase().includes(busqueda) ||
            movimiento.fecha.toLowerCase().includes(busqueda)
        );
    });

    if (datosFiltrados.length === 0) {
        resetFormulario();
        mensajeAlert("No hay resultados para la búsqueda.","rgb(233, 38, 12)", "rgb(245, 228, 74)")

    } else {
        actualizarTabla(datosFiltrados);
        seleccionarPrimeraFila();
    }
};


/**
 * CREAR EVENTO DEL BOTON DE BUSQUEDA buscarmovimiento
 * 
 */
document.getElementById("buscarmovimiento").addEventListener("click", buscarTabla);


document.addEventListener("DOMContentLoaded", () => {
    resetFormulario();
    agregarBtn.disabled = false;
    inicializarPantallaMovimientos();
    seleccionarPrimeraFila();
});


