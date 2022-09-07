document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div')) // los toma todos y los pone en un array, y ahora cada uno va a tener un numero de indice especifico
    const scoreDisplay = document.querySelector("#score")
    const startBtn = document.querySelector('#start-button')
    const width = 10;
    let nextRandom = 0 // le pone un valor 0 pero luego freeze se va a encargar de darle el real
    let timerId
    let score = 0
    let speed = 500
    const colors = [
        'green',
        'purple',
        'orange',
        'blue',
        'red'
    ]

    // tetrominos

    const lTetromino = [ // empieza como un array con 4 arrays adentro, cada uno es una posicion diferente
        [1, width + 1, width * 2 + 1, 2], // 1 es el indice 1, 10 + 1, 20 + 1, 2 >> todos son indices dentro de la tabla y las formulas son para ubicarlos 
        [width, width + 1, width + 2, width * 2 + 2], // cada una es una rotacion
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromio = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, tTetromio, zTetromino, oTetromino, iTetromino] // pone todas las figuras en un solo array


    let currentPosition = 4;
    let currentRotation = 0;

    // seleccionar un tetromino random y su rotacion

    let random = Math.floor(Math.random() * theTetrominoes.length) // theTetrominoes.length es el maximo inalcanzable para la multiplicacion, en este caso 5, el maximo va a ser 4
    let current = theTetrominoes[random][currentRotation] // elige cualquiera de los indices, pero siempre deja la posicion inicial en su primer valor


    //dibujar tetromino y primera rotacion del tetromino

    function draw() {
        current.forEach(index => { // para el calculo de donde va a estar cada pieza, a currentPosition(4 primero) va a sumar TODOS los valores del array por separado, el primero es 4 y 1, depsues 4 + 10, 4 + 20 +2 y asi para ubircarlo
            squares[currentPosition + index].classList.add('tetromino') // squares eran todos los divs dentro del grid, current position era el indice 4, e index va a ser la variable que va a ir cambiando al recorrer el array de current
            squares[currentPosition + index].style.backgroundColor = colors[random] // toma el indice que sea random e igual que con las figuras hay un indice asignado para cada una, ese mismo es utilizado arriba para asignar el color a cada tetromino
        }) 
    }

    // borrar tetromino

    function undraw() { // funcion para quitar la clase y hacerlo desaparecer
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = '' // para quitar el color del tetromino
        })
    }
    // mover tetrominos

    function control(e) {

        if (e.key === 'ArrowLeft') {
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowUp') {
            rotate()
        } else if (e.key === 'ArrowDown') {
            moveDown()
        }
    }
    document.addEventListener('keydown', control)
    document.addEventListener('keydown', control)
    document.addEventListener('keydown', control)



    function moveDown() {
        undraw()
        currentPosition += width // a la posicion en la que empieza primero la borra, le suma width para que suba indices (y baje la pieza) y luego redibuja
        draw()
        freeze()
    }

    // detener 

    // current es cualquier tetromino random del array theTetrominoes

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            // 4(va a ir sumando)  + la posicion inical de la pieza + 10 (osea una linea mas abajo) si cualquiera de los cuadrados que estan justo abajo del tetromino da true al preguntarle si tiene la clase taken
            current.forEach(index => squares[currentPosition + index].classList.add('taken')) // le agrega la clase 'taken' al tetromino
            // start a new tetromino// la pregunta es por que se detiene...
            random = nextRandom // el valor next random se pasa a random para que sea lo proximo que salga cuando tenga el valor random en current
            // al pasar eso reestablece valores y eso hace que se vea otro desde arriba 
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4 // esto es lo que hace que la siguiente pieza este arriba de nuevo
            displayShape()
            addScore()
            gameOver()
        }
    }

    // mover hacia la izquierda a no ser que haya un limite u otro tetromino

    function moveLeft() {

        undraw() // lo primero que hace es quitar el tetramino
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) // comprueba si cualquier cuadrado del tetromino esta sobre un indice multiplo de 10, es decir, si el some da true

        if (!isAtLeftEdge) { // si esto NO es verdad, entonces se va a poder mover
            currentPosition -= 1 // lo mueve 1 a la izquierda y como antes los dibuja a todos a partir de ese movimiento
        }
        // si el elemento a donde se movio cumple con la condicion de tener la clase 'taken', lo va a devolver a su lugar original. lo que hay que entender es que squares[currentPosition + index] es la posicion actual del index y entonces le esta preguntando si la consigna es verdadera
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // mover hacia la derecha a no ser que haya un limite u otro tetromino

    function moveRight() {

        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1) // si un indice es divisible por 10 y el resto es igual a 9. ej: si currentPosition fuese 8, index 1 da 9, al dividirlo por 10 da 0 y un resto de 9, entonces no debera desplazarse
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw() // redibuja el tetromino en su nueva posicion
    }

    // rotar tetromino

    function rotate() {

        undraw()
        currentRotation++
        if (currentRotation == current.length) { // cuando llegue al 4 (recordar que los indices van del 0 al 3)
            currentRotation = 0 // vuelve al 0
        }
        current = theTetrominoes[random][currentRotation] // si eso es falso, osea si todavia no llego a 4, current va a ser cualquier pieza random con el currentRotation asignado
        draw() // luego lo dibuja
    }

    // mostar 'next up' tetromino

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //tetrominos sin rotaciones 

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]

    // mostrar la figura en el display

    function displayShape() {
        // remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => { // para cada uno dentro de displaySquares (que esta tomando todos los que tienen la clase .mini-grid)
            square.classList.remove('tetromino') // les quita la clase tetromino
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino') // a los cuadrados alcanzados por la forma del tetromino que es displayIndex (similar al 4, para ubicarlo) + index que son TODAS las medidas con las que va a hacer la forma, les agrega la clase 'tetromino'
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        }) // a este le va a pasar cualquier valor random que se va a generar en la funcion freeze y que le va a dar el mimso valor a random y nextRandom
    }

    // agregar boton de start y pausa

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            timerId = setInterval(moveDown, speed)

        }
    })

    // agregar puntaje

    function addScore() {
        for (let i = 0; i < 199; i += width) { // recorre toda la grilla y le suma 10 a i
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9] // esto es una linea

            if (row.every(index => squares[index].classList.contains('taken'))) { // si todos los elementos de la linea contienen la clase taken 
                score += 10 // agrega 10 puntos
                if (score % 50 == 0) {
                    speed -= 15
                }
                scoreDisplay.innerHTML = score // suma ese puntaje
                row.forEach(index => {
                    squares[index].classList.remove('taken') // les quita la clase para que pueda volver a ser usado el cuadro
                    squares[index].classList.remove('tetromino') // quita la clase tetromino para que no se vea arriba cuando la vuelva a pegar
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width) // cuando todos los cuadrados de una row tengan la clase 'taken' lo que va a hacer es quitar todos ellos de squares
                squares = squaresRemoved.concat(squares) // luego al array conformado por todos los cuadros que componen el grid le agrega esa linea quitada, para que no quede con cuadros de menos
                squares.forEach(cell => grid.appendChild(cell)) // al hacerle el appendChild a la grilla los coloca ARRIBA
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId)
            document.removeEventListener('keydown', control)
        }
    }

























})