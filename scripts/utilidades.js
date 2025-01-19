document.addEventListener("DOMContentLoaded", () => {

    // Mostrar fecha y hora en tiempo real
    const updateDateTime = () => {
        const now = new Date();
        document.getElementById("dateTime").textContent = now.toLocaleString("es-ES");
    };
    setInterval(updateDateTime, 1000);
    updateDateTime();

    
});
