// =============================================
// ADMIN DASHBOARD LOGIC (Simulazione di Backend)
// Questo script carica e visualizza i dati che un server API 
// ci fornirebbe leggendo il database reale.
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    const appuntamentiBody = document.getElementById('appuntamentiBody');

    // --- Dati Simulati del Database (Mock Data) ---
    // Questi dati simulano ciò che verrebbe letto da bookings_log.json in un ambiente backend reale.
    const MOCK_BOOKINGS = [
        { 
            id: 1678886400000, 
            dataPrenotazione: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)).toISOString(), // Appuntamento di ieri
            datiCliente: { nomeCognome: "Mario Rossi", telefono: "33312345678" },
            servizio: "Balayage",
            appuntamento: { data: "15/10/2024", orario: "14:30" }
        },
        { 
            id: Date.now(), // Appuntamento di oggi (il più recente)
            dataPrenotazione: new Date().toISOString(), 
            datiCliente: { nomeCognome: "Giulia Bianchi", telefono: "32098765432" },
            servizio: "Piega Capelli",
            appuntamento: { data: getFormattedDate(new Date()), orario: "10:00" }
        }
    ];

    // Utility per formattare la data del mock nel formato DD/MM/YYYY
    function getFormattedDate(dateObj) {
        const date = new Date(dateObj);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }


    function renderAppuntamenti(bookings) {
        // Pulizia della tabella prima di iniettare i dati
        appuntamentiBody.innerHTML = '';

        if (bookings.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center; color: #888;">Nessun appuntamento trovato.</td>`;
            appuntamentiBody.appendChild(row);
            return;
        }

        // Ordina i dati dal più recente al più vecchio
        bookings.sort((a, b) => b.id - a.id); 

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // 1. ID (Timestamp per debug)
            const idCell = document.createElement('td');
            idCell.textContent = booking.id;

            // 2. Cliente
            const clientCell = document.createElement('td');
            clientCell.innerHTML = `<strong>${booking.datiCliente.nomeCognome}</strong><br><small>Tel: ${booking.datiCliente.telefono}</small>`;

            // 3. Servizio
            const servizioCell = document.createElement('td');
            servicioCell.textContent = booking.servizio.toUpperCase().replace('-', ' ');

            // 4. Data e Ora
            const appuntamentoCell = document.createElement('td');
            appuntamentoCell.innerHTML = `<strong>${booking.appuntamento.data}</strong><br><small>Alle ${booking.appuntamento.orario}</small>`;

            // 5. Stato (Simulazione)
            const statoCell = document.createElement('td');
            // Logica di stato: assumiamo che se l'ID è più recente, è "Pianificato/Prenotato"
            statoCell.innerHTML = `<span class="status-badge status-prenotato">PRENOTATO</span>`;


            row.appendChild(idCell);
            row.appendChild(clientCell);
            row.appendChild(servicioCell);
            row.appendChild(appuntamentoCell);
            row.appendChild(statoCell);

            appuntamentiBody.appendChild(row);
        });
    }

    // Esegui il rendering non appena la pagina è caricata
    renderAppuntamenti(MOCK_BOOKINGS);
})();