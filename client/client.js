
'use strict';

//html
const nameForm = document.querySelector('#nameForm');
const idForm = document.querySelector('#idForm');
const typeForm = document.querySelector('#typeForm');
const addForm = document.querySelector('#addForm');
const showAllButton = document.querySelector('#showAll');

const pokemonResults = document.querySelector('#pokemonResults');
const resultMessage = document.querySelector('#resultMessage');
const addMessage = document.querySelector('#addMessage');

//display pokemon
const displayPokemon = (pokemon) => {
    pokemonResults.innerHTML = '';

    //for every pokemon, create a card that displays some data. the card itself is a link to a page with all the info
    pokemon.forEach((p) => {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        const name = document.createElement('h3');
        name.textContent = p.name;
        card.appendChild(name);

        //check if there is an image 
        if (p.img) {
            const image = document.createElement('img');
            image.src = p.img;
            image.alt = p.name;
            card.appendChild(image);
        }

        const id = document.createElement('p');
        id.textContent = `ID: ${p.id}`;
        card.appendChild(id);

        const type = document.createElement('p');
        type.textContent = `Type: ${p.type.join(', ')}`;
        card.appendChild(type);

        const weaknesses = document.createElement('p');
        weaknesses.textContent =
            `Weaknesses: ${p.weaknesses.join(', ')}`;
        card.appendChild(weaknesses);

        //created a link based on the id
        const link = document.createElement('a');

        link.href = `/pokemon.html?id=${p.id}`;
        link.classList.add('pokemon-link');

        link.appendChild(card);
        pokemonResults.appendChild(link);
    });
};

//get request and display results
const getPokemon = async (url) => {
    try {
        resultMessage.textContent = 'Loading...';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        const data = await response.json();

        if (response.status === 200) {
            //sometimes it's one piece of data, sometimes its an array
            const pokemon = Array.isArray(data.pokemon)
                ? data.pokemon
                : [data.pokemon];

            displayPokemon(pokemon);
            resultMessage.textContent = `Showing ${pokemon.length} Pokemon.`;
        } else {
            pokemonResults.innerHTML = '';
            resultMessage.textContent = data.message;
        }
    } catch (error) {
        console.error(error);
        pokemonResults.innerHTML = '';
        resultMessage.textContent = 'Unable to load Pokemon.';
    }
};

//search by name
nameForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#pokemonName').value.trim();

    getPokemon(`/getPokemonByName?name=${encodeURIComponent(name)}`);
});

//search by id
idForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = document.querySelector('#pokemonId').value;

    getPokemon(`/getPokemonById?id=${encodeURIComponent(id)}`);
});

//search by type
typeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const type = document.querySelector('#pokemonType').value.trim();

    getPokemon(`/getPokemonByType?type=${encodeURIComponent(type)}`);
});

//show all
showAllButton.addEventListener('click', () => {
    getPokemon('/getPokemon');
});

//post to add
addForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPokemon = {
        id: Number(document.querySelector('#newId').value),
        name: document.querySelector('#newName').value.trim(),
        type: document.querySelector('#newType').value
            .split(',').map((t) => t.trim()),
        weaknesses: document.querySelector('#newWeaknesses').value
            .split(',').map((w) => w.trim()),
    };

    try {
        const response = await fetch('/addPokemon', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPokemon),
        });

        const data = await response.json();

        if (response.status === 201) {
            addMessage.textContent = 'Pokemon added successfully!';
            addForm.reset();

            //refresh display
            getPokemon('/getPokemon');
        } else {
            addMessage.textContent = data.message;
        }
    } catch (error) {
        console.error(error);
        addMessage.textContent = 'Unable to add Pokemon.';
    }
});

//load all
getPokemon('/getPokemon');
