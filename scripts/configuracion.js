document.getElementById("limpiarLocalStorage").addEventListener("click", function() {
    localStorage.clear();
    alert("Local Storage ha sido limpiado.");
});

document.getElementById("limpiarSessionStorage").addEventListener("click", function() {
    sessionStorage.clear();
    alert("Session Storage ha sido limpiado.");
});

document.getElementById("inicializarArrays").addEventListener("click", function() {
    sistema.proveedores = [];
    sistema.reactivos = [];
    alert("Los arrays han sido inicializados.");
});


// Cargar proveedores al presionar el botón
document.getElementById("cargarProveedores").addEventListener("click", function() {
cargarProveedoresAlStorage(); 
    alert("Proveedores cargados exitosamente.");
});

document.getElementById("cargarReactivos").addEventListener("click", function() {
    cargarReactivosAlStorage();
    alert("Reactivos cargados exitosamente.");
});