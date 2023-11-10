async function(properties, context) {
	const pdfutil = require("pdf-lib");
    
    // Get the PDFs to merge
    const n = properties.sourcepdfs.length();
	const sourcepdfs = properties.sourcepdfs.get(0, n);
 
    // Create empty PDF
    const targetpdf = await pdfutil.PDFDocument.create();
    
    // Retrieve each PDF
    for (let i = 0; i < n; i++) {
        
    	// Store the PDF bytes
    	const sourcebuffer = Buffer.from(sourcepdfs[i], "base64");
        
        // Load the document
        const sourcepdf = await pdfutil.PDFDocument.load(sourcebuffer);
        
        // Pull the pages
        const sourcepages = await targetpdf.copyPages(sourcepdf, sourcepdf.getPageIndices());
        
        // Append each page
        const m = sourcepdf.getPageCount();
		for (let j = 0; j < m; j++) {
			targetpdf.addpage(sourcepages[j]);
		}
    }
    
    // Save to UInt8
    const targetbuffer = await targetpdf.save();
    
    // Default JSON payload
    const contents = Buffer.from(targetbuffer).toString("base64");
    
    // Send
    return { contents: contents };
}