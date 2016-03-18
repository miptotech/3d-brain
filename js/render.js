//ThreeJS Render

	var container, stats;

	var camera, scene, renderer;

	var raycaster;
	var mouse;
	var mouseX = 0, mouseY = 0;

	var rotation_event = false;
	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;

	var mouseXOnMouseDown = 0;

	// var windowHalfX = window.innerWidth / 2;
	// var windowHalfY = window.innerHeight / 2;

	var windowHalfX = 652 / 2;
	var windowHalfY = 620 / 2;

	var zmesh = [];

	var INTERSECTED;

	var names= ["Frontal Lobe", "Parietal Lobe", "Temporal Lobe","Occipital Lobe","Cerebellum"];

function init() // Initialitations of ThreeJS params.
{
	//Div container for render
	container = document.createElement( 'div' );
	// document.body.appendChild( container );
	document.getElementById("model").appendChild( container );

	//Init Camera System
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 10;

	//Init Scene System
	scene = new THREE.Scene();

	//Put an Ambient light
	var ambient = new THREE.AmbientLight( 0xaaaaaa );
	scene.add( ambient );

	//Put an Ambient light
	// var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 1, 1 ).normalize();
	scene.add( directionalLight );

	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,2,5);
	scene.add(light);

	// BEGIN Brain Loader
	var loader = new THREE.JSONLoader();
	var callbackBrain = function ( geometry, materials ) { addObj( geometry, materials) };
	// loader.load( "obj/complete-brain.js", callbackBrain );
	loader.load( "obj/brain-part-1.js", callbackBrain );
	loader.load( "obj/brain-part-2.js", callbackBrain );
	loader.load( "obj/brain-part-3.js", callbackBrain );
	loader.load( "obj/brain-part-4.js", callbackBrain );
	loader.load( "obj/brain-part-5.js", callbackBrain );
	// END Brain Loader

	// Picker Vars
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	//

	// Init Render Params
	renderer = new THREE.WebGLRenderer({ alpha: true }); //Instantiate ThreeJS Object
	renderer.setClearColor( 0x000000, 0 ); // the default Clear color
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight ); //Canvas Size adapted
	container.appendChild( renderer.domElement ); //Append canvas to render

	// Mouse Events
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	// renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
	// renderer.domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );

	// Canvas Resize Event
	window.addEventListener( 'resize', onWindowResize, false );


}

function addObj(geometry, materials) //Function to add geometry loaded in format JSON
{
	zmesh.push(new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) ));
	zmesh[zmesh.length-1].position.set( 0, -1.2, 0);
	zmesh[zmesh.length-1].name = names[zmesh.length-1];
	scene.add( zmesh[zmesh.length-1] );
}

//Windows Resize Event for WebGL
function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

// Mouse Events

// Mouse Down or CLick
function onDocumentMouseDown( event ) {
	event.preventDefault();

	if(INTERSECTED)
	{
		brainPartclick(INTERSECTED.name);
	}else{
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		renderer.domElement.addEventListener( 'mouseout', onDocumentMouseOut, false );

		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
		rotation_event = true;
	}
}

// Mouse Move or CLick
function onDocumentMouseMove( event ) {
	if(rotation_event)
	{
		mouseX = event.clientX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
	}

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// Mouse UP
function onDocumentMouseUp( event ) {
	rotation_event = false;
}

// Mouse Out
function onDocumentMouseOut( event ) {
	rotation_event = false;
}

// TouchPad Events (Mobile)
// function onDocumentTouchStart( event ) {
// 	if ( event.touches.length == 1 ) {
// 		event.preventDefault();
// 		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
// 		targetRotationOnMouseDown = targetRotation;
// 	}
// }
// function onDocumentTouchMove( event ) {
// 	if ( event.touches.length == 1 ) {
// 		event.preventDefault();
// 		mouseX = event.touches[ 0 ].pageX - windowHalfX;
// 		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
// 	}
// }

//Init animation of render
function animate()
{
	requestAnimationFrame( animate );
	render();
}

function render()
{
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED )
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED )
				INTERSECTED.material.materials[0].color.setHex( INTERSECTED.currentHex );
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.materials[0].color.getHex();
			// set a new color for closest object
			INTERSECTED.material.materials[0].color.setHex( 0xffffff );
		}
	}else
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED )
			INTERSECTED.material.materials[0].color.setHex( INTERSECTED.currentHex );
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
	}

	//Do a Rotation of all meshes.
	zmesh.forEach(function(entry){
		entry.rotation.y += ( targetRotation - entry.rotation.y ) * 0.05;
	});

	renderer.render( scene, camera );
}
