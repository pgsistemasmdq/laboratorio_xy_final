const API_PROVEEDORES_URL = "../mocks/proveedores.json";

// Obtener proveedores desde el JSON utilizando Promesas
function getProveedores() {
    return new Promise((resolve, reject) => {
        const proveedoresLocal = localStorage.getItem("proveedores");

        if (proveedoresLocal) {
            // Si ya existen proveedores en localStorage, cargar desde ahí
            const proveedores = JSON.parse(proveedoresLocal);
            sistema.proveedores = proveedores;  // Actualizar el array global
            resolve(proveedores);
        } else {
            // Si no existen, obtener desde el archivo JSON
            fetch(API_PROVEEDORES_URL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al cargar proveedores desde el archivo JSON.");
                    }
                    return response.json();
                })
                .then(data => {
                    const proveedores = data.map(p =>
                        new Proveedor(p.codigo, p.razonSocial, p.telefono, p.mail)
                    );

                    // Guardar en localStorage y actualizar el array global
                    localStorage.setItem("proveedores", JSON.stringify(proveedores));
                    sistema.proveedores = proveedores;

                    resolve(proveedores);
                })
                .catch(error => {
                    console.error("Error en getProveedores:", error);
                    reject([]);  
                });
        }
    });
}
