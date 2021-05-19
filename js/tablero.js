export function crearTablero(tablero, cuadradoSeleccionado) {
    for (let i = 0; i < 9; i++) {
        let cuadrado = document.createElement('div');
        cuadrado.className = "cuadrado";
        tablero.appendChild(cuadrado);
        for (let j = 0; j < 9; j++) {
            let valor = document.createElement('p');
            let casilla = {
                elemento: document.createElement('div'),
                seleccionado: false
            };
            casilla.elemento.className = "casilla";
            casilla.elemento.onclick = function () {
                if (casilla.seleccionado) {
                    casilla.elemento.className = "casilla";
                    casilla.seleccionado = false;
                    cuadradoSeleccionado = document.createElement('div');
                } else {
                    casilla.elemento.className = "casillaSelec";
                    casilla.seleccionado = true;
                    if (casilla.elemento !== cuadradoSeleccionado) {
                        cuadradoSeleccionado.className = "casilla";
                        cuadradoSeleccionado = casilla.elemento;
                    }
                }
            };
            casilla.elemento.appendChild(valor);
            cuadrado.appendChild(casilla.elemento);
        }
    }
}   
export function eventoEscribirValores(cuadradoSeleccionado) {
    document.addEventListener('keydown', e => {
        if (parseInt(e.key) > 0 && parseInt(e.key) < 10) {
            console.log(e.code, " ", e.key);
            cuadradoSeleccionado.childNodes[0].innerText = e.key;
        }
    });
}
