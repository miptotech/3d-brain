//ThreeJS Render

	var container, stats;

	var camera, scene, renderer;

	var mouseX = 0, mouseY = 0;

	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;

	var mouseX = 0;
	var mouseXOnMouseDown = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var brain_obj;

function init() // Initialitations of ThreeJS params.
{

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 10;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );

	// BEGIN Clara.io JSON loader code
	var objectLoader = new THREE.ObjectLoader();
	objectLoader.load("obj/teapot-claraio.json", function ( obj ) {
	 	scene.add( obj );
		console.log(scene);
	} );
	// END Clara.io JSON loader code

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
	renderer.domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );

	renderer.domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.removeEventListener( 'mouseout', onDocumentMouseOut, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );


}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

/*-------------Mouse Events-------------*/
function onDocumentMouseDown( event ) {

	event.preventDefault();

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;

}

/*-------------Eventos de rotacion con el moviento del mouse-------------*/
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

/*-------------Eventos de click Up-------------*/
function onDocumentMouseUp( event ) {
	renderer.domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

/*-------------Eventos de MouseOut-------------*/
function onDocumentMouseOut( event ) {
	renderer.domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

/*--------------Eventos de Touch PAD-------------*/
function onDocumentTouchStart( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
	}
}


function createScene()
{

}

function animate()
{
	requestAnimationFrame( animate );
	render();
}

function render()
{
	// camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;
	var objeto = scene.getObjectById( 2, true );

	objeto.rotation.y += ( targetRotation - objeto.rotation.y ) * 0.05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );
}
