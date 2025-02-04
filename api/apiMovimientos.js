const API_MOVIMIENTOS_URL = "../mocks/movimientos.json";  // URL del archivo JSON de los movimientos

function getMovimientos() {
    return new Promise((resolve, reject) => {
        const movimientosLocal = localStorage.getItem("movimientos");

        if (movimientosLocal) {
            // Si ya existen movimientos en localStorage, cargarlos directamente
            const movimientos = JSON.parse(movimientosLocal);
            sistema.movimientos = movimientos;
            resolve(movimientos);
        } else {
            // Primero, verificar que los proveedores estén cargados
            let proveedores = JSON.parse(localStorage.getItem("proveedores"));
            const cargarProveedores = proveedores
                ? Promise.resolve(proveedores)
                : getProveedores();  // Supone que tienes una función getProveedores()

            cargarProveedores
                .then(proveedoresCargados => {
                    if (!proveedores) {
                        localStorage.setItem("proveedores", JSON.stringify(proveedoresCargados));
                    }

                    // Luego, verificar que los reactivos estén cargados
                    let reactivos = JSON.parse(localStorage.getItem("reactivos"));
                    const cargarReactivos = reactivos
                        ? Promise.resolve(reactivos)
                        : getReactivos();  // Supone que tienes una función getReactivos()

                    cargarReactivos
                        .then(reactivosCargados => {
                            if (!reactivos) {
                                localStorage.setItem("reactivos", JSON.stringify(reactivosCargados));
                            }

                            // Finalmente, cargar los movimientos desde el JSON
                            fetch(API_MOVIMIENTOS_URL)  // Reemplaza con la URL de tu JSON
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error("Error al cargar movimientos desde el archivo JSON.");
                                    }
                                    return response.json();
                                })
                                .then(movimientos => {
                                    // Combinar cada movimiento con los datos de reactivos y proveedores
                                    const movimientosCompletos = movimientos.map(movimiento => {
                                        const reactivo = reactivosCargados.find(r => r.codigo === movimiento.reactivo.codigo);
                                        const proveedor = proveedoresCargados.find(p => p.codigo === movimiento.reactivo.proveedor.codigo);

                                        if (!reactivo || !proveedor) {
                                            console.error(`Reactivo o proveedor no encontrado para el movimiento número ${movimiento.numero}`);
                                            return null;
                                        }

                                        return {
                                            numero: movimiento.numero,
                                            reactivo: {
                                                codigo: reactivo.codigo,
                                                descripcion: reactivo.descripcion,
                                                proveedor: {
                                                    codigo: proveedor.codigo,
                                                    razonSocial: proveedor.razonSocial
                                                }
                                            },
                                            fecha: movimiento.fecha,
                                            movimiento: movimiento.movimiento
                                        };
                                    }).filter(Boolean);  // Eliminar movimientos nulos

                                    // Guardar en localStorage y actualizar el array global
                                    localStorage.setItem("movimientos", JSON.stringify(movimientosCompletos));
                                    sistema.movimientos = movimientosCompletos;

                                    resolve(movimientosCompletos);
                                })
                                .catch(error => {
                                    console.error("Error al cargar movimientos:", error);
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            console.error("Error al cargar reactivos:", error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.error("Error al cargar proveedores:", error);
                    reject(error);
                });
        }
    });
}
