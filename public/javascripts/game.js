var camera, controls, scene, renderer;
var cubes = [];
var cubeDistance = 400;
var headerHeight = 100;

init();
animate();
function init() {
    console.log('running');
    var $container = $('.container');
    camera = new THREE.PerspectiveCamera(45, $container.innerWidth() / (window.innerHeight - headerHeight), 1, 20000);
    camera.position.z = 2000;
    camera.position.x = 2000;
    camera.position.y = 1500;

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    scene = new THREE.Scene();

    for (var i= 0; i < 27; i++) {
        var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
        
        // x
        if (i % 3 === 1) {
            cube.position.x = cubeDistance;
        } else if (i % 3 === 2) {
            cube.position.x = cubeDistance * 2;
        }

        // y
        if (i % 9 >= 6) {
            cube.position.y = cubeDistance * 2;
        } else if (i % 9 >= 3) {
            cube.position.y = cubeDistance;
        }

        // z
        if (i >= 18) {
            cube.position.z = cubeDistance * 2;
        } else if (i >= 9) {
            cube.position.z = cubeDistance;
        }

        cubes.push(cube);
    }

    for (var cube of cubes) {
        scene.add(cube);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize($container.innerWidth(), window.innerHeight - headerHeight)
    $container.append(renderer.domElement);

    document.addEventListener('click', onDocumentMouseDown, false);

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

    var mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,   //x
        -(event.clientY / window.innerHeight) * 2 + 1,  //y
        0.5);                                            //z
    //  var raycaster = projector.pickingRay( mouse3D.clone(), camera );
    // var intersects = raycaster.intersectObjects( objects );
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    // Change color if hit block
    if (intersects.length > 0) {
        console.log(intersects[0].object.material);
        if (intersects[0].object.material.wireframe == true) {
            intersects[0].object.material.wireframe = false;
        }
        else {
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

function gameCheck() {

}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
}


function render() {
    scene.background = new THREE.Color(0xffffff);
    renderer.render(scene, camera);
} 