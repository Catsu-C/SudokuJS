import GeneradorSudoku from './generadorSudoku.js';
{
    let sudokuResuelto = false;
    let tablero= document.getElementById("tablero");
    let casillaVacia = document.createElement('div');
    let cuadradoSeleccionado = casillaVacia;
    let botonSetAccion = document.getElementById("setAccion");
    let botonGenerar=document.getElementById("generarPartida");
    let botonVaciar=document.getElementById("vaciar");
    let numeroResaltado=document.createElement('div');
    numeroResaltado.innerText=0;
    let btnAnotacion=document.getElementById("anotar");
    let btnSolucionar = document.getElementById("solucionar");
    let btnValidar = document.getElementById("verificar");
    casillaVacia.appendChild(document.createElement('p'));
    let respaldoCasillas=[[], [], [], [], [], [], [], [], []];
    let btnReiniciar=document.getElementById("reiniciar");
    crearTablero(tablero);
    
    let casillas = document.getElementsByClassName("casilla");
    let generadorSudoku = new GeneradorSudoku(casillas);
    casillas = generadorSudoku.tablero;
    document.addEventListener('keydown', e => {
        if (parseInt(e.key) > 0 && parseInt(e.key) < 10) {
            let cuadrado = cuadradoSeleccionado.id.split('|')[0];
            let posicion = cuadradoSeleccionado.id.split('|')[1];
            let valor= e.key;
            let borrar=false;
            if (cuadradoSeleccionado.childNodes[0].innerText.includes(e.key) && cuadradoSeleccionado.childNodes[0].className === "pValor") {
                cuadradoSeleccionado.childNodes[0].innerText="";
                generadorSudoku.valoresFinales[cuadrado][posicion]="";
                respaldoCasillas[cuadrado][posicion]="";
                borrar=true;
            }
            if (botonSetAccion.className === "valorFinal" && !borrar) {
                cuadradoSeleccionado.childNodes[0].className = "pValor";
                limpiarPorValorFinal(cuadrado,posicion,valor,casillas);
                cuadradoSeleccionado.childNodes[0].innerText = e.key;
                generadorSudoku.valoresFinales[cuadrado][posicion]=valor;
                respaldoCasillas[cuadrado][posicion]=valor;
                if (cuadradoSeleccionado.childNodes[0].innerText.includes(numeroResaltado.innerHTML)) {
                    cuadradoSeleccionado.className = "casillaResaltada"
                }
            } else if(!borrar){
                if (cuadradoSeleccionado.childNodes[0].innerText.includes(e.key)) {
                    let separacion = cuadradoSeleccionado.childNodes[0].innerText.split(e.key);
                    cuadradoSeleccionado.childNodes[0].innerText = separacion[0] + separacion[1];
                    console.log(cuadradoSeleccionado.childNodes[0].innerText.length);
                }else if(cuadradoSeleccionado.childNodes[0].innerText.length < 10) {
                    cuadradoSeleccionado.childNodes[0].className = "pAnotacion";
                    cuadradoSeleccionado.childNodes[0].innerText += e.key;
                }
                respaldoCasillas[cuadrado][posicion]=cuadradoSeleccionado.childNodes[0].innerText+"a";
                if (cuadradoSeleccionado.childNodes[0].innerText.includes(numeroResaltado.innerHTML)) {
                    cuadradoSeleccionado.className = "casillaResaltada"
                }
            }
        }
    });
    document.addEventListener('keydown', e =>{
        if(e.key === 'c'){
            if (botonSetAccion.className === "anotacion") {
                botonSetAccion.className = "valorFinal";
                botonSetAccion.innerText="1";
            } else {
                botonSetAccion.className = "anotacion";
                botonSetAccion.innerText="1234";
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
                desResaltarNumeros(casillas,sudokuResuelto);
                resaltarNumeros(numeroResaltado.innerText, casillas,sudokuResuelto);
            }else{
                numeroResaltado.className="numero";
                desResaltarNumeros(casillas,sudokuResuelto);
            }
        }
    });
    btnSolucionar.onmousedown= () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                casillas[i][j].childNodes[0].className="pValor";
                casillas[i][j].childNodes[0].innerText = generadorSudoku.solucion[i][j];
            }
        }
    }
    btnSolucionar.onmouseup= () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(respaldoCasillas[i][j].length > 1){
                    casillas[i][j].childNodes[0].className="pAnotacion";
                    casillas[i][j].childNodes[0].innerText=respaldoCasillas[i][j].split("a")[0];
                }else{
                    casillas[i][j].childNodes[0].innerText=respaldoCasillas[i][j]
                }
            }
        }
    }
    btnAnotacion.onclick = () => {
        generadorSudoku.setValoresPosibles();
        generadorSudoku.colocarAnotaciones();
    }
    botonSetAccion.onclick = () => {
        if (botonSetAccion.className === "anotacion") {
            botonSetAccion.className = "valorFinal";
            botonSetAccion.innerText="1";
        } else {
            botonSetAccion.className = "anotacion";
            botonSetAccion.innerText="1234";
        }
    }
    botonGenerar.onclick= () =>{
        sudokuResuelto = false;
        let inicio=new Date();
        let tiempoInicio=inicio.getMinutes()+":"+inicio.getSeconds()+","+inicio.getMilliseconds();

        generadorSudoku.getSolucionGenerada();
        generadorSudoku.quitarValores(0, 50, [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []]);
        generadorSudoku.setValoresPredeterminados();
        generadorSudoku.llenarValoresPredeterminados();
        cuadradoSeleccionado=casillaVacia;

        let final = new Date();
        let tiempoFinal = final.getMinutes() + ":" + final.getSeconds() + "," + final.getMilliseconds();
        console.log(tiempoInicio+"  "+tiempoFinal);
        for (let i = 0; i < 9; i++) {
           for (let j = 0; j < 9; j++) {
               respaldoCasillas[i][j]=casillas[i][j].childNodes[0].innerText;
           }
        }
    }
    botonVaciar.onclick= () => {
        sudokuResuelto = false;
        generadorSudoku.vaciarTablero();
    }
    btnValidar.onclick= () => {
        const animacion=generadorSudoku.tablero;
        let posicionErronea = isSolucionCorrecta(generadorSudoku);
        if(posicionErronea === ""){
            sudokuResuelto=true;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if(animacion[i][j].className === "casillaPredeterminada" || animacion[i][j].className === "casillaPreResaltada"){
                        animacion[i][j].className ="valorCorrectoCasillaPre";
                    }else{
                        animacion[i][j].className ="valorCorrectoCasilla";
                    }
                    
                }
            }
        }else{
            animacion[posicionErronea[0]][posicionErronea[1]].className ="casilla valorErroneo";
            setTimeout(() => {
                animacion[posicionErronea[0]][posicionErronea[1]].className ="casilla";
            }, 1000);
        }
    }
    btnReiniciar.onclick = () => {
        generadorSudoku.reiniciarPartida();
    }
}
function resaltarNumeros(numero, tablero, sudokuResuelto){
    if(!sudokuResuelto){
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
    
}
function desResaltarNumeros(tablero, sudokuResuelto){
    if(!sudokuResuelto){
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let casilla = tablero[i][j];
                if (casilla.className === "casillaPreResaltada") { casilla.className = "casillaPredeterminada"; continue;}
                if (casilla.className != "casillaPredeterminada") casilla.className = "casilla"
            }
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
            if (generadorSudoku.valoresFinales[i][j] !== generadorSudoku.solucion[i][j]) return [i,j];
        }        
    }
    return "";
}