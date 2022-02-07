import axios from "axios";
import '/css/reset.css'
import '/css/styles.css'

const input = document.querySelector("#nombre-moneda");
const boton = document.querySelector("#buscar");
const modal = document.querySelector(".myModal");
const ArrayMonedas = [];  //Esta array la utilizaremos para ver que monedas ya han sido introducidas a la lista.
let contador = 0;         //Este contador lo usaremos para saber en que posición de la array tenemos que guardar el nombre de la moneda que acabamos de añadir a la lista.


boton.addEventListener("click", async () => {
  let encontrada = false;
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);  //Esto nos devuelve TODAS las monedas. Ahora vamos a tener que buscar la que nos interesa.

  for (let i = 0; i < response.data.length; i++) {     //Bucle para encontrar la moneda que queremos y ver si esta moneda ya ha sido introducida antes a la lista.
    let nombreMoneda = response.data[i].name;          //En el caso de no estar en la lista llamamos a la función AddList pasandole la info de la moneda
    let nombreInput = input.value;
    if(nombreMoneda == nombreInput){             //Por cada iteración comparamos el nombre escrito en el input con la variable .name de cada moneda que recibimos en el response.
      if(!ArrayMonedas.includes(nombreMoneda)){        //Cuando ya hemos visto que existe una moneda con ese nombre dentro de la api, miramos si ese nombre ya eexiste dentro
        ArrayMonedas[contador] = nombreMoneda;         // dentro de la array de monedas ya añadidas a la lista.        
        contador++;                                    //Cuando vemos que el noombre de la moneda buscada NO existe dentro de la array de monedas, lo insertamos en la
        AddList(response.data[i]);                     // la posición que toque (contador). Llamamos a la función AddList para añadir la moneda a la lista y le pasamos la moneda
        i = response.data.length;            //Como ya habremos añadido la moneda a la lista, ya no queremos seguir haciendo iteraciónes en el bucle, entonces forzamos el final.
        input.value = "";
      }
      else{
        alert("Ya has añadido la moneda a la lista");  //Si la array de monedas añadidas a la lista contiene el nombre de la moneda que estamos buscando en el input mostramos 
      }                                                // una alerta.
      encontrada = true;                               //Si el la moneda introducida en el input existe en la api, modificamos el valor de "encontrada" a true.
    }
  }
  if(encontrada === false){                            //Si al finalizar el bucle la variable "encontrada" sigue siendo false quiere decir que no se ha encontrado ninguna 
    alert("No existe ningúna moneda con es enombre");  // moneda con el nombre introducido en el input (buscador). Entonces mostramos una alerta notificándolo.
  }
});

const AddList = async (moneda) => {               //Función para añadir una moneda a la lista y mostrarlo por pantalla. Esta función recibe por parámetros la moneda a añadir.
  let divLista = document.querySelector(".container-lista");    //Seleccionamos el div que representa la lista de monedas, e introduciremos un div nuevo que será la moneda.
  let divNuevo = document.createElement("div");                   //Creamos un div y le asignamos dos classes: divNuevo (class general por cada línea/moneda de la lista) y 
  divNuevo.className = `divNuevo moneda${moneda.name}`;           // moneda{nombre de la moneda} que será una class individual y única.
  divLista.appendChild(divNuevo);                                 //Añadimos el nuevo div (divNuevo) dentro del div (divLista) general de la lista.

  let pSymbol = document.createElement("p");        //Dentro del div (divNuevo) añadimos 2 <p> donde mostraremos el nombre de la moneda y el simbolo.
  pSymbol.textContent = moneda.symbol;              
  pSymbol.className = "pNuevo"                      //Asignamos la class "pNuevo" a las <p>.

  let pName = document.createElement("p");
  pName.textContent = moneda.name;
  pName.className = "pNuevo"

  divNuevo.appendChild(pSymbol);                    //Añadimos las dos <p> al div creado.
  divNuevo.appendChild(pName);
  divNuevo.addEventListener("click", () => AbrirInfo(moneda.id))  //Cuando hacemos click encima del div de una moneda (divNuevo), se abre  un modal con información de la misma.
};

const AbrirInfo = async(id) =>{       //Función para abrir un modal con información de la moneda a la que le acabamos de hacer click encima.
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);   //Esto devuelve una moneda con toda su información.

  let imagen = document.querySelector(".imagen-moneda");    //Asignamos los valores de dicha moneda a los diferentes divs y <p> del modal.
  imagen.src = response.data.image.large;

  let simbolo = document.querySelector(".simbolo-moneda");
  simbolo.textContent = `Símbolo: ${response.data.symbol}`;

  let nombre = document.querySelector(".nombre-moneda");
  nombre.textContent = `Nombre: ${response.data.name}`;

  let rank = document.querySelector(".rank-moneda");
  rank.textContent = `Rank: ${response.data.coingecko_rank}`;

  let hash = document.querySelector(".hash-moneda");
  if(response.data.hashing_algorithm === null){        
    hash.textContent = `Algoritmo de hashing: no tiene`;
  }
  else{
    hash.textContent = `Algoritmo de hashing: ${response.data.hashing_algorithm}`;
  }
  
  if(response.data.links.homepage[0] != null){        //Nos aseguramos de que existe un link de referencia antes de mostrarlo.
    let link = document.querySelector(".link-moneda");
    link.textContent = response.data.links.homepage[0];
    link.href = response.data.links.homepage[0];
  }
  modal.style.display = "block";    //Cambiamos el atributo "display" a block y así hacemos que sea vea en pantalla.
}

window.onclick = function(event) {  //Captura el click afuera del modal y así poder cerrarlo
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const AddTrending = async () => {  //Función que se inicia al entrar en la página y carga todas las monedas "trending" en una lista lateral
  let lista = document.querySelector(".container-lista-trending");
  const response = await axios.get(`https://api.coingecko.com/api/v3/search/trending`); //Esto devuelve todas las monedas "trending"

  for (let i = 0; i < response.data.coins.length; i++) { //Hacemos un bucle para recorrer la varianle "response" y extraemos la moneda (coins) de esa iteración.
    let moneda = response.data.coins[i];      //Para encontrar la moneda, tenemos que entrar dentro del objeto "data" y luego mirar cada posición de la array "coins".
                                              //Por eso hacemos el bucle for. Para recorrer la aray coins[] posición por posición y extraer la moneda que toque por iteración.
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

    //let infoMoneda = await axios.get(`https://api.coingecko.com/api/v3/coins/${moneda.item.id}`);
    //let monedaID = infoMoneda.data
    //div.addEventListener("click", () => AddList(monedaID,true))
  }
};

AddTrending();

