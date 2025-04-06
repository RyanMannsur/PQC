import { useContext } from "react";
import { LocalContext } from "../contexts/local";

const useLocal = () => {
return useContext(LocalContext);
};

export default useLocal;