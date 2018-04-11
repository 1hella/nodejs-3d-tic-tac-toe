var camera, controls, scene, renderer, raycaster;
var mouse = new THREE.Vector2(),
    INTERSECTED;
var cubes = [];
const CUBE_DISTANCE = 400;
var $container = $('#game-container');

var index = window.location.href.lastIndexOf('/')
var href = window.location.href.substr(0, index + 1);
var socket = io(href);

var search = new URLSearchParams(window.location.search);
var room = search.get('room');
const BOARD_COLOR = 0x9932CC;
const PLAYER_1_COLOR = 0xff0000;
const PLAYER_2_COLOR = 0x0000ff;

const WINNING_COMBINATIONS = [
    // horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14],
    [15, 16, 17],
    [18, 19, 20],
    [21, 22, 23],
    [24, 25, 26],

    // horizontal other way
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [9, 12, 15],
    [10, 13, 16],
    [11, 14, 17],
    [18, 21, 24],
    [19, 22, 25],
    [20, 23, 26],

    // horizontal diagonals
    [0, 4, 8],
    [2, 4, 6],
    [9, 13, 17],
    [11, 13, 15],
    [18, 22, 26],
    [20, 22, 24],

    // vertical
    [0, 9, 18],
    [1, 10, 19],
    [2, 11, 20],
    [3, 12, 21],
    [4, 13, 22],
    [5, 14, 23],
    [6, 15, 24],
    [7, 16, 25],
    [8, 17, 26],

    //  top edge to bottom edge diagonals
    [0, 10, 20],
    [18, 10, 2],
    [3, 13, 23],
    [21, 13, 5],
    [6, 16, 26],
    [24, 16, 8],

    [0, 12, 24],
    [6, 12, 18],
    [1, 13, 25],
    [7, 13, 19],
    [2, 14, 26],
    [8, 14, 20],

    // top corner to opposite bottom corner diagonals
    [0, 13, 26],
    [2, 13, 24],
    [6, 13, 20],
    [8, 13, 18]
];

var board = new Array(27);
board.fill(0);

var isTurn;
var isPlayer1;

if (room) {
    // player 2
    socket.emit('join game', room);
    setTurn(false);
    isPlayer1 = false;
} else {
    // player 1
    socket.emit('new game');
    isTurn = false;
    setStatus('Waiting for other player to join');
    isPlayer1 = true;
}

// player 1
socket.on('new game', room => {
    console.log('joined room ' + room);
});

// player 1
socket.on('player joined', () => {
    setTurn(true);
    setStatus("It's your turn!");
});

socket.on('opponent move', serverBoard => {
    board = serverBoard;
    drawBoard();
    if (!checkForWinner()) {
        setTurn(true);
    }
});

socket.on('game lose', winner => {
    alert(winner + ' wins!');
    location = '/dashboard';
})

socket.on('user disconnected', username => {
    alert(username + ' disconnected! You win!');
    location = '/dashboard';
})

socket.on('err', (err) => {
    alert(err);
    window.location = '/dashboard';
});

socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
});

socket.on('chat meta', (msg) => {
    addChatMeta(msg);
});

function addChatMeta(msg) {
    $('#messages').append($('<li class="chat-meta">').text(msg));
}

function setStatus(msg) {
    $('#status').text(msg);
}

function setTurn(turn) {
    isTurn = turn;
    if (turn) {
        setStatus('It\'s your turn!');
    } else {
        setStatus('It\'s the other player\'s turn!');
    }
}

function getMoveCount() {
    return board.filter(move => move !== 0).length;
}

$('#chat').submit(() => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

$('#reset-camera').click(resetCamera);

function drawBoard() {
    for (var i = 0; i < board.length; i++) {
        var cube = cubes[i];
        var move = board[i];
        if (move === 0) {
            cube.material.color.setHex(BOARD_COLOR);
        } else if (move === 1) {
            cube.material.color.setHex(PLAYER_1_COLOR);
        } else {
            cube.material.color.setHex(PLAYER_2_COLOR);
        }
    }
}

init();
animate();

function resetCamera() {
    camera.position.z = 2000;
    camera.position.x = 2000;
    camera.position.y = 1500;
}

function init() {
    console.log('running');
    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera(45, $container.innerWidth() / gameHeight(), 1, 20000);
    resetCamera();

    controls = new THREE.TrackballControls(camera, $container[0]);
    controls.addEventListener('change', render);
    scene = new THREE.Scene();

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2000, 2000, 1500).normalize();
    scene.add(light);

    for (var i = 0; i < 27; i++) {
        var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshLambertMaterial({
            color: BOARD_COLOR
        }));

        // x
        if (i % 3 === 1) {
            cube.position.x = CUBE_DISTANCE;
        } else if (i % 3 === 2) {
            cube.position.x = CUBE_DISTANCE * 2;
        }

        // y
        if (i % 9 >= 6) {
            cube.position.y = CUBE_DISTANCE * 2;
        } else if (i % 9 >= 3) {
            cube.position.y = CUBE_DISTANCE;
        }

        // z
        if (i >= 18) {
            cube.position.z = CUBE_DISTANCE * 2;
        } else if (i >= 9) {
            cube.position.z = CUBE_DISTANCE;
        }

        cubes.push(cube);
        scene.add(cube);
    }

    scene.background = new THREE.Color(0xffffff);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize($container.innerWidth(), gameHeight());
    // renderer.setPixelRatio(window.devicePixelRatio);
    $container.append(renderer.domElement);

    $container[0].addEventListener('click', onDocumentMouseDown, false);
    $container[0].addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onDocumentMouseDown(event) {
    var mouse3D = new THREE.Vector3(mouse.x, mouse.y, 0.5);

    raycaster.setFromCamera(mouse3D, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        var cube = intersects[0].object;
        var index = cubes.indexOf(cube);
        console.log(index);

        if (!isTurn) {
            alert('it\'s not your turn!');
            return;
        }

        if (board[index] === 0) {
            board[index] = isPlayer1 ? 1 : 2;
            socket.emit('game move', board);
        } else {
            alert('You can\'t go there!');
            return;
        }

        if (isPlayer1) {
            cube.material.color.setHex(PLAYER_1_COLOR);
        } else {
            cube.material.color.setHex(PLAYER_2_COLOR);
        }

        setTurn(false);
        checkForWinner();
    }
}


function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = ((event.clientX - $container[0].offsetLeft) / renderer.domElement.width) * 2 - 1;
    mouse.y = -((event.clientY - $container[0].offsetTop) / renderer.domElement.height) * 2 + 1;
}


function onWindowResize() {
    camera.aspect = $container.innerWidth() / gameHeight();
    camera.updateProjectionMatrix();
    renderer.setSize($container.innerWidth(), gameHeight());
}



function checkForWinner() {
    if (getMoveCount >= 27) {
        socket.emit('tie');
        alert('Tie!');
        window.location = '/dashboard';
        return;
    }

    playerNumber = isPlayer1 ? 1 : 2;
    for (winningCombination of WINNING_COMBINATIONS) {
        if (board[winningCombination[0]] === board[winningCombination[1]] &&
            board[winningCombination[1]] === board[winningCombination[2]] &&
            board[winningCombination[0]] !== 0) {
            if (board[winningCombination[0]] === playerNumber) {
                socket.emit('game win', {
                    numMoves: getMoveCount,
                    board: board
                });
                alert('You win!');
                window.location = '/dashboard';
            } else {
                return true;
            }
        }
    }
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}


function render() {
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }
    renderer.render(scene, camera);
}

function gameHeight() {
    var headerHeight = $('.header').innerHeight();
    var chatHeight = 80;
    var statusHeight = 55;
    var $body = $('body');
    var bodyPadding = parseInt($body.css('padding-top')) + parseInt($body.css('padding-bottom'));
    return Math.floor(window.innerHeight - headerHeight - bodyPadding) - chatHeight - statusHeight;
}