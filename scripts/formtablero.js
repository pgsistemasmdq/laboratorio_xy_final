


document.addEventListener("DOMContentLoaded", () => {
    CargarDatos();

});


function CargarDatos() {
    getProveedores()
        .then(proveedores => {
            return getReactivos();
        })
        .then(reactivos => {
            return getMovimientos();
        })
        .then(movimientos => {
            calcularTablero();
        })
        .catch(error => {
            console.error("Error al inicializar el sistema:", error);
        });

}

function calcularTablero() {


    const totalMovimientos = sistema.movimientos.length;
    const movimientosEntrada = sistema.movimientos.filter(mov => mov.movimiento > 0).length;
    const movimientosSalida = sistema.movimientos.filter(mov => mov.movimiento < 0).length;

    const fechaMayorMovimiento = sistema.movimientos.reduce((max, current) => Math.abs(current.movimiento) > Math.abs(max.movimiento) ? current : max).fecha;

    document.getElementById("totalMovimientos").querySelector("p").textContent = totalMovimientos;
    document.getElementById("movimientosEntrada").querySelector("p").textContent = movimientosEntrada;
    document.getElementById("movimientosSalida").querySelector("p").textContent = movimientosSalida;
    document.getElementById("fechaMayorMovimiento").querySelector("p").textContent = fechaMayorMovimiento;


}