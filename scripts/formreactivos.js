
const agregarBtn = document.getElementById("agregarBtn");
const editarBtn = document.getElementById("editarBtn");
const borrarBtn = document.getElementById("borrarBtn");
const aceptarBtn = document.getElementById("aceptarBtn");
const cancelarBtn = document.getElementById("cancelarBtn");
const formFields = document.querySelectorAll("#reactivosForm input, #reactivosForm select");
const formAceptarCancelar = document.getElementById("formAceptarCancelar");
const titulo = document.getElementById("titulo");
const codigoInput = document.getElementById("codigo");
const descripcionInput = document.getElementById("descripcion");
const proveedorInput = document.getElementById("proveedor");
const stockInput = document.getElementById("stock");
const conservarCamaraInput = document.getElementById("stock");
const fechaInput = document.getElementById("fecha");
let reactivoCounter = 1; // Contador para código autonumérico
let flagAbm = "";

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

const agregarFilaATabla = (reactivo) => {
    const fila = document.createElement("tr");
    fila.dataset.codigo = reactivo.codigo; // Para identificarla fácilmente
    fila.innerHTML = `
            <td>${reactivo.codigo}</td>
            <td>${reactivo.descripcion}</td>
            <td>${reactivo.proveedor.razonSocial}</td>
            <td>${reactivo.stock}</td>
            <td>${reactivo.conservarCamara ? "Sí" : "No"}</td>
            <td>${reactivo.fecha}</td>
        `;
    tablaReactivos.appendChild(fila);

    return fila;
};

const habilitarFormulario = (flag) => {
    formFields.forEach(field => (field.disabled = false));
    titulo.textContent = "ABM Reactivos (" + flag + ")";

    descripcionInput.focus();
    if (flag === "ALTA") {
        stockInput.value = "1";
        fechaInput.value = obtenerFechaActual();

        const maxCodigo =
            sistema.reactivos.length > 0
                ? Math.max(...sistema.reactivos.map(reactivo => parseInt(reactivo.codigo, 10)))
                : 0;

        codigoInput.value = String(maxCodigo + 1);
        descripcionInput.value = "";

    }

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
        field.checked = false; // Resetear checkbox
        field.disabled = true;
    }); 
    formAceptarCancelar.style.display = "none";
    titulo.textContent = "ABM Reactivos";
};

const DeshabilitarFormulario = () => {
    formFields.forEach(field => {
       field.checked = false; // Resetear checkbox
       field.disabled = true;
   }); 
   formAceptarCancelar.style.display = "none";
   titulo.textContent = "ABM Reactivos";
};

//
// EVENTOS
//
// Evento para el botón Agregar
agregarBtn.addEventListener("click", () => {
    flagAbm = "ALTA";
    habilitarFormulario(flagAbm);
    agregarBtn.disabled = true;
    editarBtn.disabled = true;
    borrarBtn.disabled = true;
});
// Evento para el botón Editar
editarBtn.addEventListener("click", () => {
    flagAbm = "MODIFICACION";
    habilitarFormulario(flagAbm);
    agregarBtn.disabled = true;
    editarBtn.disabled = true;
    borrarBtn.disabled = true;
});


borrarBtn.addEventListener("click", () => {
    // Obtener el código del reactivo seleccionado
    const codigo = document.getElementById("codigo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!codigo) {
        Toastify({
            text: "Por favor, selecciona un reactivo para borrar.",
            duration: 2000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right,rgb(233, 38, 12),rgb(233, 38, 12))",
            },
            onClick: function () { } // Callback after click
        }).showToast(); return;
    }

    // Mostrar confirmación al usuario

    Swal.fire({
        title: `¿Estás seguro de que deseas borrar el reactivo?`,
        text: `${codigo} - ${descripcion}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamar a la función para borrar el reactivo
            const resultado = borrarReactivo(parseInt(codigo));

            if (resultado) {

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Reactivo eliminado correctamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            // Resetear formulario
            resetFormulario();
            seleccionarPrimeraFila();
        } else {
            // Si no se confirma la eliminación
            Swal.fire({
                icon: 'error',
                title: 'Cancelado',
                text: 'Eliminación cancelada.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });


});

const borrarReactivo = (codigo) => {
    // Eliminar del array `sistema.reactivos`
    const index = sistema.reactivos.findIndex(r => r.codigo === parseInt(codigo));
    if (index !== -1) {
        sistema.reactivos.splice(index, 1);
    } else {
        alert("El reactivo no se encontró en el sistema.");
        return false;
    }

    // Actualizar localStorage
    localStorage.setItem("reactivos", JSON.stringify(sistema.reactivos));

    // Eliminar la fila de la tabla
    const fila = document.querySelector(`#tablaReactivos tbody tr[data-codigo="${codigo}"]`);
    if (fila) {
        fila.remove();
        return true;
    } else {
        alert("No se encontró la fila correspondiente en la tabla.");
        return false;
    }

};

// Evento para el botón Cancelar
cancelarBtn.addEventListener("click", () => {
    resetFormulario();
    agregarBtn.disabled = false;
    editarBtn.disabled = false;
    borrarBtn.disabled = false;
    seleccionarPrimeraFila();
});

// Evento para forzar mayúsculas en el campo Descripción
descripcionInput.addEventListener("input", () => {
    descripcionInput.value = descripcionInput.value.toUpperCase();
});

// Evento en descripcion cuando pierde el foco
descripcionInput.addEventListener("blur", () => {
    const descripcion = descripcionInput.value.trim();
    if (!descripcion || descripcion.length > 50) {
        descripcionInput.classList.add("input-error");
        descripcionInput.classList.remove("input-success");
    } else {
        descripcionInput.classList.add("input-success");
        descripcionInput.classList.remove("input-error");
    }
});

//evento solo numeros enteros en stock
stockInput.addEventListener("input", (e) => {
    const valor = e.target.value;
    if (!/^\d*$/.test(valor)) {
        e.target.value = valor.replace(/\D/g, "");
        stockInput.style.borderColor = "red"; // Borde rojo si es inválido
    } else {
        stockInput.style.borderColor = ""; // Restaurar borde si es válido
    }
});

stockInput.addEventListener("blur", (e) => {
    if (e.target.value.trim() === "") {
        e.target.value = "0"; // Establecer valor por defecto a 0
    }
});

// Evento para el botón Aceptar
aceptarBtn.addEventListener("click", () => {
    const codigo = parseInt(codigoInput.value.trim());
    const descripcion = descripcionInput.value.trim();
    const proveedorCodigo = parseInt(proveedorInput.value); // Código del proveedor seleccionado en el combobox
    const stock = parseInt(stockInput.value);
    const conservarCamara = document.getElementById("conservarCamara").checked;
    const fecha = fechaInput.value.trim();

    // Validaciones
    if (!descripcion || descripcion.length > 50) {
        alert("La descripción debe tener entre 1 y 50 caracteres.");
        return;
    }

    if (isNaN(proveedorCodigo)) {
        alert("Debe seleccionar un proveedor válido.");
        return;
    }

    if (isNaN(stock) || stock <= 0 || stock > 999999) {
        alert("El stock debe ser un número entre 1 y 999999.");
        return;
    }

    // Buscar proveedor
    const proveedor = sistema.proveedores.find(p => p.codigo === proveedorCodigo);
    if (!proveedor) {
        alert("Proveedor no encontrado.");
        return;
    }

    if (flagAbm === "ALTA") {
        // ALTA: Crear un nuevo reactivo
        console.log("Ejecutando acción para ALTA");

        const unReactivo = {
            codigo,
            descripcion,
            proveedor: {
                codigo: proveedor.codigo,
                razonSocial: proveedor.razonSocial
            },
            stock,
            conservarCamara,
            fecha
        };

        // Verificar si el código ya existe
        if (sistema.reactivos.some(r => r.codigo === unReactivo.codigo)) {
            alert(`Ya existe un reactivo con el código: ${codigo}`);
            return;
        }

        // Agregar el nuevo reactivo al sistema y al localStorage
        sistema.reactivos.push(unReactivo);
        localStorage.setItem("reactivos", JSON.stringify(sistema.reactivos));

        // Actualizar la tabla
        //agregarFilaATabla(unReactivo);
        const nuevaFila = agregarFilaATabla(unReactivo);

        console.log("Reactivo agregado:", unReactivo);

        // Mensaje de éxito
        Toastify({
            text: "Reactivo ingresado correctamente.",
            duration: 2000,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, rgb(50, 61, 219), rgb(140, 118, 236))"
            }
        }).showToast();
        console.log("ALTA: " , nuevaFila , unReactivo)
        seleccionarFila(nuevaFila, unReactivo);

    } else {
        // MODIFICACION: Actualizar un reactivo existente
        console.log("Ejecutando acción para modificar");

        // Buscar el reactivo existente por su código
        const reactivo = sistema.reactivos.find(r => r.codigo === codigo);

        if (!reactivo) {
            alert("El reactivo no se encuentra en el sistema.");
            return;
        }

        // Actualizar los datos del reactivo
        reactivo.descripcion = descripcion;
        reactivo.proveedor = {
            codigo: proveedor.codigo,
            razonSocial: proveedor.razonSocial
        };
        reactivo.stock = stock;
        reactivo.conservarCamara = conservarCamara;
        reactivo.fecha = fecha;

        // Actualizar en el localStorage
        localStorage.setItem("reactivos", JSON.stringify(sistema.reactivos));

        // Actualizar la fila de la tabla
        const fila = document.querySelector(`#tablaReactivos tbody tr[data-codigo="${codigo}"]`);
        if (fila) {
            const celdas = fila.children;
            celdas[1].textContent = descripcion; // Columna Descripción
            celdas[2].textContent = proveedor.razonSocial; // Columna Proveedor
            celdas[3].textContent = stock; // Columna Stock
            celdas[4].textContent = conservarCamara ? "Sí" : "No"; // Columna Conservar en Cámara
            celdas[5].textContent = fecha; // Columna Fecha
        }

        // Mensaje de éxito
        Toastify({
            text: "Reactivo actualizado correctamente.",
            duration: 2000,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, rgb(50, 61, 219), rgb(140, 118, 236))"
            }
        }).showToast();
        // Seleccionar la fila modificada
        const filaModificada = document.querySelector(`#tablaReactivos tbody tr[data-codigo="${codigo}"]`);
        if (filaModificada) {
            seleccionarFila(filaModificada, reactivo);
        }

    }
    //

    DeshabilitarFormulario();
    agregarBtn.disabled = false;
    editarBtn.disabled = false;
    borrarBtn.disabled = false;

});

function inicializarPantallaReactivos() {
    // Cargar proveedores desde localStorage
    const proveedor = new Proveedor();
    proveedor.cargarProveedoresDesdeStorage();

    // Llenar el combobox de proveedores
    llenarComboboxProveedores();

    // Cargar reactivos desde localStorage
    const reactivo = new Reactivo();
    reactivo.cargarReactivosDesdeStorage();


    // Generar las filas de la tabla de reactivos
    generarFilasTablaReactivos();

    //HABILITAR BOTONES
    agregarBtn.disabled = false;
    editarBtn.disabled = false;
    borrarBtn.disabled = false;

}

function llenarComboboxProveedores() {
    const combobox = document.getElementById("proveedor");
    combobox.innerHTML = ""; // Limpiar las opciones existentes

    sistema.proveedores.forEach(proveedor => {
        const option = document.createElement("option");
        option.value = proveedor.codigo; // El código como valor de la opción
        option.textContent = `${proveedor.razonSocial}`;
        combobox.appendChild(option);
    });

}

function generarFilasTablaReactivos() {
    const tabla = document.querySelector("#tablaReactivos tbody");
    if (!tabla) {
        console.error("El elemento <tbody> de la tabla con ID 'tablaReactivos' no se encuentra en el DOM.");
        return;
    }

    // Limpiar las filas existentes
    tabla.innerHTML = "";

    // Generar filas basadas en el array `sistema.reactivos`
    sistema.reactivos.forEach((reactivo) => {
        const fila = document.createElement("tr");

        // Asociar un atributo para identificar la fila
        fila.setAttribute("data-codigo", reactivo.codigo);

        // Crear celdas con datos del reactivo
        const celdaCodigo = document.createElement("td");
        celdaCodigo.textContent = reactivo.codigo;

        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.textContent = reactivo.descripcion;

        const celdaProveedor = document.createElement("td");
        celdaProveedor.textContent = reactivo.proveedor.razonSocial || "Proveedor no encontrado";

        const celdaStock = document.createElement("td");
        celdaStock.textContent = reactivo.stock;

        const celdaCamara = document.createElement("td");
        celdaCamara.textContent = reactivo.conservarCamara ? "Sí" : "No";

        const celdaFecha = document.createElement("td");
        celdaFecha.textContent = reactivo.fecha;

        // Agregar celdas a la fila
        fila.appendChild(celdaCodigo);
        fila.appendChild(celdaDescripcion);
        fila.appendChild(celdaProveedor);
        fila.appendChild(celdaStock);
        fila.appendChild(celdaCamara);
        fila.appendChild(celdaFecha);

        // Evento para seleccionar una fila
        fila.addEventListener("click", () => seleccionarFila(fila, reactivo));

        // Agregar fila a la tabla
        tabla.appendChild(fila);
    });
}


function seleccionarFila(fila, reactivo) {
    console.log("seleccionarFila : " , fila);
    // Quitar selección previa
    const filas = document.querySelectorAll("#tablaReactivos tr");
    filas.forEach(f => f.classList.remove("selected"));

    // Agregar selección a la fila actual
    fila.classList.add("selected");

    // Rellenar el formulario con los datos del reactivo seleccionado
    document.getElementById("codigo").value = reactivo.codigo;
    document.getElementById("descripcion").value = reactivo.descripcion;
    document.getElementById("proveedor").value = reactivo.proveedor.codigo;
    document.getElementById("stock").value = reactivo.stock;
    document.getElementById("conservarCamara").checked = reactivo.conservarCamara;
    document.getElementById("fecha").value = reactivo.fecha;
}


const seleccionarPrimeraFila = () => {
    // Obtener la tabla
    const tabla = document.getElementById("tablaReactivos");

    // Verificar si hay filas en la tabla
    const filas = tabla.querySelectorAll("tbody tr");
    if (filas.length > 0) {
        // Seleccionar la primera fila
        const primeraFila = filas[0];

        // Obtener las celdas de la fila por orden
        const celdas = primeraFila.querySelectorAll("td");

        // Crear un objeto reactivo con los datos necesarios (por índice de celda)
        const reactivo = {
            codigo: primeraFila.dataset.codigo || "",
            descripcion: celdas[1]?.textContent.trim() || "",
            //proveedor: parseInt(celdas[2]?.textContent.trim()) || 1,

            proveedor: { codigo: parseInt(celdas[2]?.textContent.trim()) || 1, razonSocial: celdas[2]?.textContent.trim() }, // Asegurarte que proveedor es un objeto

            stock: celdas[3]?.textContent.trim() || 0,
            conservarCamara: primeraFila.dataset.conservarCamara === "true",
            fecha: celdas[5]?.textContent.trim() || ""
        };

        // Usar la función existente para seleccionar la fila
        seleccionarFila(primeraFila, reactivo);
    } else {
        console.log("La tabla no tiene filas.");
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
    const tablaBody = document.querySelector("#tablaReactivos tbody");
    tablaBody.innerHTML = ""; // Limpiar la tabla

    // Crear nuevas filas
    datos.forEach((reactivo) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${reactivo.codigo}</td>
            <td>${reactivo.descripcion}</td>
            <td>${reactivo.proveedor.razonSocial || completar}</td>
            <td>${reactivo.stock}</td>
            <td>${reactivo.conservarCamara ? "Sí" : "No"}</td>
            <td>${reactivo.fecha}</td>
        `;
        tablaBody.appendChild(fila);
    });
};

const buscarTabla = () => {
    const busqueda = document.getElementById("busqueda").value.toLowerCase(); // Texto en minúsculas
    const datosFiltrados = sistema.reactivos.filter((reactivo) => {
        return (
            reactivo.codigo.toString().toLowerCase().includes(busqueda) ||
            reactivo.descripcion.toLowerCase().includes(busqueda) ||
            reactivo.proveedor.razonSocial.toLowerCase().includes(busqueda) ||
            reactivo.stock.toString().toLowerCase().includes(busqueda) ||
            (reactivo.conservarCamara ? "sí" : "no").toLowerCase().includes(busqueda) ||
            reactivo.fecha.toLowerCase().includes(busqueda)
        );
    });
    if (datosFiltrados.length === 0) {
        // Si no hay resultados, resetea el formulario y muestra el mensaje adecuado
        resetFormulario();
        Toastify({
            text: "No hay resultados para la busqueda",
            duration: 2000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right,rgb(233, 38, 12),rgb(245, 228, 74))",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    } else {
        // Si hay resultados, actualiza la tabla y selecciona la primera fila
        actualizarTabla(datosFiltrados);
        seleccionarPrimeraFila();
    }

};


/**
 * CREAR EVENTO DEL BOTON DE BUSQUEDA buscarReactivo
 * 
 */
document.getElementById("buscarReactivo").addEventListener("click", buscarTabla);


document.addEventListener("DOMContentLoaded", () => {
    resetFormulario();
    agregarBtn.disabled = false;
    editarBtn.disabled = false;
    borrarBtn.disabled = false;
    inicializarPantallaReactivos();
    seleccionarPrimeraFila();
});


