async function(properties, context) {
	const pdfutil = require("pdf-lib");
    
    // Store the PDF bytes
    const sourcebuffer = Buffer.from(properties.sourcepdf, "base64");

    // Document load
    const promisesource = pdfutil.PDFDocument.load(sourcebuffer);
    
    // New document
    const promisetarget = pdfutil.PDFDocument.create();
    
    // Page copy
    const promisepage = Promise.all([promisesource, promisetarget])
    .then(([source, target]) => { return target.copyPages(source, [properties.pagenumber-1]); });
    
    // Page insert
    const promisesave = Promise.all([promisetarget, promisepage])
    .then(
        ([target, page]) => {
            target.addPage(page);
            return target.save();
        }
    )
    .then((saved) => { return { contents: Buffer.from(saved).toString("base64") }; });
    
    // Send
    return promisesave;
}