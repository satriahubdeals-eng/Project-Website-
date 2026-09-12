const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 8080;
const publicDirectory = path.resolve(__dirname);
const protectedPaths = ['/README.md', '/server.js', '/.git', '/.github', '/.vscode'];

const mimeTypes = {
    '.css': 'text/css; charset=UTF-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=UTF-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=UTF-8',
    '.webp': 'image/webp'
};

function sendText(response, statusCode, message) {
    response.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Content-Length': Buffer.byteLength(message)
    });
    response.end(message);
}

function resolveRequestedFile(requestUrl) {
    const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
    const requestedPath = pathname === '/' ? '/index.html' : pathname;

    if (protectedPaths.some((protectedPath) => requestedPath === protectedPath || requestedPath.startsWith(`${protectedPath}/`))) {
        return null;
    }

    const filePath = path.resolve(publicDirectory, `.${requestedPath}`);

    if (filePath !== publicDirectory && !filePath.startsWith(`${publicDirectory}${path.sep}`)) {
        return null;
    }

    return filePath;
}

const server = http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.setHeader('Allow', 'GET, HEAD');
        sendText(response, 405, 'Method Not Allowed');
        return;
    }

    let filePath;

    try {
        filePath = resolveRequestedFile(request.url);
    } catch {
        sendText(response, 400, 'Bad Request');
        return;
    }

    if (!filePath) {
        sendText(response, 403, 'Forbidden');
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            sendText(response, 404, 'Not Found');
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[extension] || 'application/octet-stream';
        response.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600'
        });

        if (request.method === 'HEAD') {
            response.end();
            return;
        }

        fs.createReadStream(filePath).on('error', () => {
            if (!response.headersSent) {
                sendText(response, 500, 'Internal Server Error');
                return;
            }
            response.destroy();
        }).pipe(response);
    });
});

server.listen(port, host, () => {
    console.log(`Website berjalan di http://localhost:${port}`);
    console.log(`Server dapat diakses pada host ${host}`);
});

function shutdown(signal) {
    console.log(`\n${signal} diterima. Menghentikan server...`);
    server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));