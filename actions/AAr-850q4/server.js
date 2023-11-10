async function(properties, context) {
	const pdfutil = require("pdf-lib");
    
    // Store the PDF bytes
    const sourcebuffer = Buffer.from(properties.sourcepdf, "base64");

    // Asynchronous document load
    const promisesource = pdfutil.PDFDocument.load(sourcebuffer)
    .then((pdf) => { return { pagecount: pdf.getPageCount() }; });
    
    // Send
    return promisesource;
}