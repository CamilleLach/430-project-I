//Some code in this file is heavily inspired by or borrowed from my HTTP API Assignment II.
//I reused the file reading and static response structure
//But the file was expanded to serve the additional pages

const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const clientJS = fs.readFileSync(`${__dirname}/../client/client.js`);
const pokemonHTML = fs.readFileSync(`${__dirname}/../client/pokemon.html`);
const pokemonJS = fs.readFileSync(`${__dirname}/../client/pokemon.js`);
const documentationHTML = fs.readFileSync(`${__dirname}/../client/documentation.html`);

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

//send client js to browser
const getClientJS = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': clientJS.length,
    });

    if (request.method !== 'HEAD') {
        response.write(clientJS);
    }

    response.end();
};

//pokemon individual page
const getPokemonPage = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': pokemonHTML.length,
    });

    if (request.method !== 'HEAD') {
        response.write(pokemonHTML);
    }

    response.end();
};

//pokemon page javascript
const getPokemonJS = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': pokemonJS.length,
    });

    if (request.method !== 'HEAD') {
        response.write(pokemonJS);
    }

    response.end();
};
//documentation page
const getDocumentation = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': documentationHTML.length,
    });

    if (request.method !== 'HEAD') {
        response.write(documentationHTML);
    }

    response.end();
};


module.exports = {
    getIndex,
    getCSS,
    getClientJS,
    getPokemonPage,
    getPokemonJS,
    getDocumentation,
};
