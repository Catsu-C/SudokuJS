import GeneradorSudoku from './generadorSudoku.js';
{
    console.log("Hola git");
    let tablero= document.getElementById("tablero");
    let casillaVacia = document.createElement('div');
    let cuadradoSeleccionado = casillaVacia;
    let botonSetAccion = document.getElementById("setAccion");
    let botonGenerar=document.getElementById("generarPartida");
    let botonVaciar=document.getElementById("vaciar");
    let numeroResaltado=document.createElement('div');
    numeroResaltado.innerText=0;
    let btnAnotacion=document.getElementById("btnAnotacion");
    let btnSolucionar = document.getElementById("btnSolucionar");
    let btnValidar = document.getElementById("verificar");
    casillaVacia.appendChild(document.createElement('p'));

    crearTablero(tablero);
    
    let casillas = document.getElementsByClassName("casilla");
    let generadorSudoku = new GeneradorSudoku(casillas);
    casillas = generadorSudoku.tablero;
    document.addEventListener('keydown', e => {
        if (parseInt(e.key) > 0 && parseInt(e.key) < 10) {
            if (botonSetAccion.className === "valorFinal") {
                cuadradoSeleccionado.childNodes[0].className = "pValor";
                let cuadrado = cuadradoSeleccionado.id.split('|')[0];
                let posicion = cuadradoSeleccionado.id.split('|')[1];
                let valor= e.key;
                limpiarPorValorFinal(cuadrado,posicion,valor,casillas);
                cuadradoSeleccionado.childNodes[0].innerText = e.key;
                generadorSudoku.valoresFinales[cuadrado][posicion]=valor;
                if (cuadradoSeleccionado.childNodes[0].innerText.includes(numeroResaltado.innerHTML)) {
                    cuadradoSeleccionado.className = "casillaResaltada"
                }
            } else {
                if (cuadradoSeleccionado.childNodes[0].innerText.length < 10 && !(cuadradoSeleccionado.childNodes[0].innerText.includes(e.key))) {
                    cuadradoSeleccionado.childNodes[0].className = "pAnotacion";
                    cuadradoSeleccionado.childNodes[0].innerText += e.key;
                    if (cuadradoSeleccionado.childNodes[0].innerText.length === 6) {
                        cuadradoSeleccionado.childNodes[0].appendChild(document.createElement('br'));
                    }
                }
                if (cuadradoSeleccionado.childNodes[0].innerText.includes(numeroResaltado.innerHTML)) {
                    cuadradoSeleccionado.className = "casillaResaltada"
                }
            }
        } else if (e.key === "Backspace") {
            let valor = cuadradoSeleccionado.childNodes[0].innerText;
            cuadradoSeleccionado.childNodes[0].innerText = valor.slice(0, valor.length - 1);
            if(cuadradoSeleccionado.childNodes[0].className="pValor"){
                const cuadrado = cuadradoSeleccionado.id.split('|')[0];
                const posicion = cuadradoSeleccionado.id.split('|')[1];
                generadorSudoku.valoresFinales[cuadrado][posicion]="";
            }
        }
    });
    document.addEventListener('keydown', e =>{
        if(e.key === 'c'){
            if (botonSetAccion.className === "anotacion") {
                botonSetAccion.className = "valorFinal";
            } else {
                botonSetAccion.className = "anotacion";
            }
        }
    });
    document.addEventListener('click', e => {
        let casilla = e.target;
        if (casilla.className === "pAnotacion" || casilla.className === "pValor") {
            casilla = casilla.parentNode;
        }
        if (casilla.className === "casillaSelec") {
            casilla.className = "casilla";
            cuadradoSeleccionado = casillaVacia;
        } else if (casilla.className === "casilla" || casilla.className === "casillaResaltada") {
            if (cuadradoSeleccionado.childNodes[0].innerText.includes(numeroResaltado.innerHTML)){
                cuadradoSeleccionado.className = "casillaResaltada"
            }else{
                cuadradoSeleccionado.className = "casilla";
            }
            cuadradoSeleccionado = casilla;
            casilla.className = "casillaSelec";
        } else if(casilla.className==="numero"){
            casilla.className = "numeroSelec";
            numeroResaltado.className = "numero";
            numeroResaltado=casilla;
            if(casilla.id > 0){
                desResaltarNumeros(casillas);
                resaltarNumeros(numeroResaltado.innerText, casillas);
            }else{
                numeroResaltado.className="numero";
                desResaltarNumeros(casillas);
            }
        }
    });
    btnSolucionar.onclick= () => {
        generadorSudoku.solucionarSudoku();
        generadorSudoku.llenarTablero();
    }
    btnAnotacion.onclick = () => {
        generadorSudoku.setValoresPosibles();
        generadorSudoku.colocarAnotaciones();
    }
    botonSetAccion.onclick = () => {
        if (botonSetAccion.className === "anotacion") {
            botonSetAccion.className = "valorFinal";
        } else {
            botonSetAccion.className = "anotacion";
        }
    }
    botonGenerar.onclick= () =>{
        let inicio=new Date();
        let tiempoInicio=inicio.getMinutes()+":"+inicio.getSeconds()+","+inicio.getMilliseconds();

        generadorSudoku.getSolucionGenerada();
        generadorSudoku.quitarValores(0, 50, [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []]);
        generadorSudoku.llenarValoresPredeterminados();
        cuadradoSeleccionado=casillaVacia;

        let final = new Date();
        let tiempoFinal = final.getMinutes() + ":" + final.getSeconds() + "," + final.getMilliseconds();
        console.log(tiempoInicio+"  "+tiempoFinal);
    }
    botonVaciar.onclick= () => {
        generadorSudoku.vaciarTablero();
    }
    btnValidar.onclick= () => {
        let validar = isSolucionCorrecta(generadorSudoku);
        if(validar){
            let animacion= document.getElementsByClassName("tablero");
            animacion[0].className ="tablero tableroVictoria";
            setTimeout(() => {
                animacion[0].className = "tablero";
            }, 1000); 
        }else{
            alert("tamal");
        }
    }
    let debugBoton = document.getElementById("debug");
    debugBoton.onclick = () => {
        console.log(cuadradoSeleccionado)
        console.log(getValoresTablero(casillas));
        console.log(isTableroLleno(casillas));
        //solucionarSudoku(casillas);
        let casilla=casillas[0][0];
        let posibilidades = casilla.childNodes[0].innerText.split("");
        if (posibilidades.length > 6) posibilidades.splice(6, 1);
        let valor = posibilidades[Math.floor(Math.random() * posibilidades.length)];
        console.log(posibilidades);
        let array=[0,0,0,0,0,0,0,0,0];
        for (let i = 0; i < 100; i++) {
            valor = posibilidades[Math.floor(Math.random() * posibilidades.length)];
            array[valor-1]++;
        }
        console.log(array);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                casillas[i][j].childNodes[0].className = "pAnotacion";
                casillas[i][j].childNodes[0].innerText = "123456\n789";
            }
        }
        console.log(isTableroLleno(casillas));
        
    };
}
function resaltarNumeros(numero, tablero){
    for (let i = 0; i < 9; i++) {
        for(let j=0; j < 9; j++){
            let casilla=tablero[i][j];
            if (casilla.childNodes[0].innerText.includes(numero)){
                if (casilla.className === "casillaPredeterminada") {casilla.className = "casillaPreResaltada"; continue;}
                casilla.className="casillaResaltada";
            }
        }
    }
}
function desResaltarNumeros(tablero){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let casilla = tablero[i][j];
            if (casilla.className === "casillaPreResaltada") { casilla.className = "casillaPredeterminada"; continue;}
            if (casilla.className != "casillaPredeterminada") casilla.className = "casilla"
        }
    }
}
function limpiarPorValorFinal(cuadrado, posicion, valor, tablero) {
    if (tablero[cuadrado][posicion].childNodes[0].innerText !== "\n") {
        for (let j = 0; j < 9; j++) {   //Recorre el cuadrante de donde ponemos el valor
            if (tablero[cuadrado][j].childNodes[0].innerText.includes(valor) && tablero[cuadrado][j].childNodes[0].className === "pAnotacion") {
                let separacion = tablero[cuadrado][j].childNodes[0].innerText.split(valor);
                tablero[cuadrado][j].childNodes[0].innerText = separacion[0] + separacion[1];
            }
        }
        let inicioFila = Number.parseInt(posicion);
        let inicioColumna = Number.parseInt(posicion);
        let inicioCuadradoHor = Number.parseInt(cuadrado);
        let inicioCuadradoVer = Number.parseInt(cuadrado);
        while (!(inicioFila % 3 === 0)) {
            inicioFila--;       //Esto llega a la col m[as a la izquierda del cuadrado al que pertenece
        }
        while (inicioColumna > 2) {
            inicioColumna -= 3;         //Esto llega a la fila m[as arriba del cuadrado
        }
        while (!(inicioCuadradoHor % 3 === 0)) {
            inicioCuadradoHor--;
        }
        while (inicioCuadradoVer > 2) {
            inicioCuadradoVer -= 3;
        }
        for (let j = 0; j < 9; j++) { //recorrer fila
            if (tablero[inicioCuadradoHor][inicioFila].childNodes[0].innerText.includes(valor) && tablero[inicioCuadradoHor][inicioFila].childNodes[0].className === "pAnotacion") {
                let separacion = tablero[inicioCuadradoHor][inicioFila].childNodes[0].innerText.split(valor);
                tablero[inicioCuadradoHor][inicioFila].childNodes[0].innerText = separacion[0] + separacion[1];
            }
            if (j % 3 === 2) {
                inicioCuadradoHor++;
                inicioFila -= 2;
            } else {
                inicioFila++;
            }
        }
        for (let j = 0; j < 9; j++) { //recorrer la columna
            if (tablero[inicioCuadradoVer][inicioColumna].childNodes[0].innerText.includes(valor) && tablero[inicioCuadradoVer][inicioColumna].childNodes[0].className === "pAnotacion") {
                let separacion = tablero[inicioCuadradoVer][inicioColumna].childNodes[0].innerText.split(valor);
                tablero[inicioCuadradoVer][inicioColumna].childNodes[0].innerText = separacion[0] + separacion[1];
            }
            if (j % 3 === 2) {
                inicioCuadradoVer += 3;
                inicioColumna -= 6;
            } else {
                inicioColumna += 3;
            }
        }
    }
}
function crearTablero(tablero) {
    for (let i = 0; i < 9; i++) {
        let cuadrado = document.createElement('div');
        cuadrado.className = "cuadrado";
        tablero.appendChild(cuadrado);
        for (let j = 0; j < 9; j++) {
            let valor = document.createElement('p');
            valor.className = "pAnotacion";
            let casilla = document.createElement('div');
            casilla.id = i + "|" + j;
            casilla.appendChild(valor);
            casilla.className = "casilla";
            cuadrado.appendChild(casilla);
        }
    }
}
function isSolucionCorrecta(generadorSudoku){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (generadorSudoku.valoresFinales[i][j] !== generadorSudoku.solucion[i][j]) return false;
        }        
    }
    return true;
}