
const dataManager = require('./dataManager.js');


//helper function to convert a string into an array if needed
const parseArrayField = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim());
    }

    return null;
};


//function to respond with a json object
const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    const headers = {
        'Content-Type': 'application/json',
    };

    //if it's not 204 (contains body)
    if (status !== 204) {
        headers['Content-Length'] = Buffer.byteLength(content, 'utf8');
    }

    response.writeHead(status, headers);

    //if it does contain a body, not head or 204
    if (request.method !== 'HEAD' && status !== 204) {
        response.write(content);
    }

    response.end();
};

//returns all pokemon
const getPokemon = (request, response) => {
    const pokemon = dataManager.getAllPokemon();

    const responseJSON = {
        pokemon,
    };

    return respondJSON(request, response, 200, responseJSON);
};


//search for a pokemon by name
const getPokemonByName = (request, response, params) => {
    const responseJSON = {};
    const name = params.name;

    //check if name exists, otherwise 400 bad request
    if (!name || !name.trim()) {
        responseJSON.message = 'A Pokemon name is required.';
        responseJSON.id = 'missingParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    //get pokemon
    const pokemon = dataManager.getAllPokemon();

    //compare whether names match using .find
    const foundPokemon = pokemon.find((p) =>
        p.name.toLowerCase() === name.trim().toLowerCase());

    //if not found, return 404
    if (!foundPokemon) {
        responseJSON.message = 'Pokemon not found.';
        responseJSON.id = 'pokemonNotFound';

        return respondJSON(request, response, 404, responseJSON);
    }
    responseJSON.pokemon = foundPokemon;
    //successful
    return respondJSON(request, response, 200, responseJSON);
};

//find and return pokemon of a specific type
const getPokemonByType = (request, response, params) => {
    const responseJSON = {};

    const type = params.type;

    //check whether the type was given, otherwise 400 bad request
    if (!type || !type.trim()) {
        responseJSON.message = 'A Pokemon type is required.';
        responseJSON.id = 'missingParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    const pokemon = dataManager.getAllPokemon();

    //find matching pokemon using .filter instead of .find
    const matchingPokemon = pokemon.filter((p) =>
        p.type.some((t) =>
            t.toLowerCase() === type.trim().toLowerCase()));

    //return 404 if none match
    if (matchingPokemon.length === 0) {
        responseJSON.message = 'No Pokemon found with that type.';
        responseJSON.id = 'typeNotFound';

        return respondJSON(request, response, 404, responseJSON);
    }

    //return all matching pokemon
    responseJSON.count = matchingPokemon.length;
    responseJSON.pokemon = matchingPokemon;

    return respondJSON(request, response, 200, responseJSON);
};

//find and return weaknesses for a specific pokemon
const getWeaknesses = (request, response, params) => {
    const responseJSON = {};

    const name = params.name;

    //check whether name was provided, otherwise 400 bad request
    if (!name || !name.trim()) {
        responseJSON.message = 'A Pokemon name is required.';
        responseJSON.id = 'missingParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    const pokemon = dataManager.getAllPokemon();

    //find the requested pokemon like above
    const foundPokemon = pokemon.find((p) =>
        p.name.toLowerCase() === name.trim().toLowerCase());

    //if not found, return 404
    if (!foundPokemon) {
        responseJSON.message = 'Pokemon not found.';
        responseJSON.id = 'pokemonNotFound';

        return respondJSON(request, response, 404, responseJSON);
    }

    //return name and weaknesses
    responseJSON.name = foundPokemon.name;
    responseJSON.weaknesses = foundPokemon.weaknesses;

    return respondJSON(request, response, 200, responseJSON);
};


//404 not found
const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
};


//add and validate a new pokemon
const addPokemon = (request, response) => {
    const responseJSON = {
        message: 'A new Pokemon has been added.',
    };

    const { name } = request.body;

    const id = Number(request.body.id);
    const type = parseArrayField(request.body.type);
    const weaknesses = parseArrayField(request.body.weaknesses);

    //check that all fields exist or return 400 bad request
    if (
        request.body.id === undefined
        || request.body.id === ''
        || !name
        || request.body.type === undefined
        || request.body.weaknesses === undefined
    ) {
        responseJSON.message = 'All required fields must be provided.';
        responseJSON.id = 'missingParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    //check all submitted info is the right type
    if (
        !Number.isInteger(id)
        || typeof name !== 'string'
        || !name.trim()
        || !Array.isArray(type)
        || type.length === 0
        || !type.every((t) => typeof t === 'string' && t.trim())
        || !Array.isArray(weaknesses)
        || !weaknesses.every((w) => typeof w === 'string' && w.trim())
        || weaknesses.length === 0
    ) {
        responseJSON.message = 'Invalid Pokemon data.';
        responseJSON.id = 'invalidParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    const pokemon = dataManager.getAllPokemon();

    //check if it already exists
    const existingPokemon = pokemon.find((p) =>
        p.id === id || p.name.toLowerCase() === name.trim().toLowerCase());

    if (existingPokemon) {
        responseJSON.message = 'A Pokemon with that ID or name already exists.';
        responseJSON.id = 'duplicatePokemon';

        return respondJSON(request, response, 400, responseJSON);
    }

    //create a new object
    const newPokemon = {
        id,
        name: name.trim(),
        type,
        weaknesses,
    };

    dataManager.addPokemon(newPokemon);

    responseJSON.pokemon = newPokemon;
     //return with 201 this time because something was created
    return respondJSON(request, response, 201, responseJSON);
};


//change an existing pokemon
const updatePokemon = (request, response) => {
    const responseJSON = {};

    const { name } = request.body;

    //check for missing information, return 400 bad request if needed
    if (
        !name
        || request.body.type === undefined
        || request.body.weaknesses === undefined
    ) {
        responseJSON.message = 'All required fields must be provided.';
        responseJSON.id = 'missingParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    const type = parseArrayField(request.body.type);
    const weaknesses = parseArrayField(request.body.weaknesses);

    //check provided information (same as previous function) or return 400 bad request
    if (
        typeof name !== 'string'
        || !name.trim()
        || !Array.isArray(type)
        || type.length === 0
        || !type.every((t) => typeof t === 'string' && t.trim())
        || !Array.isArray(weaknesses)
        || weaknesses.length === 0
        || !weaknesses.every((w) => typeof w === 'string' && w.trim())
    ) {
        responseJSON.message = 'Invalid Pokemon data.';
        responseJSON.id = 'invalidParams';

        return respondJSON(request, response, 400, responseJSON);
    }

    const pokemon = dataManager.getAllPokemon();

    //look for pokemon or return 404 not found
    const foundPokemon = pokemon.find((p) =>
        p.name.toLowerCase() === name.trim().toLowerCase());

    if (!foundPokemon) {
        responseJSON.message = 'Pokemon not found.';
        responseJSON.id = 'pokemonNotFound';

        return respondJSON(request, response, 404, responseJSON);
    }

    //update information
    dataManager.updatePokemon(foundPokemon, type, weaknesses);

    //204 response with no body
    return respondJSON(request, response, 204, {});
};


//exports
module.exports = {
    getPokemon,
    getPokemonByName,
    getPokemonByType,
    getWeaknesses,
    addPokemon,
    updatePokemon,
    notFound,
};

