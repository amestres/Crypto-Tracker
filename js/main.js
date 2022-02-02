import axios from "axios";
import '/css/reset.css'
import '/css/styles.css'

const input = document.querySelector("#nombre-moneda");
const boton = document.querySelector("#buscar");


boton.addEventListener("click", async () => {
  let encontrada = false;
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
  for (let i = 0; i < response.data.length; i++) {
    let nombre = response.data[i].name;
    let moneda = input.value;
    if(nombre == moneda){
      addList(response.data[i]);
      i = response.data.length;
      encontrada = true;
      input.value = "";
    }
  }
  if(encontrada === false){
    alert("No existe ningúna moneda con es enombre");
  }
});

const addList = async (moneda) => {
  let lista = document.querySelector(".container-lista");
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
};

