var camera, scene, renderer, clock, stats;
var dirLight, spotLight;
var cube, wrapper, text, wall, ground;

var stretch = 0;
init();
animate();

function setUpAnimation() {
	// POSITION
	var positionKF = new THREE.VectorKeyframeTrack('.position', [20, 30, 33, 40, 45, 50, 57],
		[0, 0, 0,
			0, -.4, 0,
			0, 1, 0,
			0, 13, 0,
			0, 1, 0,
			0, -.4, 0,
			0, 0, 0
		],
		THREE.InterpolateSmooth);

	var a, b, c, d;
	a = 1.2 - stretch * .2;
	b = .7 + stretch * .3;
	c = .85 + stretch * .15;
	d = 1.4 - stretch * .4;

	a = 1 + stretch * .2;
	b = 1 - stretch * .3;
	c = 1 - stretch * .15;
	d = 1 + stretch * .4;

	// SCALE
	var scaleKF = new THREE.VectorKeyframeTrack('.scale', [20, 30, 33, 40, 45, 50, 57],
		[1, 1, 1,
			a, b, a,
			c, d, c,
			1, 1, 1,
			c, d, c,
			a, b, a,
			1, 1, 1
		],
		THREE.InterpolateSmooth);

	// create an animation sequence with the tracks
	var clip = new THREE.AnimationClip('Action', 70, [scaleKF, positionKF]);

	// setup the AnimationMixer
	mixer = new THREE.AnimationMixer(wrapper);

	// create a ClipAction and set it to play
	var clipAction = mixer.clipAction(clip);
	clipAction.timeScale = 19;
	clipAction.play();

	wrapper.add(cube);
	wrapper.add(pointLight);
	scene.add(wrapper);
}



document.addEventListener("keypress", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
	var key = event.key;
	if (key == "s") { //shadow
		renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
		renderer.clearTarget(spotLight.shadow.map);
		renderer.clearTarget(dirLight.shadow.map);
		render();
	} else if (key == "]") { //Increase stretch
		stretch += .1;
		setUpAnimation();
	} else if (key == "[") { //Decrese stretch
		stretch -= .1;
		setUpAnimation();
	} else if (key == "W") { //Wireframe
		cube.material.wireframe = !cube.material.wireframe;
		wall.material.wireframe = !wall.material.wireframe;
		ground.material.wireframe = !ground.material.wireframe;
		text.material.wireframe = !text.material.wireframe;

		//Camera
	} else if (key == "Z") { //Camera forward
		text.translateX(-1);
	} else if (key == "X") { //Camera backward
		text.translateX(1);

		//Camera
	} else if (key == "i") { //Camera forward
		camera.translateZ(-1);
	} else if (key == "k") { //Camera backward
		camera.translateZ(1);
	} else if (key == "j") { //Camera left
		camera.translateX(-1);
	} else if (key == "l") { //Camera right
		camera.translateX(1);
	} else if (key == "u") { //Camera up
		camera.translateY(1);
	} else if (key == "v") { //Camera down
		camera.translateY(-1);

	} else if (key == ".") { //Show robotman
		importRobot();

		//Lighting
	} else if (key == "1") { //Toggle light
		spotLight.intensity ^= 1;
	} else if (key == "2") { //Toggle light
		dirLight.intensity ^= 1;
	} else if (key == "3") { //Toggle light
		pointLight.intensity ^= 1;
	} else if (key == "A") { //Camera forward
		ambLight.intensity += .3;
	} else if (key == "a") { //Camera backward
		ambLight.intensity -= .3;
	} else if (key == "D") { //Camera left
		cube.position.x += xSpeed;
	} else if (key == "d") { //Camera right
		cube.position.x += xSpeed;
	} else if (key == "S") { //Camera up
		cube.position.x += xSpeed;
	} else if (key == "s") { //Camera down
		cube.position.x += xSpeed;
	} else if (key == "E") { //Camera up
		cube.material.emissiveIntensity += .3;
		pointLight.intensity += .2;
	} else if (key == "e") { //Camera down
		cube.material.emissiveIntensity -= .3;
		pointLight.intensity -= .2;
	}
};


function init() {
	initScene();
	initMisc();
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
}

function importRobot() {
	// Instantiate a loader
	var loader = new THREE.GLTFLoader();

	loader.load(
		'robotman.glb',
		function(gltf) {

			scene.add(gltf.scene);

			gltf.animations;
			gltf.scene;
			gltf.scenes;
			gltf.cameras;
			gltf.asset;
			gltf.scene.position.set(-12, -2, 0)
			gltf.scene.rotation.set(0, -1.2, 0)

		}
	);
}

function initScene() {
	var tmaterial = new THREE.MeshPhongMaterial({
		color: 0xd0dddf,
		shininess: 0,
		specular: 0x010101
	});
	var gmaterial = new THREE.MeshPhongMaterial({
		color: 0xa0adaf,
		shininess: 150,
		specular: 0x111111
	});


	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 5, 37);
	scene = new THREE.Scene();
	// Lights
	ambLight = new THREE.AmbientLight(0x505050);
	scene.add(ambLight);
	pointLight = new THREE.PointLight(0x00aa00, 0, 10, 5);


	var loader = new THREE.FontLoader();
	var textGeometry;
	loader.load('helvetiker_regular.typeface.json', function(font) {

		textGeometry = new THREE.TextGeometry('The Illusion of Life                          Squash and Stretch                           Staging                           Slow In and Slow Out                           Solid drawing                          Appeal', {
			font: font,
			size: 2,
			height: 1,
			curveSegments: 0,
			bevelEnabled: true,
			bevelThickness: .05,
			bevelSize: .1,
			bevelSegments: 1
		});

		textGeometry.computeBoundingBox();
		textGeometry.computeVertexNormals();

		text = new THREE.Mesh(textGeometry, tmaterial)
		//text.position.x = -textGeometry.boundingBox.max.x/2;
		//text.position.y = textGeometry.boundingBox.max.y/2;
		text.castShadow = true;
		text.receiveShadow = true;
		text.position.z = -5;
		text.position.x = -20;
		text.position.y = 15;
		scene.add(text);
	});

	spotLight = new THREE.SpotLight(0xffffff);
	spotLight.name = 'Spot Light';
	spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.3;
	spotLight.position.set(8, 10, 10);
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 8;
	spotLight.shadow.camera.far = 40;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add(spotLight);

	dirLight = new THREE.DirectionalLight(0xFAD6A5);//Sunset
	//dirLight = new THREE.DirectionalLight(0xFfaaaa);//Sunset
	dirLight.name = 'Dir. Light';
	dirLight.position.set(-12, 5, 10);
	dirLight.intensity = .4;
	dirLight.castShadow = true;
	dirLight.shadow.camera.near = 1;
	dirLight.shadow.camera.far = 100;
	dirLight.shadow.camera.right = 150;
	dirLight.shadow.camera.left = -150;
	dirLight.shadow.camera.top = 150;
	dirLight.shadow.camera.bottom = -15;
	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	scene.add(dirLight);

	// Geometry
	var texture = new THREE.TextureLoader().load("zebra_print_vector_pattern.jpg");
	var texColor = new THREE.TextureLoader().load("textures/FabricDenim003_COL_VAR1_1K.jpg");
	var texNormal = new THREE.TextureLoader().load("textures/FabricDenim003_NRM_1K.jpg");
	var material = new THREE.MeshStandardMaterial({
		emissive: 0x00aa00,
		emissiveIntensity: 0,
		emissiveMap: texture,
		map: texColor,
		normalMap: texNormal
	});
	var geometry = new THREE.BoxBufferGeometry(3, 3, 3);
	cube = new THREE.Mesh(geometry, material);
	cube.castShadow = true;
	cube.receiveShadow = true;
	spotLight.target = cube;
	var geometry = new THREE.BoxBufferGeometry(100, 1, 100);
	var texColor = new THREE.TextureLoader().load("textures/MetalPanelRectangular001_COL_3K_SPECULAR.jpg");
	var texNormal = new THREE.TextureLoader().load("textures/MetalPanelRectangular001_NRM_3K_SPECULAR.jpg");
	var material = new THREE.MeshStandardMaterial({
		map: texColor,
		normalMap: texNormal
	});
	var ground = new THREE.Mesh(geometry, material);
	ground.position.y = -2;
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add(ground);

	var geometry = new THREE.PlaneGeometry(100, 25, 100, 25);
	var texColor = new THREE.TextureLoader().load("textures/ConcreteWall001_COL_VAR1_6K.jpg");
	var texNormal = new THREE.TextureLoader().load("textures/ConcreteWall001_NRM_6K.jpg");
	var texRough = new THREE.TextureLoader().load("textures/ConcreteWall001_GLOSS_3K_I.jpg");
	var texDisp = new THREE.TextureLoader().load("textures/ConcreteWall001_DISP_3K.jpg");
	var material = new THREE.MeshStandardMaterial({
		map: texColor,
		normalMap: texNormal,
		roughnessMap: texRough,
		displacementMap: texDisp,
		displacementScale: 5
	});
	wall = new THREE.Mesh(geometry, material);
	wall.position.z = -8;
	wall.position.x = 25;
	wall.position.y = 11;
	wall.castShadow = false;
	wall.receiveShadow = true;
	scene.add(wall);

	//animation
	wrapper = new THREE.Object3D();

	//vt+9.81t^2

	// POSITION
	var positionKF = new THREE.VectorKeyframeTrack('.position', [20, 30, 33, 40, 45, 50, 57],
		[0, 0, 0,
			0, -.4, 0,
			0, 1, 0,
			0, 13, 0,
			0, 1, 0,
			0, -.4, 0,
			0, 0, 0
		],
		THREE.InterpolateSmooth);

	var a, b, c, d;
	a = 1.2 - stretch * .2;
	b = .7 + stretch * .3;
	c = .85 + stretch * .15;
	d = 1.4 - stretch * .4;

	a = 1 + stretch * .2;
	b = 1 - stretch * .3;
	c = 1 - stretch * .15;
	d = 1 + stretch * .4;

	// SCALE
	var scaleKF = new THREE.VectorKeyframeTrack('.scale', [20, 30, 33, 40, 45, 50, 57],
		[1, 1, 1,
			a, b, a,
			c, d, c,
			1, 1, 1,
			c, d, c,
			a, b, a,
			1, 1, 1
		],
		THREE.InterpolateSmooth);

	// create an animation sequence with the tracks
	var clip = new THREE.AnimationClip('Action', 70, [scaleKF, positionKF]);

	// setup the AnimationMixer
	mixer = new THREE.AnimationMixer(wrapper);

	// create a ClipAction and set it to play
	var clipAction = mixer.clipAction(clip);
	clipAction.timeScale = 19;
	clipAction.play();

	wrapper.add(cube);
	wrapper.add(pointLight);
	scene.add(wrapper);


}

function initMisc() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	renderer.setClearColor("#f0f0f0");
	clock = new THREE.Clock();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function renderScene() {
	renderer.render(scene, camera);
}

function render() {
	var delta = clock.getDelta();
	mixer.update(delta);
	renderScene();
}
