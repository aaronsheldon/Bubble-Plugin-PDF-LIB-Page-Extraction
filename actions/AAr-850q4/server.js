function(properties, context) {
	var pdfutil = require("pdf-lib");
    
    // Store the PDF bytes
    var sourcebuffer = Buffer.from(properties.sourcepdf, "base64");

    // Asynchronous document load
    var promisesource = pdfutil.PDFDocument.load(sourcebuffer);
    var sourcepdf = context.async(
        callback => promisesource
        .then(loadedpdf => callback(null, loadedpdf))
        .catch(reason => callback(reason))
    );
    
    // Send
    return { pagecount: sourcepdf.getPageCount() };
}