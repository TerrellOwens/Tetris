//THIS WILL BE LOADED WHEN CONTENT IS LOADED
document.addEventListener('DOMContentLoaded', () => {

    playSound = (soundID) => {
        soundID.play();
    }



    let grid = document.querySelector('.grid')
    let boxes = Array.from(document.querySelectorAll('.grid div'))
    let score = document.querySelector('#score')
    //
    if (!localStorage.getItem('turn')) {
        localStorage.setItem('turn', 1)
    }
    const localTurn = localStorage.getItem('turn')
    let turn = localTurn
    if (turn == 1) {
        swal("Player 1 has entered the dream world...", "Raise hunter");
    } else if (turn == 2) {
        swal("Player 1 has entered the dream world...", "Raise hunter");
    }
    let Player1level = document.querySelector('#level')

    const startBtn = document.querySelector('#startBtn')
    const pBtn = document.querySelector('#pBtn')
    const height = 10
    let rotation = 0
    document.addEventListener('keyup', controls)
    let displayScore = 0
    let displayLevel = 1
    let currentShape;
    let colors = [
        '#9A1818',
        '#34302F',
        '#1A0B06',
        '#7F3335',
        '#99585C',
        '#C5A8AA'
    ]

    //CURRENT POSTION ON GRID THAT BLOCKS WILL COME FROM
    let currentPosition = 4,
        shape,
        timer

    //INDEX explained:
    //height = 10
    //[1, height+1, height*2+1, 2]
    //after factoring in height:
    //=[01, 11, 21, 02]
    //taking those numbers as x and y values:
    //=[(0, 1), (1, 1), (2, 1), (0, 2)
    //]
    //the x and y values indicate which box to colour.
    //[0,0]  [0,1]  [0,2]
    //[1,0]  [1,1]  [1,2]
    //[2,0]  [2,1]  [2,2]

    const fBlock = [
        [1, height + 1, height * 2 + 1, 2, height],
        [0, height, height + 1, height + 2, height * 2 + 1],
        [1, height + 1, height + 2, height * 2, height * 2 + 1],
        [1, height, height + 1, height + 2, height * 2 + 2]
    ]

    const uBlock = [
        [1, height + 1, height + 2, height + 3, 3],
        [1, 2, height + 2, height * 2 + 2, height * 2 + 1],
        [height + 1, 1, 2, 3, height + 3],
        [1, 2, height + 1, height * 2 + 1, height * 2 + 2]
    ]

    const zBlock = [
        [0, height, height + 1, height * 2 + 1],
        [height + 1, height + 2, height * 2, height * 2 + 1],
        [0, height, height + 1, height * 2 + 1],
        [height + 1, height + 2, height * 2, height * 2 + 1]
    ]

    const tBlock = [
        [1, height, height + 1, height + 2],
        [1, height + 1, height + 2, height * 2 + 1],
        [height, height + 1, height + 2, height * 2 + 1],
        [1, height, height + 1, height * 2 + 1]
    ]

    const lBlock = [
        [1, height + 1, height * 2 + 1, 2],
        [height, height + 1, height + 2, height * 2 + 2],
        [1, height + 1, height * 2 + 1, height * 2],
        [height, height * 2, height * 2 + 1, height * 2 + 2]
    ]

    // const iBlock = [
    //     [1, height + 1, height * 2 + 1, height * 3 + 1, height * 4 + 1],
    //     [height, height + 1, height + 2, height + 3, height + 4]
    //     [1, height + 1, height * 2 + 1, height * 3 + 1, height * 4 + 1],
    //     [height, height + 1, height + 2, height + 3, height + 4]
    // ]

    const oBlock = [
        [0, 1, height, height + 1],
        [0, 1, height, height + 1],
        [0, 1, height, height + 1],
        [0, 1, height, height + 1]
    ]

    //ARRAY OF ALL BLOCKS TOGETHER 
    const tetrisBlocks = [fBlock, uBlock, zBlock, tBlock, lBlock, oBlock]
    const random = Math.floor(Math.random() * tetrisBlocks.length);

    function startGame() {
        newShape();
        // timer = setInterval(blockFall, 1000)
    }

    // FUNCTION FOR KEYCODES
    function controls(e) {
        if (e.keyCode === 37) {
            left()
        }
        if (e.keyCode === 38) {
            rotate()
        }
        if (e.keyCode == 39) {
            right()
        }
        if (e.keyCode === 40) {
            blockFall()
        }
    }


    function newShape() {
        currentPosition = 4
        //reset rotation back to default 0
        rotation = 0
        const random = Math.floor(Math.random() * tetrisBlocks.length);
        //RANDOM CHOICE OF WHICH BLOCK WILL APPEAR
        shape = tetrisBlocks[random][rotation]
        currentShape = random
    }

    //GET THE FIRST BLOCK
    function enterBlock() {
        for (let index of shape) {
            boxes[currentPosition + index].classList.add('blocks')
            boxes[currentPosition + index].style.backgroundColor = colors[random]
        }
    }

    function exitBlock() {
        for (let index of shape) {
            boxes[currentPosition + index].classList.remove('blocks')
            const random = Math.floor(Math.random() * tetrisBlocks.length);
            boxes[currentPosition + index].style.backgroundColor = ''
        }
    }

    // Make blocks move down
    function blockFall() {
        exitBlock()
        currentPosition += height
        enterBlock()
        stop()
    }

    // STOP BLOCKS AT BOTTOM OF GRID
    function stop() {
        const stop = shape.some(index => boxes[currentPosition + index + height].classList.contains('stop'))
        if (stop) {
            shape.forEach(index => boxes[currentPosition + index].classList.add('stop'))
            //start a new tetromino falling
            newShape()
            addScore()
            gameOver()

        }
    }



    function left() {
        exitBlock()
        const edge = shape.some(index => (currentPosition + index) % height === 0)
        if (!edge) currentPosition -= 1
        if (shape.some(index => boxes[currentPosition + index].classList.contains('stop'))) {
            currentPosition += 1
        }
        enterBlock()
    }

    function right() {
        exitBlock()
        const edge = shape.some(index => (currentPosition + index) % height === height - 1)
        if (!edge) currentPosition += 1
        if (shape.some(index => boxes[currentPosition + index].classList.contains('stop'))) {
            currentPosition += 1
        }
        enterBlock()
    }

    function rotate() {
        exitBlock()
        rotation++
        //if the current rotation gets to 4, make it go back to 0
        if (rotation === 4) {
            rotation = 0
        }
        shape = tetrisBlocks[currentShape][rotation]
        console.trace('rotation')
        enterBlock()
    }

    // ADD SCORE
    function addScore() {
        for (let i = 0; i < 199; i += height) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => boxes[index].classList.contains('stop'))) {
                displayScore += 10
                score.innerHTML = displayScore
                row.forEach(index => {
                    boxes[index].classList.remove('stop')
                    boxes[index].classList.remove('blocks')
                    boxes[index].style.backgroundColor = ''
                })
                const boxesremoved = boxes.splice(i, height)
                boxes = boxesremoved.concat(boxes)
                boxes.forEach(cell => grid.appendChild(cell))
            }
            if (displayScore == 10) {
                displayLevel++
                Player1level.innerHTML = displayLevel
            } else if (displayScore == 20) {
                Player1level++
                Player1level.innerHTML = displayLevel
            } else if (displayScore == 30) {
                Player1level++
                Player1level.innerHTML = displayLevel
            } else if (displayScore == 40) {
                Player1level++
                Player1level.innerHTML = displayLevel
            }
        }
    }

    pBtn.addEventListener('click', () => {

        if (timer) {
            clearInterval(timer)
            timer = null
        } else {

            timer = setInterval(blockFall, 1000)
        }

    })
    startBtn.addEventListener('click', () => {

        if (!timer) {
            startGame()
            timer = setInterval(blockFall, 1000)

        }
        else {
            clearInterval(timer)
        }
    })




    function gameOver() {
        if (shape.some(index => boxes[currentPosition + index].classList.contains('stop'))) {
            if (turn == 1) {
                localStorage.setItem('endScore1', displayScore)
                displayScore = 0
                score.innerHTML = '0'
                clearInterval(timer)

                // alert('hi')
                localStorage.setItem('turn', 2)
            } else if (turn == 2) {
                // localStorage.setItem('endScore2', displayScore)
                // displayScore = 0
                score.innerHTML = '0'
                clearInterval(timer)

                if (displayScore == localStorage.getItem('endScore1')) {
                    swal("Tie Game", "Stay asleep");

                } else if (displayScore > localStorage.getItem('endscore1')) {
                    swal("Player 2 has escaped the dream", "You win");
                } else if (displayScore < localStorage.getItem('endscore1')) {
                    swal("Player 1 has escaped the dream", "You win");
                }



                localStorage.clear()

            }
        }


    }



})


// let score = localStorage.getItem("score")
