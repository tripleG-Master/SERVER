class PokemonService {
  constructor() {
    this.baseUrl = 'https://pokeapi.co/api/v2';
  }

  async getAllPokemons(limit = 20, offset = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();

      // Get detailed information for each Pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return await detailResponse.json();
        })
      );

      return pokemonDetails;
    } catch (error) {
      throw new Error('Error fetching pokemons: ' + error.message);
    }
  }

  async getPokemonById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${id}`);
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching pokemon: ' + error.message);
    }
  }
}

export default new PokemonService();