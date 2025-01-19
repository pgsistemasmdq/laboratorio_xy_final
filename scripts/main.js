const sistema = {
    proveedores: [],
    reactivos: [],
};

// Cargar los proveedores definidos en constantes al localStorage si no existen
const cargarProveedoresAlStorage = () => {
    const key = "proveedores";
    const storedProveedores = localStorage.getItem(key);

    if (storedProveedores) {
        console.log("El array de proveedores existe en el localStorage.");
        // Convertir el JSON almacenado de vuelta a un objeto
        sistema.proveedores = JSON.parse(storedProveedores);
        console.log("Proveedores cargados:", sistema.proveedores);
    } else {
        console.log("El array de proveedores no existe en el localStorage.");
        localStorage.setItem(key, JSON.stringify(PROVEEDOR_FROM_CONSTANT));
        sistema.proveedores = [...PROVEEDOR_FROM_CONSTANT]; // Asignar directamente los datos
        console.log("Proveedores inicializados y cargados:", sistema.proveedores);
    }
};

// Cargar los reactivos definidos en constantes al localStorage si no existen
const cargarReactivosAlStorage = () => {
    console.table(sistema.proveedores); // Verificar que los proveedores están cargados
    const key = "reactivos";
    const storedReactivos = localStorage.getItem(key);

    if (storedReactivos) {
        console.log("El array de reactivos ya existe en el localStorage.");
        sistema.reactivos = JSON.parse(storedReactivos);
        console.log("Reactivos cargados:", sistema.reactivos);
    } else {
        console.log("El array de reactivos no existe en el localStorage.");

        // Crear reactivos con información completa del proveedor
        const reactivosConProveedores = REACTIVO_FROM_CONSTANT.map(reactivo => {
            // Buscar el proveedor correspondiente
            const proveedor = sistema.proveedores.find(p => p.codigo === reactivo.proveedor);
            if (!proveedor) {
                console.error(`Proveedor no encontrado para el reactivo con código ${reactivo.codigo}`);
                return null;
            }

            // Crear el objeto `unReactivo`
            const unReactivo = {
                codigo: reactivo.codigo,
                descripcion: reactivo.descripcion,
                proveedor: {
                    codigo: proveedor.codigo,
                    razonSocial: proveedor.razonSocial
                },
                stock: reactivo.stock,
                conservarCamara: reactivo.conservarCamara,
                fecha: reactivo.fecha
            };
            return unReactivo;
        }).filter(Boolean); // Filtrar elementos nulos si algún proveedor no fue encontrado

        // Guardar los reactivos en el localStorage
        localStorage.setItem(key, JSON.stringify(reactivosConProveedores));
        sistema.reactivos = reactivosConProveedores;
        console.log("Reactivos inicializados y cargados:", sistema.reactivos);
    }
};

// Inicializar la carga
cargarProveedoresAlStorage();
cargarReactivosAlStorage();
