import { CodeParser } from "dynamsoft-code-parser";
CodeParser.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-code-parser@1.1.0/dist/";

// Please contact Dynamsoft Support (support@dynamsoft.com) to acquire a trial license for Dynamsoft Code Parser
CodeParser.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNTA3MDI4LVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNTA3MDI4IiwiY2hlY2tDb2RlIjotOTE0NDIyMjIzfQ==";

(async () =>{
    try {
        await CodeParser.loadWasm();
    } catch (ex) {
        const msg = ex.message || ex;
        console.error(msg);
        alert(msg);
    }
})();