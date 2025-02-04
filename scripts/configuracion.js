document.getElementById("limpiarLocalStorage").addEventListener("click", function() {
    localStorage.clear();
    alert("Local Storage ha sido limpiado.");
});

document.getElementById("limpiarSessionStorage").addEventListener("click", function() {
    sessionStorage.clear();
    alert("Session Storage ha sido limpiado.");
});
