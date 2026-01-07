import { useEffect, useState } from "react";
import axios from "axios";

const usePokemon = () => {

    const [count, setCount] = useState(1);
    const [pokemon, setPokemon] = useState();

    useEffect(() => {
        getPokemon();
    }, [count]);

    const getPokemon = async () => {
        const response = await axios
            .get(`https://pokeapi.co/api/v2/pokemon/${count}`)
            .then((item) => item);
        setPokemon(response.data.name);
    };

    const handleNext = async () => {
        getPokemon();
        setCount(count + 1);
    };

    const handlePreview = async () => {
        getPokemon();
        setCount(count - 1);
    };

    return {
        count,
        pokemon,

        //metodos
        handleNext,
        handlePreview,


    }
}

export default usePokemon