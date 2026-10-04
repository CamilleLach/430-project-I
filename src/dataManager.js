const fs = require('fs');
const path = require('path');

//load the dataset
const filePath = path.join(__dirname, '../data/pokedex.json');
const pokemon = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//return all pokemon stored
const getAllPokemon = () => pokemon;


//add a new pokemon
const addPokemon = (newPokemon) => {
    pokemon.push(newPokemon);
};

//edit an existing pokemon
const updatePokemon = (pokemonToUpdate, newType, newWeaknesses) => {
    pokemonToUpdate.type = newType;
    pokemonToUpdate.weaknesses = newWeaknesses;
};


//exports
module.exports = {
    getAllPokemon,
    addPokemon,
    updatePokemon,
};