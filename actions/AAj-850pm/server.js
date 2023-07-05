function(properties, context) {
	var pdfutil = require("pdf-lib");
    
    // Store the PDF bytes
    var sourcebuffer = Buffer.from(properties.sourcepdf, "base64");

    // Document load
    var promisesource = pdfutil.PDFDocument.load(sourcebuffer);
    var sourcepdf = context.async(
    	callback => promisesource
        .then(loadedpdf => callback(null, loadedpdf))
        .catch(reason => callback(reason))
    );
    
    // New document
    var promisetarget = pdfutil.PDFDocument.create();
    var targetpdf = context.async(
    	callback => promisetarget
        .then(newpdf => callback(null, newpdf))
        .catch(reason => callback(reason))
    );
    
    // Page copy
    var promisepage = targetpdf.copyPages(sourcepdf, [properties.pagenumber-1]);
    var [targetpage] = context.async(
    	callback => promisepage
        .then(extractedpage => callback(null, extractedpage))
        .catch(reason => callback(reason))
    );
    targetpdf.addPage(targetpage);
    
    // Write bytes
    var promisesave = targetpdf.save();
    var targetbuffer = context.async(
    	callback => promisesave
        .then(savedpdf => callback(null, savedpdf))
        .catch(reason => callback(reason))
    );
    
    // Send
    return { contents: Buffer.from(targetbuffer).toString("base64") };
}