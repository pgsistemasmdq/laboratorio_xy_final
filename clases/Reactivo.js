class Reactivo {
    constructor(codigo, descripcion, proveedor, stock, conservarCamara, fecha) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.proveedor = proveedor;
        this.stock = stock;
        this.conservarCamara = conservarCamara;
        this.fecha = fecha;
    }

    toString() {
        return `${this.descripcion} (${this.codigo}) - Stock actual ${this.stock}`;
    }

    // Método para agregar reactivos, gestionado desde un contexto global
    agregarReactivo(codigo, descripcion, proveedor, stock, conservarCamara, fecha) {

        if (sistema.reactivos.some(reactivo => reactivo.codigo === codigo)) {
            alert(`Ya existe un reactivo con el código: ${codigo}`);
            return;
        }

        const nuevoReactivo = new Reactivo(parseInt(codigo), descripcion, parseInt(proveedor), parseInt(stock), conservarCamara, fecha);
        sistema.reactivos.push(nuevoReactivo);

        // Guardar los reactivos después de agregar
        this.guardarReactivosEnStorage();

    }

    // Método para guardar los reactivos en localStorage y sessionStorage
    guardarReactivosEnStorage() {
        // Guardar en localStorage
        localStorage.setItem("reactivos", JSON.stringify(sistema.reactivos));
    }

    cargarReactivosDesdeStorage() {
        return new Promise((resolve, reject) => {
            try {
                const reactivosLocal = localStorage.getItem("reactivos");
                if (reactivosLocal) {
                    sistema.reactivos = JSON.parse(reactivosLocal);
                    console.log("Reactivos cargados desde localStorage en la clase Reactivo.");
                    resolve(sistema.reactivos);
                } else {
                    console.warn("No se encontraron reactivos en localStorage.");
                    resolve([]);  // Resolver con un array vacío si no hay datos
                }
            } catch (error) {
                reject("Error al cargar reactivos desde el storage: " + error);
            }
        });
    }

    listarReactivos() {
        return sistema.reactivos.map(reactivo => {
            const proveedor = sistema.proveedores.find(p => p.codigo === reactivo.proveedor);
            const razonSocial = proveedor ? proveedor.razonSocial : "Proveedor no encontrado";
            return `Reactivo: ${reactivo.descripcion} (${reactivo.codigo}), Proveedor: ${razonSocial}, Stock: ${reactivo.stock}, Fecha: ${reactivo.fecha}`;
        }).join("\n");
    }


    obtenerStock() {
        return `Stock actual: ${this.stock}`;
    }

}

