import axios from "axios";
import '/css/reset.css'
import '/css/styles.css'

const input = document.querySelector("#nombre-moneda");
const boton = document.querySelector("#buscar");
const modal = document.querySelector(".myModal");
const ArrayMonedas = [];
let contador = 0;


boton.addEventListener("click", async () => {
  let encontrada = false;
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
  for (let i = 0; i < response.data.length; i++) {
    let nombre = response.data[i].name;
    let moneda = input.value;
    if(nombre == moneda){ 
      if(!ArrayMonedas.includes(nombre)){
        ArrayMonedas[contador] = nombre;
        contador++;
        AddList(response.data[i]);
        i = response.data.length;
        input.value = "";
      }
      else{
        alert("Ya has añadido la moneda a la lista");
      }
      encontrada = true;
    }
  }
  if(encontrada === false){
    alert("No existe ningúna moneda con es enombre");
  }
});

const AddList = async (moneda) => {
  let lista = document.querySelector(".container-lista");
  let div = document.createElement("div");
  div.className = `divNuevo moneda${moneda.name}`;
  div.addEventListener("click", () => AbrirInfo(moneda.id))  //cuando hacemos click encima del div de una moneda, se abre  un modal con información de la misma
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

const AbrirInfo = async(id) =>{
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);

  let imagen = document.querySelector(".imagen-moneda");
  imagen.src = response.data.image.large;

  let simbolo = document.querySelector(".simbolo-moneda");
  simbolo.textContent = `Símbolo: ${response.data.symbol}`;

  let nombre = document.querySelector(".nombre-moneda");
  nombre.textContent = `Nombre: ${response.data.name}`;

  if(response.data.links.homepage[0] != null){
    let link = document.querySelector(".link-moneda");
    link.textContent = response.data.links.homepage[0];
    link.href = response.data.links.homepage[0];
  }
  modal.style.display = "block"; //cambiamos el atributo "display" a block y así hacemos que sea vea en pantalla
}

window.onclick = function(event) {  //captura el click afuera del modal y así poder cerrarlo
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const AddTrending = async () => {
  let lista = document.querySelector(".container-lista-trending");
  const response = await axios.get(`https://api.coingecko.com/api/v3/search/trending`);
  for (let i = 0; i < response.data.coins.length; i++) {
    let moneda = response.data.coins[i];

    let div = document.createElement("div");
    div.className = "divNuevo"
    lista.appendChild(div);

    let pSymbol = document.createElement("p");
    pSymbol.textContent = moneda.item.symbol;
    pSymbol.className = "pTrending-Simbolo"

    let pName = document.createElement("p");
    pName.textContent = moneda.item.name;
    pName.className = "pTrending-Nombre"
    
    div.appendChild(pSymbol);
    div.appendChild(pName);
  }
};

AddTrending();

