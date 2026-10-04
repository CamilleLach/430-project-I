
const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

//send html to browser
const getIndex = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': index.length,
    });

    if (request.method !== 'HEAD') {
        response.write(index);
    }

    response.end();
};

//send css to browser
const getCSS = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/css',
        'Content-Length': css.length,
    });

    if (request.method !== 'HEAD') {
        response.write(css);
    }

    response.end();
};

module.exports = {
    getIndex,
    getCSS,
};
