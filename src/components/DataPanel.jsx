import { useState, useEffect } from 'react';
import './DataPanel.css'

const NUM_RESULTS = 15;

function capitalizeFirstLetter(str) {
  if (!str) return str; // Handles empty strings safely
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const pokemonTypes = [
  "none", "normal", "fire", "water", "electric", "grass", "ice", 
  "fighting", "poison", "ground", "flying", "psychic", 
  "bug", "rock", "ghost", "dragon", "steel", "fairy", 
  "dark"
];

const DataPanel = () => {
    const [pokemonList, setPokemonList] = useState(null);
    const [filteredList, setFilteredList] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [filterType, setFilterType] = useState("none");
    const [averageHeight, setAverageHeight] = useState(0);
    const [averageWeight, setAverageWeight] = useState(0);
    const [idRange, setIdRange] = useState(0);
    const [minWeight, setMinWeight] = useState(null);
    const [maxWeight, setMaxWeight] = useState(null);

    const fetchInformation = async (name) => {
        const query = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const response = await fetch(query);
        const json = await response.json();
        return json;
    }

    const fetchPokemon = async () => {
        const query = "https://pokeapi.co/api/v2/pokemon?limit=1025";
        const response = await fetch(query);
        const json = await response.json();

        const details = await Promise.all(
            json.results.map((pokemon) => fetchInformation(pokemon.name))
        );

        setPokemonList(details);
    }

    

    useEffect(() => {
        fetchPokemon();
    }, []);

    useEffect(() => {
        if (!pokemonList) return;
        const filtered = pokemonList
            .filter((p) => {
                const matchesName = p.name.includes(searchName.toLowerCase());
                const matchesType = filterType === "none" || p.types[0].type.name === filterType;
                const inWeightHigh = !maxWeight || p.weight <= maxWeight;
                const inWeightLow = !minWeight || p.weight >= minWeight;
                return matchesName && matchesType && inWeightHigh && inWeightLow;
            })
            .slice(0, NUM_RESULTS)

        setFilteredList(filtered);
    }, [searchName, filterType, pokemonList, minWeight, maxWeight])

    useEffect(() => {
        if (!filteredList) return;
        const calculateSummary = async () => {
            let avgH = 0;
            let avgW = 0;
            let idR = 0;
            if (filteredList.length > 0) {
                avgH = filteredList.reduce((sum, pokemon) => sum + pokemon.height, 0) / filteredList.length;
                avgW = filteredList.reduce((sum, pokemon) => sum + pokemon.weight, 0) / filteredList.length;
                idR = filteredList.at(-1).id - filteredList[0].id
            }

            setAverageHeight(avgH);
            setAverageWeight(avgW);
            setIdRange(idR);
        }
        
        calculateSummary();
    }, [filteredList])

    return (
        <div className="whole-data-panel">
            <h1>Pokemon Lookup</h1>
            <div className="summary">
                <h2>ID Range: {idRange}</h2>
                <h2>Avg. Height: {averageHeight.toFixed(2)} ft</h2>
                <h2>Avg. Weight: {averageWeight.toFixed(2)}</h2>
            </div>
            <div className="filters">
                <input
                    type="text"
                    value={searchName}
                    onChange={(event) => setSearchName(event.target.value)}
                    placeholder="Search Pokemon..."
                />
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    {pokemonTypes.map((type) => {
                        return (
                            <option value={type}>{capitalizeFirstLetter(type)}</option>
                        )
                    })}
                </select>
                <input
                    type="number"
                    value={minWeight}
                    onChange={(event) => setMinWeight(event.target.value)}
                    placeholder="Min Weight"
                />
                <input
                    type="number"
                    value={maxWeight}
                    onChange={(event) => setMaxWeight(event.target.value)}
                    placeholder="Max Weight"
                />
            </div>
            {pokemonList && <table className="pokemon-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Primary Type</th>
                        <th>Height (ft)</th>
                        <th>Weight (lbs)</th>
                    </tr>
                </thead>

                {filteredList && <tbody>
                    {filteredList.map((pokemon) => (
                        <tr key={pokemon.name}>
                            <td>{pokemon.id}</td>
                            <td>{capitalizeFirstLetter(pokemon.name)}</td>
                            <td>{capitalizeFirstLetter(pokemon.types[0].type.name)}</td>
                            <td>{pokemon.height}</td>
                            <td>{pokemon.weight}</td>
                            
                        </tr>
                    ))}
                </tbody>}
            </table>
            }
        </div>
    )
}

export default DataPanel;