function(properties, context) {
	var pdfutil = require("pdf-lib");
    
    // Get the PDFs to merge
    var n = properties.sourcepdfs.length();
	var sourcepdfs = properties.sourcepdfs.get(0, n);
 
    // Create empty PDF
    var promisetarget = pdfutil.PDFDocument.create();
    var targetpdf = context.async(
        callback => promisetarget
        .then(newpdf => callback(null, newpdf))
        .catch(reason => callback(reason))
    );
    
    // Retrieve each PDF
    for (var i = 0; i < n; i++) {
        
    	// Store the PDF bytes
    	var sourcebuffer = Buffer.from(sourcepdfs[i], "base64");
        
        // Load the document
        var promisesource = pdfutil.PDFDocument.load(sourcebuffer);
        var sourcepdf = context.async(
        	callback => promisesource
            .then(loadedpdf => callback(null, loadedpdf))
            .catch(reason => callback(reason))
    	);
        
        // Pull the pages
        var promisepages = targetpdf.copyPages(sourcepdf, sourcepdf.getPageIndices());
        var sourcepages = context.async(
        	callback => promisepages
            .then(extractedpages => callback(null, extractedpages))
            .catch(reason => callback(reason))
    	);
        
        // Append each page
        var m = sourcepdf.getPageCount();
		for (var j = 0; j < m; j++) {
			targetpdf.addpage(sourcepages[j]);
		}
    }
    
    // Save to UInt8
    var promisesave = targetpdf.save();
    var targetbuffer = context.async(
        callback => promisesave
        .then(savedpdf => callback(null, savedpdf))
        .catch(reason => callback(reason))
    );
    
    // Default JSON payload
    var contents = Buffer.from(targetbuffer).toString("base64");
    
    // Send
    return { contents: contents };
}