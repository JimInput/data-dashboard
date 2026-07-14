import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from 'recharts';
import './DataPanel.css'
import './TypeBadge.css'

const NUM_RESULTS = 150;

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const pokemonTypes = [
  'none', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy',
  'dark'
];

  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    none: '#9DA0A0',
  };

const PokemonList = () => {
  const navigate = useNavigate();
  const { filteredList, pokemonList, searchName, setSearchName, filterType, setFilterType, minWeight, setMinWeight, maxWeight, setMaxWeight, averageHeight, averageWeight, idRange } = useOutletContext();

  const typeData = filteredList?.reduce((acc, pokemon) => {
    const type = pokemon.types?.[0]?.type?.name || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeDataArray = typeData
    ? Object.entries(typeData)
        .map(([type, count]) => ({ type: capitalizeFirstLetter(type), count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const scatterData = filteredList?.map((pokemon, index) => ({
    name: capitalizeFirstLetter(pokemon.name),
    height: pokemon.height,
    weight: pokemon.weight,
    index,
  })) || [];

  const chartData = {
    typeData: typeDataArray,
    scatterData,
  };

  return (
    <>
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
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {pokemonTypes.map((type) => (
            <option key={type} value={type}>{capitalizeFirstLetter(type)}</option>
          ))}
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
      {!pokemonList && <h2>Loading...</h2>}
      {pokemonList && (
        <div className="panel-body">
          <div className="table-column">
            <div className="table-scroll">
              <table className="pokemon-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Primary Type</th>
                    <th>Height (ft)</th>
                    <th>Weight (lbs)</th>
                  </tr>
                </thead>
                {filteredList && (
                  <tbody>
                    {filteredList.map((pokemon) => (
                      <tr
                        key={pokemon.name}
                        className="clickable-row"
                        onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                      >
                        <td>{pokemon.id}</td>
                        <td>{capitalizeFirstLetter(pokemon.name)}</td>
                        <td>
                          <button className={`type-badge ${pokemon.types[0].type.name}`}>
                            {capitalizeFirstLetter(pokemon.types[0].type.name)}
                          </button>
                        </td>
                        <td>{pokemon.height}</td>
                        <td>{pokemon.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          <div className="charts-column">
            <div className="chart-card">
              <h3>Type Frequency</h3>
              <div className="chart-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.typeData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" interval={0} angle={-35} textAnchor="end" height={70} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.typeData.map((entry, idx) => {
                        const typeKey = (entry.type || '').toLowerCase();
                        const color = typeColors[typeKey] || '#3b82f6';
                        return <Cell key={`cell-${idx}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-card">
              <h3>Height vs Weight</h3>
              <div className="chart-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="height" name="Height" unit="ft" />
                    <YAxis type="number" dataKey="weight" name="Weight" unit="lbs" />
                    <ZAxis type="number" dataKey="index" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, name]} />
                    <Scatter data={scatterData} fill="#f97316" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DataPanel = () => {
    const [pokemonList, setPokemonList] = useState(null);
    const [filteredList, setFilteredList] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [filterType, setFilterType] = useState("none");
    const [averageHeight, setAverageHeight] = useState(0);
    const [averageWeight, setAverageWeight] = useState(0);
    const [idRange, setIdRange] = useState(0);
    const [minWeight, setMinWeight] = useState(0);
    const [maxWeight, setMaxWeight] = useState(0);
    const navigate = useNavigate();

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

    const handleBackToList = () => {
        navigate('/pokemon');
    };

    return (
        <div className="whole-data-panel">
            <Outlet context={{
                pokemonList,
                filteredList,
                searchName,
                setSearchName,
                filterType,
                setFilterType,
                minWeight,
                setMinWeight,
                maxWeight,
                setMaxWeight,
                averageHeight,
                averageWeight,
                idRange,
                handleBackToList,
            }} />
        </div>
    )
}

export { PokemonList }

export default DataPanel;
