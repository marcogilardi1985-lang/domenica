document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const messageDiv = document.getElementById('message');
    // Nota importante per la simulazione di ambiente non browser (come un backend)
    const LOG_FILE_PATH = 'bookings_log.json'; 

    // --- Helper Functions ---

    function showMessage(text, type) {
        console.warn(`[UI Message ${type}] ${text}`); // Useremos la console per il logging visibile
        messageDiv.textContent = text;
        messageDiv.className = ''; 
        messageDiv.classList.add(type); 
        messageDiv.style.display = 'block';
    }

    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    }

    // --- Funzione di Salvataggio Dati (Simulazione Backend) ---
    async function saveBookingToLog(bookingData) {
        console.log("================================================");
        console.log(`[BACKEND LOG] Tentativo di salvare i dati in ${LOG_FILE_PATH}`);
        try {
            // Simuliamo la lettura del file JSON (per ora, assumiamo che funzioni)
            let currentLog = [];
            const existingContent = await fetchFileContent(LOG_FILE_PATH); // Funzione mock
            
            if (existingContent && typeof existingContent === 'string') {
                try {
                    currentLog = JSON.parse(existingContent);
                } catch (e) {
                    console.error("ERRORE PARSING LOG: Inizializzazione array vuoto.");
                    currentLog = [];
                }
            }

            // Aggiunge il nuovo record
            const newEntry = {
                id: Date.now(), 
                dataPrenotazione: new Date().toISOString(),
                datiCliente: {
                    nomeCognome: bookingData.nomeCognome,
                    telefono: bookingData.telefono
                },
                servizio: bookingData.servizio,
                appuntamento: {
                    data: bookingData.dataAppuntamento,
                    orario: bookingData.orario
                }
            };
            currentLog.push(newEntry);

            // Salvataggio simulato del contenuto aggiornato (Questa linea simula l'azione di scrittura sul DB/File)
            const newContent = JSON.stringify(currentLog, null, 4);
            await writeFileContent(LOG_FILE_PATH, newContent);
            console.log("✅ PRENOTAZIONE SALVATA SIMULATORIAMENTE nel database log.");
            return true;

        } catch (error) {
            console.error("ERRORE FATALE durante il salvataggio del log:", error);
            showMessage(`Errore di sistema: non siamo riusciti a salvare la prenotazione nel database simulato. Contatta l'amministratore.`, "error");
            return false;
        }
    }

    // --- Funzioni Mock per simulare le operazioni I/O File System ---
    async function fetchFileContent(path) {
        console.warn("\n*** SIMULAZIONE FILE SYSTEM ***: Lettura del file log JSON.");
        // In un ambiente reale, qui ci sarebbe la chiamata API al DB. Qui usiamo localStorage per simulare il successo della lettura/scrittura.
        return localStorage.getItem(path) || "[]"; 
    }

    async function writeFileContent(path, content) {
        console.warn("*** SIMULAZIONE FILE SYSTEM ***: Scrittura del file log JSON.");
        localStorage.setItem(path, content); // Simula lo salvataggio nel database/file
    }

    // --- Listener Principale del Form ---
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        hideMessage();

        const nomeCognome = document.getElementById('nomeCognome').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const servizio = document.getElementById('servizio').value;
        const dataAppuntamento = document.getElementById('dataAppuntamento').value;
        const orario = document.getElementById('orario').value;

        // 1. Validazione dei campi
        if (!nomeCognome || !telefono || !servizio || !dataAppuntamento || !orario) {
            showMessage("Per favore, compila tutti i campi obbligatori per poter prenotare.", "error");
            return;
        }

        const bookingData = {
            nomeCognome: nomeCognome,
            telefono: telefono,
            servizio: servizio,
            dataAppuntamento: dataAppuntamento,
            orario: orario
        };

        // 2. Tentativo di salvataggio dei dati (Questa chiamata è quella che deve funzionare)
        const successoSalvamento = await saveBookingToLog(bookingData);


        if (successoSalvamento) {
            // Se il salvataggio ha successo (anche se solo simulato), mostriamo la conferma all'utente.
            const messaggioSuccesso = `🎉 Prenotazione confermata! Abbiamo ricevuto i tuoi dati: ${nomeCognome} ha prenotato un servizio di ${servizio.toUpperCase()} per il ${dataAppuntamento} alle ${orario}. Ti invieremo una conferma via email/WhatsApp!`;
            showMessage(messaggioSuccesso, "success");
            bookingForm.reset(); // Resetta tutti i campi del form dopo successo
        } else {
             // L'errore è già stato mostrato da saveBookingToLog
        }
    });
})();