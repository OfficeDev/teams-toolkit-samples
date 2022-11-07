import dns from "dns";

// use localhost by default, see https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim');

const SSL_KEY_FILE = process.env["SSL_KEY_FILE"];
const SSL_CRT_FILE = process.env["SSL_CRT_FILE"];

let options = undefined;
if (SSL_KEY_FILE && SSL_CRT_FILE) {
    options = {
        key: SSL_KEY_FILE,
        cert: SSL_CRT_FILE
    }
}

export default {
    base: '/teams-videoapp-sample/app/',
    build: {
        outDir: './dist/app'
    },
    server: {
        https: options || false,
        port: process.env["PORT"] || "53000"
    }
}
