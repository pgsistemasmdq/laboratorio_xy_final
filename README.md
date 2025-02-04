# 🧪 Proyecto JavaScript - Coderhouse  
## Laboratorio XY - Entrega Final

El objetivo de este proyecto es simular un sistema **ABM** (Alta, Baja y Modificación) para gestionar **Reactivos de Laboratorio**.

---

## ⚙️ Funcionalidades principales

### 1. **Carga inicial**
- Se cargan los datos de proveedores, reactivos y movimientos desde archivos json al **Local Storage** utilizando fetch y promesas.  
- Los datos se guardan en los arrays globales `sistema.reactivos`, `sistema.proveedores`, `sistema.movimientos`.
- Este proceso se realiza únicamente si las claves necesarias no existen previamente en el **Local Storage**.
---
### 2. **Gestión de reactivos**
En la página **Reactivos**, se simula un sistema ABM con las siguientes operaciones:  

#### ➕ **Alta**
- Agrega un nuevo reactivo al array global.
- Actualiza la tabla de visualización.
- Guarda los cambios en el **Local Storage**.

#### ✏️ **Modificación**
- Permite editar un reactivo existente.
- Actualiza el array global, la tabla y el **Local Storage**.

#### ❌ **Borrar**
- Elimina un reactivo del array global.
- Remueve el reactivo de la tabla y actualiza el **Local Storage**.

#### 🔍 **Búsqueda**
- Permite buscar reactivos específicos dentro del sistema.
- Filtra los resultados de la tabla en tiempo real según el texto ingresado y alpulsar BUSCAR realiza la búsqueda.
- Utiliza coincidencias parciales para facilitar la identificación de reactivos.
---
### 3. **Movimientos de reactivos**
En la página **Movimientos**, se simula el movimiento de reactivo ingresando valores positivos com INGRESO y valores negativos como EGRESO.  

#### ➕ **Agregar movimiento**
- Actualiza stock del reactivo ingresado.
- Agrega un nuevo movimiento al array global.
- Actualiza la tabla de visualización que aparece mas abajo.
- Guarda los cambios en el **Local Storage**.

#### 🔍 **Búsqueda**
- Permite buscar movimientos específicos dentro del sistema.
- Filtra los resultados de la tabla en tiempo real según el texto ingresado y al pulsar BUSCAR realiza la búsqueda.
- Utiliza coincidencias parciales para facilitar la identificación de reactivos.
---
### 4. **Reporte de Movimientos ingresados**
En la página **Reportes**, se pueden listar los movimientos de reactivo.
Se puede filtar por distintas opciones como periodo, proveedor, reactivo, etc

---
### 5. **Tablero de indicadores**
En la página **Estadísticas**, se visualizan en tiempo real algunos indicadores de ejemplo.

---

### 🛠️ Otras funcionalidades
Cada vez que interactúas con el sistema, se asegura que los datos en el **Local Storage** se mantengan sincronizados y actualizados.

---
🌟 Tecnologías utilizadas
* HTML5
* CSS3
* JavaScript ES6
* Promesas
* Local Storage
---

## 📁 Cómo usar el proyecto
1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/pgsistemasmdq/laboratorio_xy_final.git
