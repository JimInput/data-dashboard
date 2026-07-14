import { useParams, useOutletContext } from 'react-router-dom'
import './DataPanel.css'
import './PokemonDetail.css'

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const PokemonDetail = () => {
  const { pokemonName } = useParams();
  const { pokemonList, handleBackToList } = useOutletContext();
  const pokemon = pokemonList?.find((item) => item.name === pokemonName);

  if (!pokemon) {
    return (
      <div className="main-div">
        <button onClick={handleBackToList}>Back to list</button>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className="main-div">
      <button onClick={handleBackToList}>Back to list</button>
      <h2>{capitalizeFirstLetter(pokemon.name)}</h2>
      <p>ID: {pokemon.id}</p>
      <p>Primary Type: {capitalizeFirstLetter(pokemon.types?.[0]?.type?.name || 'unknown')}</p>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Abilities: {pokemon.abilities.map((ability) => capitalizeFirstLetter(ability.ability.name)).join(', ')}</p>
      <p>BST</p>
      <ul>
        {pokemon.stats.map((stat) => <li>{`${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`}</li>)}
    </ul>
    </div>
  )
}

export default PokemonDetail
