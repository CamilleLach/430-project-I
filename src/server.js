//Some code in this file is heavily inspired by or borrowed from my HTTP API Assignment II. 
//ParseBody() is mostly the same, and the structure of handlePost() and handleGet(), though these were heavily edited. 
// The files may have started out similar, but I think at some point it has changed so much it's difficult to credit specific lines.

const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//sned a JSON error response
const sendError = (response, status, object) => {
    const content = JSON.stringify(object);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    response.end(content);
};

// parse body data
const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);

        if (!response.headersSent) {
            return sendError(response, 400, {
                message: 'An error occurred while reading the request.',
                id: 'requestError',
            });
        }

        return response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        if (type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
        } else if (type === 'application/json') {
            try {
                request.body = JSON.parse(bodyString);
            } catch {
                return sendError(response, 400, {
                    message: 'Invalid JSON data.',
                    id: 'invalidJSON',
                });
            }
        }else {
            return sendError(response, 400, {
                message: 'Invalid data format.',
                id: 'invalidFormat',
            });
        } 
        if (
            request.body === null
            || typeof request.body !== 'object'
            || Array.isArray(request.body)
        ) {
            return sendError(response, 400, {
                message: 'Invalid request body.',
                id: 'invalidParams',
            });
        }

        return handler(request, response);
    });
};

//handle post requests (changes)
const handlePost = (request, response, parsedUrl) => {
    switch (parsedUrl.pathname) {
        case '/addPokemon':
            return parseBody(request, response, jsonHandler.addPokemon);

        case '/updatePokemon':
            return parseBody(request, response, jsonHandler.updatePokemon);

        default:
            return jsonHandler.notFound(request, response);
    }
};

//handle get/head requests (get information)
const handleGet = (request, response, parsedUrl) => {
    switch (parsedUrl.pathname) {
        case '/':
            return htmlHandler.getIndex(request, response);

        case '/style.css':
            return htmlHandler.getCSS(request, response);

        case '/client.js':
            return htmlHandler.getClientJS(request, response);

        case '/documentation.html':
            return htmlHandler.getDocumentation(request, response);

        case '/getPokemon':
            return jsonHandler.getPokemon(request, response);

        case '/getPokemonByName':
            return jsonHandler.getPokemonByName(
                request,
                response,
                parsedUrl.query,
            );
        case '/getPokemonById':
            return jsonHandler.getPokemonById(
                request,
                response,
                parsedUrl.query,
            );

        case '/getPokemonByType':
            return jsonHandler.getPokemonByType(
                request,
                response,
                parsedUrl.query,
            );
        case '/getWeaknesses':
            return jsonHandler.getWeaknesses(
                request,
                response,
                parsedUrl.query,
            );
        case '/pokemon.html':
            return htmlHandler.getPokemonPage(request, response);

        case '/pokemon.js':
            return htmlHandler.getPokemonJS(request, response);

        default:
            return jsonHandler.notFound(request, response);
    }
};


//handle http requests
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    if (request.method === 'POST') {
        return handlePost(request, response, parsedUrl);
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
        return handleGet(request, response, parsedUrl);
    }

    return jsonHandler.notFound(request, response);
};

//create server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
