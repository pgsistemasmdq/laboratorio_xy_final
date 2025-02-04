const API_REACTIVOS_URL = "../mocks/reactivos.json";

function getReactivos() {
    return new Promise((resolve, reject) => {
        const reactivosLocal = localStorage.getItem("reactivos");

        if (reactivosLocal) {
            // Si ya existen reactivos en localStorage, cargarlos directamente
            const reactivos = JSON.parse(reactivosLocal);
            sistema.reactivos = reactivos;  // Actualizar el array global
            resolve(reactivos);
        } else {
            // Si no existen, obtener desde el archivo JSON
            fetch(API_REACTIVOS_URL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al cargar reactivos desde el archivo JSON.");
                    }
                    return response.json();
                })
                .then(reactivos => {
                    // Verificar si los proveedores están cargados
                    let proveedores = JSON.parse(localStorage.getItem("proveedores"));

                    const cargarProveedores = proveedores
                        ? Promise.resolve(proveedores)
                        : getProveedores();

                    cargarProveedores
                        .then(proveedoresCargados => {
                            if (!proveedores) {
                                localStorage.setItem("proveedores", JSON.stringify(proveedoresCargados));
                            }

                            // Combinar reactivos con los datos del proveedor correspondiente
                            const reactivosConProveedores = reactivos.map(reactivo => {
                                const proveedor = proveedoresCargados.find(p => p.codigo === reactivo.proveedor);
                                if (!proveedor) {
                                    console.error(`Proveedor no encontrado para el reactivo con código ${reactivo.codigo}`);
                                    return null;
                                }

                                return {
                                    codigo: reactivo.codigo,
                                    descripcion: reactivo.descripcion,
                                    proveedor: {
                                        codigo: proveedor.codigo,
                                        razonSocial: proveedor.razonSocial,
                                    },
                                    stock: reactivo.stock,
                                    conservarCamara: reactivo.conservarCamara,
                                    fecha: reactivo.fecha
                                };
                            }).filter(Boolean);  // Filtra los valores nulos

                            // Guardar en localStorage y actualizar el array global
                            localStorage.setItem("reactivos", JSON.stringify(reactivosConProveedores));
                            sistema.reactivos = reactivosConProveedores;

                            resolve(reactivosConProveedores);
                        })
                        .catch(error => {
                            console.error("Error al cargar proveedores:", error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.error("Error al obtener los reactivos:", error);
                    reject(error);
                });
        }
    });
}
