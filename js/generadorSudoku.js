export default class GeneradorSudoku {
    tablero;
    valoresFinales;
    anotaciones;
    solucion;
    valoresPredeterminados;
    constructor(tablero) {
        this.tablero = tablero;
        this.tablero=this.darFormatoATablero();
        this.valoresFinales = [[], [], [], [], [], [], [], [], []];
        this.anotaciones = [[], [], [], [], [], [], [], [], []];
        this.solucion = [[], [], [], [], [], [], [], [], []];
        this.inicializarTableros();
    }
    /*
        Params
        tablero: Conjunto de nodos de clase casilla 
    */
    darFormatoATablero() {
        let tableroModificado = [[], [], [], [], [], [], [], [], []];
        for (let i = 0; i < 81; i++) {
            tableroModificado[Math.floor(i / 9)][i % 9] = this.tablero[i];
        }
        return tableroModificado;
    }
    /*
        Params
        valores: Matriz de 9 arreglos con 9 posiciones con valores enteros del tablero
        tablero: Matriz de 9 arreglos con 9 posiciones con nodos de clase casilla
    */
    llenarTablero() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tablero[i][j].childNodes[0].innerText = this.valoresFinales[i][j];
                this.tablero[i][j].childNodes[0].className = "pValor";
            }
        }
    }
    llenarValoresPredeterminados(){
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tablero[i][j].childNodes[0].innerText = this.valoresFinales[i][j];
                if (this.valoresFinales[i][j] != ""){
                    this.tablero[i][j].childNodes[0].className = "pPredeterminado";
                    this.tablero[i][j].className = "casillaPredeterminada";
                } 
            }
        }
    }
    /*
       params

    */
    inicializarTableros(){
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.valoresFinales[i][j]="";
                this.anotaciones[i][j]=""; 
            }            
        }
    }
    vaciarTablero() {
        this.inicializarTableros();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tablero[i][j].className = "casilla";
                this.tablero[i][j].childNodes[0].className = "pAnotacion";
                this.tablero[i][j].childNodes[0].innerText = "";
            }
        }
    }
    getSolucionGenerada(){
        let casillasVacias;
        let i=0;
        do {
            this.vaciarTablero();
            this.generarSolucion();
             i++;
             casillasVacias = this.hayCasillasVacias()
        } while (casillasVacias && i !== 60);
        this.setSolucion();
        this.llenarTablero();
    }
    generarSolucion() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.anotaciones[i][j]="123456789";
            }
        }
        let contador = 0;
        let condicion;
        do {
            const cuadrado = Math.floor(Math.random() * (9));
            const posicion = Math.floor(Math.random() * (9));
            let posibilidades = this.anotaciones[cuadrado][posicion];
            if (posibilidades !== "0") {
                posibilidades = posibilidades.split("");
                const valor = posibilidades[Math.floor(Math.random() * posibilidades.length)];
                this.limpiarPosibilidadesSegunValor(cuadrado, posicion, valor);
                this.anotaciones[cuadrado][posicion] = "0";
                this.valoresFinales[cuadrado][posicion] = valor;
                condicion = this.setValoresFinales(0);
            }
            contador++;
        } while (!(condicion[0]) && !(condicion[1]) && contador < 200);
    }
    setValoresFinales(iteracion) {
        let cantidadValoresColocados = this.setCandidatosUnicos(0);
              
        cantidadValoresColocados += this.setCandidatosOcultos(cantidadValoresColocados);

        cantidadValoresColocados += this.setCandidatosDeFila(cantidadValoresColocados);

        cantidadValoresColocados += this.setCandidatosDeColumna(cantidadValoresColocados);
        
        let tableroLleno = this.isTableroLleno();
        let casillasVacias = this.hayCasillasVacias();
        let condiciones = [tableroLleno, casillasVacias]

        if (!(tableroLleno || casillasVacias || cantidadValoresColocados === 0) && iteracion !=10) {
            iteracion++;
            condiciones = this.setValoresFinales(iteracion);
        }
        return condiciones;
    }
    setCandidatosUnicos(cantidadValoresColocados){
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.anotaciones[i][j].length === 1 && this.anotaciones[i][j] != 0) {
                    const valor = this.anotaciones[i][j];
                    this.limpiarPosibilidadesSegunValor(i, j, valor);
                    this.valoresFinales[i][j] = valor;
                    this.anotaciones[i][j] = "0";
                    cantidadValoresColocados++;
                }
            }
        }
        return cantidadValoresColocados;
    }
    setCandidatosOcultos(cantidadValoresColocados){
        let posicionDeValores = [[], [], [], [], [], [], [], [], [], []];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.anotaciones[i][j] != 0) {
                    let valoresCasilla = this.anotaciones[i][j].split("");
                    valoresCasilla.forEach(e => {
                        if (e > 0 && e < 10) posicionDeValores[e].push(e + "|" + i + "|" + j);
                    });
                }
            }
            posicionDeValores.forEach(e => {
                if (e.length === 1) {
                    let info = e[0].split("|");
                    let cuadrado = info[1];
                    let posicion = info[2];
                    let valor = info[0];
                    cantidadValoresColocados++;
                    this.limpiarPosibilidadesSegunValor(cuadrado, posicion, valor);
                    this.valoresFinales[cuadrado][posicion] = valor;
                    this.anotaciones[cuadrado][posicion] = "0";
                }
            });
            posicionDeValores = [[], [], [], [], [], [], [], [], [], []];
        }
        return cantidadValoresColocados;
    }
    setCandidatosDeFila(cantidadValoresColocados){
        let posicionDeValores = [[], [], [], [], [], [], [], [], [], []];
        let cuadrado = 0;
        let posicion = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.anotaciones[cuadrado][posicion] != 0) {
                    let valoresCasilla = this.anotaciones[cuadrado][posicion].split("");
                    valoresCasilla.forEach(e => {
                        if (e > 0) posicionDeValores[e].push(e + "|" + cuadrado + "|" + posicion);
                    });
                }
                if (j % 3 === 2) {
                    cuadrado++;
                    posicion -= 2;
                } else {
                    posicion++;
                }
            }
            if (i % 3 !== 2) {
                cuadrado -= 3;
                posicion += 3;
            } else {
                posicion = 0;
            }
            let salir = false;
            posicionDeValores.forEach(e => {
                if (e.length === 1 && !salir) {
                    let info = e[0].split("|");
                    let cuadrado = info[1];
                    let posicion = info[2];
                    let valor = info[0];
                    cantidadValoresColocados++;
                    this.limpiarPosibilidadesSegunValor(cuadrado, posicion, valor);
                    this.valoresFinales[cuadrado][posicion] = valor;
                    this.anotaciones[cuadrado][posicion] = "0";
                    salir = true;
                }
            });
            posicionDeValores = [[], [], [], [], [], [], [], [], [], []];
        }
        return cantidadValoresColocados;
    }
    setCandidatosDeColumna(cantidadValoresColocados){
        let posicionDeValores = [[], [], [], [], [], [], [], [], [], []];
        let posicion = 0;
        let cuadrado = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.anotaciones[cuadrado][posicion] != 0) {
                    let valoresCasilla = this.anotaciones[cuadrado][posicion].split("");
                    valoresCasilla.forEach(e => {
                        if (e > 0 && e < 10) posicionDeValores[e].push(e + "|" + cuadrado + "|" + posicion);
                    });
                }
                if (j % 3 === 2) {
                    cuadrado += 3;
                    posicion -= 6;
                } else {
                    posicion += 3;
                }
            }
            if (i % 3 !== 2) {
                cuadrado -= 9;
                posicion++;
            } else {
                posicion = 0;
                cuadrado -= 8;
            }
            let salir = false;
            posicionDeValores.forEach(e => {
                if (e.length === 1 && !salir) {
                    let info = e[0].split("|");
                    let cuadrado = info[1];
                    let posicion = info[2];
                    let valor = info[0];
                    cantidadValoresColocados++;
                    this.limpiarPosibilidadesSegunValor(cuadrado, posicion, valor);
                    this.valoresFinales[cuadrado][posicion] = valor;
                    this.anotaciones[cuadrado][posicion] = "0";
                    salir = true;
                }
            });
            posicionDeValores = [[], [], [], [], [], [], [], [], [], []];
        }
        return cantidadValoresColocados;
    }
    limpiarPosibilidadesSegunValor(cuadrado, posicion, valor) {
        if (this.anotaciones[cuadrado][posicion].length != 0){
            for (let j = 0; j < 9; j++) {   //Recorre el cuadrante de donde ponemos el valor
                if (this.anotaciones[cuadrado][j].includes(valor)) {
                    let separacion = this.anotaciones[cuadrado][j].split(valor)
                    this.anotaciones[cuadrado][j] = separacion[0] + separacion[1];
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
                if (this.anotaciones[inicioCuadradoHor][inicioFila].includes(valor)) {
                    let separacion = this.anotaciones[inicioCuadradoHor][inicioFila].split(valor)
                    this.anotaciones[inicioCuadradoHor][inicioFila] = separacion[0] + separacion[1];
                }
                if (j % 3 === 2) {
                    inicioCuadradoHor++;
                    inicioFila -= 2;
                } else {
                    inicioFila++;
                }
            }
            for (let j = 0; j < 9; j++) { //recorrer la columna
                if (this.anotaciones[inicioCuadradoVer][inicioColumna].includes(valor)) {
                    let separacion = this.anotaciones[inicioCuadradoVer][inicioColumna].split(valor)
                    this.anotaciones[inicioCuadradoVer][inicioColumna] = separacion[0] + separacion[1];
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
    hayCasillasVacias() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.anotaciones[i][j].length === 0) {
                    return true;
                }
            }
        }
        return false;
    }
    isTableroLleno() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.valoresFinales[i][j]=="") return false;
            }
        }
        return true;
    }
    setSolucion(){
        for (let i = 0; i < 9; i++) {
           for (let j = 0; j < 9; j++) {
              this.solucion[i][j]=this.valoresFinales[i][j];
           }
        }
    }
    /*
        Descripci[on: Este m[etodo es el encargado de tomar la soluci[on generada y quitarle valores hasta llegar a un sudoku al que 
        le falten valores y se pueda resolver. El proceso que se realiza es el siguiente: se quita un valor aleatorio, se comprueba si
        el sudoku se puede solucionar, si se puede el m[etodo se llamar[a a si mismo hasta quitar un n[umero espec[ifico de valores, sino
        se volver[a a colocar el valor anteriormente quitado y se intentar[a con otro. 
    */
    quitarValores(iteracion, maxIteracion, valoresPrevios, valoresMenosUno){
        let validar=false; //Esta variable va a ser la que indique si el valor que se quita permite una soluci[on [unica o no
        do {
            validar=false;
            const cuadrado = Math.floor(Math.random() * (9));
            const posicion = Math.floor(Math.random() * (9));
            if(this.valoresFinales[cuadrado][posicion] !=""){
                this.valoresFinales[cuadrado][posicion] = "";
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        valoresMenosUno[i][j] = this.valoresFinales[i][j];
                    }
                }
                this.solucionarSudoku();
                if (this.isTableroLleno()) {
                    validar = true;
                } else {
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            this.valoresFinales[i][j] = valoresPrevios[i][j];
                        }
                    }
                }
            }
        } while (!validar);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.valoresFinales[i][j] = valoresMenosUno[i][j];
                valoresPrevios[i][j] = valoresMenosUno[i][j];
            }
        }
        if(iteracion !== maxIteracion){
            iteracion++
            this.quitarValores(iteracion, maxIteracion, valoresPrevios, valoresMenosUno);
        }
    }

    solucionarSudoku(){
        this.setValoresPosibles();
        this.setValoresFinales();
    }
    setValoresPosibles() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.anotaciones[i][j] = "123456789";
            }
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.valoresFinales[i][j] != ""){
                    this.anotaciones[i][j] = "0";
                    this.limpiarPosibilidadesSegunValor(i, j, this.valoresFinales[i][j]);
                }                
            }
        }
    }
    colocarAnotaciones(){
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.anotaciones[i][j] != 0){
                    let valor = this.anotaciones[i][j];
                    if (valor.length > 6){
                        const extra = valor.length - 6;
                        valor = valor.substring(0, valor.length - extra)
                        + "\n" 
                        + valor.substring(valor.length - extra, valor.length);
                    }
                    this.tablero[i][j].childNodes[0].innerText = valor;
                    this.tablero[i][j].childNodes[0].className = "pAnotacion";
                }
            }
        }
    }
}