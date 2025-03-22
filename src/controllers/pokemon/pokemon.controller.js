import pokemonService from "../../services/pokemon.service.js"

async function index(req,res){   
    try {
        const pokemons = await pokemonService.getAllPokemons()
        res.render('pokemon/index', { 
            title:"Pokemons",
            layout:"pokemon",
            pokemons
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("pokemon/error", {
            layout: "pokemon",
            message: 'Error loading pokemons',
            error: error
        });
    }
}


const PokemonController = {
    index
}

export default PokemonController;