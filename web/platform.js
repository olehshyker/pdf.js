console.log("[PDFHandler] Script injected and running...");

// Wait for PDF.js to signal it's ready
document.addEventListener("webviewerloaded", async () => {
    console.log("[PDFHandler] webviewerloaded event fired.");

    // Define a global method to load PDF from Base64
    window.loadPDF = (pdf) => {
        console.log("[PDFHandler] loadPDF called. PDF length:", pdf.length);
        try {
            const uint8Array = Uint8Array.from(atob(pdf), byte => byte.charCodeAt(0));
            console.log("[PDFHandler] Converted Base64 to Uint8Array of length:", uint8Array.length);
            PDFViewerApplication.open(uint8Array);
            console.log("[PDFHandler] PDF successfully opened in viewer.");
        } catch (err) {
            console.error("[PDFHandler] Error loading PDF:", err);
        }
    };

    // Wait for PDF.js core initialization
    console.log("[PDFHandler] Waiting for PDFViewerApplication.initializedPromise...");
    await PDFViewerApplication.initializedPromise;
    console.log("[PDFHandler] PDFViewerApplication initialized.");

    // Disable print
    window.print = () => {
        console.log("[PDFHandler] Print function disabled.");
    };

    // Hook eventBus to disable download & openfile
    let eventBus = PDFViewerApplication.eventBus;
    if (eventBus && eventBus.dispatch) {
        console.log("[PDFHandler] Hooking eventBus.dispatch...");
        let oldDispatch = eventBus.dispatch;
        eventBus.dispatch = function (...parameters
