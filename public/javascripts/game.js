var camera, controls, scene, renderer, raycaster;
var mouse = new THREE.Vector2(),
    INTERSECTED;
var cubes = [];
const CUBE_DISTANCE = 400;
var $container = $('#game-container');
var socket = io();
var search = new URLSearchParams(window.location.search)
var room = search.get('room');

var isTurn = false;

if (room) {
    // player 2
    socket.emit('join game', room);
    setStatus('Waiting for other player');
} else {
    // player 1
    socket.emit('new game');
    setStatus('Waiting for other player');
}

// player 1
socket.on('new game', (room) => {
    console.log('joined room ' + room);
});

// player 1
socket.on('player joined', () => {
    isTurn = true;
    setStatus("It's your turn!");
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

$('#chat').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

init();
animate();

function init() {
    console.log('running');
    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera(45, $container.innerWidth() / gameHeight(), 1, 20000);
    camera.position.z = 2000;
    camera.position.x = 2000;
    camera.position.y = 1500;

    controls = new THREE.TrackballControls(camera, $container[0]);
    controls.addEventListener('change', render);
    scene = new THREE.Scene();

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2000, 2000, 1500).normalize();
    scene.add(light);

    for (var i = 0; i < 27; i++) {
        var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
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

    document.addEventListener('click', onDocumentMouseDown, false);
    $container[0].addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

// function onDocumentMouseDown( event ) {                
//     var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   //x
//                             -( event.clientY / window.innerHeight ) * 2 + 1,  //y
//                             0.5 );                                            //z
//     projector.unprojectVector( mouse3D, camera );   
//     mouse3D.sub( camera.position );                
//     mouse3D.normalize();
//     var raycaster = new THREE.Raycaster( camera.position, mouse3D );
//     var intersects = raycaster.intersectObjects( objects );
//         // Change color if hit block
//     if ( intersects.length > 0 ) {
//           intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
//     }
//  }


function onDocumentMouseDown(event) {

    var mouse3D = new THREE.Vector3(mouse.x, //x
        mouse.y, //y
        0.5); //z
    //  var raycaster = projector.pickingRay( mouse3D.clone(), camera );
    // var intersects = raycaster.intersectObjects( objects );
    
    raycaster.setFromCamera(mouse3D, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    // Change color if hit block
    if (intersects.length > 0) {
        console.log(intersects[0].object.material);
        if (intersects[0].object.material.wireframe == true) {
            intersects[0].object.material.wireframe = false;
        } else {
            intersects[0].object.material.wireframe = true;
        }
        //change color later
        // if(intersects[ 0 ].object.material.color.getHexString() == '00fbff'){//if blue
        //     intersects[ 0 ].object.material.color.setHex(0x000000);//then black
        // }
        // else if(intersects[ 0 ].object.material.color.getHexString() == '000000'){//if black
        //     intersects[ 0 ].object.material.color.setHex (0x00FBFF);//else blue
        // }
        // else if(intersects[ 0 ].object.material.color.getHexString() == 'ffffff'){
        //     intersects[ 0 ].object.material.color.setHex (0x00FBFF);   
        // }

        //Game check function is initiated from here 
        gameCheck();

    }
}


function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = ((event.clientX - $container[0].offsetLeft) / renderer.domElement.width) * 2 - 1;
    mouse.y = - ((event.clientY - $container[0].offsetTop) / renderer.domElement.height) * 2 + 1;
}


function onWindowResize() {
    camera.aspect = $container.innerWidth() / gameHeight();
    camera.updateProjectionMatrix();
    renderer.setSize($container.innerWidth(), gameHeight());
}



function gameCheck() {

}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}


function render() {
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    // find intersections
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

function offSetTop() {
    
}