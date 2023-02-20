{
    const hc = require("./lib/strHashCode.js") ;
    const pckg = require("./package.json");
    const phc = require("./lib/payloadHashCode");
    exports.strHashCode = hc.strHashCode ;
    exports.polyfill = hc.polyfill ;
    exports.version = pckg.version;
    exports.name = pckg.name;
    exports.calculatePayloadHashCode = phc.calculatePayloadHashCode;
    exports.extractPayload = phc.extractPayload ;
}
