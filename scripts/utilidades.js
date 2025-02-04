function mensajeAlert(msj, color1 = "rgb(50, 61, 219)", color2 = "rgb(140, 118, 236)") {
    Toastify({
        text: msj,
        duration: 2000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {
            background: `linear-gradient(to right, ${color1}, ${color2})`
        }
    }).showToast();
}


document.addEventListener("DOMContentLoaded", () => {

    // Mostrar fecha y hora en tiempo real
    const updateDateTime = () => {
        const now = new Date();
        document.getElementById("dateTime").textContent = now.toLocaleString("es-ES");
    };
    setInterval(updateDateTime, 1000);
    updateDateTime();

    
});


