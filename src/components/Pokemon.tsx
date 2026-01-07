import usePokemon from "../hooks/usePokemon";

const Pokemon = () => {
  const { count, pokemon, handleNext, handlePreview } = usePokemon();

  return (
    <>
      <div className="bg-gradient flex flex-col items-center">
        <h1 className="text-2xl font-thin text-white">Pokémon</h1>
        <h3 className="text-xl font-bold text-white">
          {count} - {pokemon}
        </h3>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${count}.png`}
          alt=""
        />

        <div className="flex gap-2">
          <button
            onClick={() => handlePreview()}
            disabled={count === 1 ? true : false}
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Anterior
          </button>

          <button
            onClick={() => handleNext()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default Pokemon;
