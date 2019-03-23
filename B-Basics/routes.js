const fs = require('fs');

function requestHandler(req, res) {
    res.setHeader('Content-Type', 'text/html');

    if (req.url === '/') {
        res.write('<body><form action="/message" method="POST">' +
            '<input type="text" name="message">' +
            '<button type="submit">Send</button>' +
            '</form></body>');

        return res.end();
    }

    if (req.url === '/message' && req.method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            fs.writeFile('message.txt', message, () => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
}

module.exports = requestHandler;
