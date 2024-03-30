const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('public/index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Archivo HTML no encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/multiplicar') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { matrices } = JSON.parse(body);
            const result = multiplyMatrices(matrices[0], matrices[1]);
            if (result.error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: result.error }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ result }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Ruta no encontrada');
    }
});

function multiplyMatrices(matrix1, matrix2) {
    const m = matrix1.length;
    const n = matrix2[0].length;
    const p = matrix2.length;

    if (matrix1[0].length !== p) {
        return { error: 'Las matrices no son compatibles para la multiplicación' };
    }

    const result = [];
    for (let i = 0; i < m; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < p; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}/`);
});
