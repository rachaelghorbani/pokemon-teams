const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", () => {

const getTrainers = () => {
    fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(trainers => {
        renderTrainers(trainers)
        
    })
}

const renderTrainers = trainers => {
    trainers.map(renderTrainer)
}

 const renderTrainer = trainer => {
    const main = document.querySelector('main')
    const trainerDiv = document.createElement('div');
    trainerDiv.classList.add('card');
    trainerDiv.dataset.id = trainer.id;
    const trainerName = document.createElement('p');
    trainerName.textContent = trainer.name;

    const addPokemonButton = document.createElement('button');
    addPokemonButton.classList.add('add-pokemon-button')
    trainerDiv.append(trainerName, addPokemonButton)

    addPokemonButton.dataset.trainerId = trainer.id;
    addPokemonButton.textContent = "Add Pokemon"
    main.append(trainerDiv)
    trainerDiv.append(createPokemonUl(trainer))
   
 }

 const createPokemonUl = trainer => {
    const pokemonUl = document.createElement('ul')
    for(const pokemon of trainer.pokemons){
        const pokemonLi = document.createElement('li');
        pokemonLi.innerHTML = `
        ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
        `
        pokemonUl.append(pokemonLi)
    }
    return pokemonUl
 }

 const clickHandler = () => {
     document.addEventListener('click', e => {
        if(e.target.matches('.add-pokemon-button')){
           addPokemon(e.target)
        } else if (e.target.matches('.release')) {
            releasePokemon(e.target)
        }
     })
 }

 const addPokemon = el => {
    const trainerObj = {
        trainer_id: el.parentElement.dataset.id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(trainerObj)
    }

    fetch(POKEMONS_URL, options)
    .then(response => response.json())
    .then(pokemon => {
        if (pokemon.error) {
            alert(pokemon.error)
        } else {
            renderPokemon(pokemon)
        }
    })
 }
 
const releasePokemon = el => {
    const pokemonId = el.dataset.pokemonId

    const options = {
        method: "DELETE"
    }
    fetch(POKEMONS_URL+'/'+pokemonId, options)
    .then(response => response.json())
    .then(pokemon => {
        const parentLi = el.parentElement
        parentLi.remove()
        console.log(pokemon)
    })
}   


const renderPokemon = pokemon => {
    const trainerDiv = document.querySelector(`[data-id='${pokemon.trainer_id}']`)
    const pokemonUl = trainerDiv.querySelector("ul")
    console.log(pokemonUl)
    const pokemonLi = document.createElement('li');
    pokemonLi.innerHTML = `
    ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
    `
    pokemonUl.append(pokemonLi)
}

clickHandler()
getTrainers()
})