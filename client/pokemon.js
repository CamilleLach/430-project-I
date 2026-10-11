
'use strict';

const detailName = document.querySelector('#detailName');
const pokemonDetails = document.querySelector('#pokemonDetails');
const detailMessage = document.querySelector('#detailMessage');

//create the text for each property
const addDetail = (container, label, value) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = `${label}: ${value}`;
    container.appendChild(paragraph);
};

//display full information
const displayDetails = (pokemon) => {
    detailName.textContent = pokemon.name;
    pokemonDetails.innerHTML = '';

    //checks if element exists before using it
    if (pokemon.img) {
        const image = document.createElement('img');
        image.src = pokemon.img;
        image.alt = pokemon.name;
        image.classList.add('detail-image');
        pokemonDetails.appendChild(image);
    }

    addDetail(pokemonDetails, 'ID', pokemon.id);

    if (pokemon.num) {
        addDetail(pokemonDetails, 'Pokédex Number', pokemon.num);
    }

    addDetail(pokemonDetails, 'Type', pokemon.type.join(', '));

    if (pokemon.height) {
        addDetail(pokemonDetails, 'Height', pokemon.height);
    }

    if (pokemon.weight) {
        addDetail(pokemonDetails, 'Weight', pokemon.weight);
    }

    addDetail(
        pokemonDetails,
        'Weaknesses',
        pokemon.weaknesses.join(', '),
    );

    if (pokemon.prev_evolution) {
        const previous = pokemon.prev_evolution
            .map((p) => p.name).join(', ');

        addDetail(pokemonDetails, 'Previous Evolutions', previous);
    }

    if (pokemon.next_evolution) {
        const next = pokemon.next_evolution
            .map((p) => p.name).join(', ');

        addDetail(pokemonDetails, 'Next Evolutions', next);
    }
};


//gets the pokemon using existing getByID
const loadPokemon = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
        detailName.textContent = 'Pokémon not found';
        detailMessage.textContent = 'No Pokémon ID was provided.';
        return;
    }

    try {
        const response = await fetch(
            `/getPokemonById?id=${encodeURIComponent(id)}`,
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        const data = await response.json();

        if (!response.ok) {
            detailName.textContent = 'Pokémon not found';
            detailMessage.textContent = data.message;
            return;
        }

        displayDetails(data.pokemon);
    } catch (error) {
        console.error(error);
        detailName.textContent = 'Error';
        detailMessage.textContent = 'Unable to load Pokémon details.';
    }
};

loadPokemon();

