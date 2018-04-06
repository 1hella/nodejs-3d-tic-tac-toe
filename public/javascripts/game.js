var camera, controls, scene, renderer;
var cube_1;
var cubes = [];
init();
animate();
function init() {
    console.log('running');
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.z = 500;
    camera.position.x = 600;
    camera.position.y = 600;

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    scene = new THREE.Scene();

    for (var i= 0; i < 27; i++) {
        cubes.push(new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial()));
    }

    //1st Layer
    //1 row
    cubes[1].position.x = 300;
    cubes[2].position.x = 600;
    
    //2 row
    cubes[3].position.y = 300;
    cubes[4].position.y = 300;
    cubes[5].position.y = 300;

    cubes[4].position.x = 300;
    cubes[5].position.x = 600;
    
    //3 row
    cubes[6].position.y = 600;
    cubes[7].position.y = 600;
    cubes[8].position.y = 600;

    cubes[7].position.x = 300;
    cubes[8].position.x = 600;

    //2nd Layer
    //1
    cubes[9].position.z = 300;
    cubes[10].position.z = 300;
    cubes[11].position.z = 300;

    cubes[10].position.x = 300;
    cubes[11].position.x = 600;

    //2
    cubes[12].position.z = 300;
    cubes[13].position.z = 300;
    cubes[14].position.z = 300;

    cubes[12].position.y = 300;
    cubes[13].position.y = 300;
    cubes[14].position.y = 300;

    cubes[13].position.x = 300;
    cubes[14].position.x = 600;

    //3
    cubes[15].position.z = 300;
    cubes[16].position.z = 300;
    cubes[17].position.z = 300;

    cubes[15].position.y = 600;
    cubes[16].position.y = 600;
    cubes[17].position.y = 600;

    cubes[16].position.x = 300;
    cubes[17].position.x = 600;

    //3rd Layer
    //1
    cubes[18].position.z = 600;
    cubes[19].position.z = 600;
    cubes[20].position.z = 600;

    cubes[19].position.x = 300;
    cubes[20].position.x = 600;

    //2
    cubes[21].position.z = 600;
    cubes[22].position.z = 600;
    cubes[23].position.z = 600;

    cubes[21].position.y = 300;
    cubes[22].position.y = 300;
    cubes[23].position.y = 300;

    cubes[22].position.x = 300;
    cubes[23].position.x = 600;

    //3
    cubes[24].position.z = 600;
    cubes[25].position.z = 600;
    cubes[26].position.z = 600;

    cubes[24].position.y = 600;
    cubes[25].position.y = 600;
    cubes[26].position.y = 600;

    cubes[25].position.x = 300;
    cubes[26].position.x = 600;



    for (var cube of cubes) {
        scene.add(cube);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement);

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