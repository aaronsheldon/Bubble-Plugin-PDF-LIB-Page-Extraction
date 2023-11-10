async function(properties, context) {
	const pdfutil = require("pdf-lib");
    
    // Store the PDF bytes
    const sourcebuffer = Buffer.from(properties.sourcepdf, "base64");
    
    // Asynchronous PDF processing
    const sourcepdf = await pdfutil.PDFDocument.load(sourcebuffer);
    const n = sourcepdf.getPageCount();
    const contents = [];
   
    // Create a document for each page
    for (let i = 0; i < n; i++) {
        const targetpdf = await pdfutil.PDFDocument.create();
        
        // Copy page
        const [targetpage] =  await targetpdf.copyPages(sourcepdf, [i]);
        targetpdf.addPage(targetpage);
        
        // Save to UInt8 then to base 64
        const targetbuffer = await targetpdf.save();
        contents.push(Buffer.from(targetbuffer).toString("base64"));
    }
    
    // Send
    return { contents: contents };
}