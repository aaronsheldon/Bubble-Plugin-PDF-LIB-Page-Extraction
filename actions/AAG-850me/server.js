function(properties, context) {
	var pdfutil = require("pdf-lib");
    
    // Store the PDF bytes
    var sourcebuffer = Buffer.from(properties.sourcepdf, "base64");
    
    // Asynchronous PDF processing
    var promisesource = pdfutil.PDFDocument.load(sourcebuffer);
    var sourcepdf = context.async(
        callback => promisesource
        .then(loadedpdf => callback(null, loadedpdf))
        .catch(reason => callback(reason))
    );
    
    // Initialize page loop
    var n = sourcepdf.getPageCount();
    var contents = [];
    
    // Create a document for each page
    for (var i = 0; i < n; i++) {
        var promisetarget = pdfutil.PDFDocument.create();
        var targetpdf = context.async(
            callback => promisetarget
            .then(newpdf => callback(null, newpdf))
            .catch(reason => callback(reason))
        );
        
        // Copy page
        var promisepage = targetpdf.copyPages(sourcepdf, [i]);
        var [targetpage] = context.async(
            callback => promisepage
            .then(extractedpage => callback(null, extractedpage))
            .catch(reason => callback(reason))
        );
        targetpdf.addPage(targetpage);
        
        // Save to UInt8 then to base 64
        var promisesave = targetpdf.save();
        var targetbuffer = context.async(
            callback => promisesave
            .then(savedpdf => callback(null, savedpdf))
            .catch(reason => callback(reason))
        );
        contents.push(Buffer.from(targetbuffer).toString("base64"));
    }
    
    // Send
    return { contents: contents };
}