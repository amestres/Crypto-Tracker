import axios from "axios";
import '/css/reset.css'
import '/css/styles.css'

const input = document.querySelector("#nombre-moneda");
const boton = document.querySelector("#buscar");


boton.addEventListener("click", async () => {
    /*const response = await axios.get(
      //`https://www.omdbapi.com/?apikey=765b6f6a&t=${input.value}`
      `https://api.coingecko.com/api/v3/coins/list`
    );
    console.log(response);*/
    //mostrarVistaPrevia(response.data);
  });

const mostrarMonedas = async () => {
    let lista = document.querySelector(".container-lista");
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/list");
    for (let i = 0; i < response.data.length; i++) {
        let moneda = response.data[i];
        let div = document.createElement("div");
        div.className = `divNuevo moneda${moneda.name}`
        lista.appendChild(div);
        let pSymbol = document.createElement("p");
        pSymbol.textContent = moneda.symbol;
        pSymbol.className = "pNuevo"
        let pName = document.createElement("p");
        pName.textContent = moneda.name;
        pName.className = "pNuevo"
        div.appendChild(pSymbol);
        div.appendChild(pName);
    }
};

mostrarMonedas();