//Some code taken from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap.html
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var container, stats;
			var camera, scene, renderer;
			var cameraCube, sceneCube;
			var mesh, geometry,ground;
			var loader;
			var pointLight;
			var mouseX = 0;
			var mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var direction = new THREE.Vector3(1, 0, 0 );
			window.speed = 0.1;
			var on = false;
			var static = false;
			
			init();
			animate();
			function init() {
				container = document.createElement( 'div' );
				container.setAttribute('id', 'container');
				document.body.appendChild( container );
				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / (window.innerHeight), 1, 5000 );
				camera.position.z = 2000;
				camera.rotation.z = 1;
				console.log(camera.rotation);

				cameraCube = new THREE.PerspectiveCamera( 50, window.innerWidth / (window.innerHeight), 1, 100 );
				scene = new THREE.Scene();
				sceneCube = new THREE.Scene();

				controls = new THREE.OrbitControls( camera );
				controls.rotateSpeed = 10;
				controls.zoomSpeed = 10;
				controls.panSpeed = 10;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
				controls.keys = [ 65, 83, 68 ];

				controls.target = new THREE.Vector3(-2000,0,0);
				
				var sky1 = [
	              'images/pos-x.png',
	              'images/neg-x.png',
	              'images/pos-y.png',
	              'images/neg-y.png',
	              'images/pos-z.png',
	              'images/neg-z.png'
           		 ];

           		 var sky3 = [
           			'images/sky3-pos-x.png',
	              	'images/sky3-neg-x.png',
	              	'images/sky3-pos-y.png',
	              	'images/sky3-neg-y.png',
	              	'images/sky3-pos-z.png',
	              	'images/sky3-neg-z.png'
           		 ];

           		 	 var sky4 = [
           			'images/sky4-pos-x.png',
	              	'images/sky4-neg-x.png',
	              	'images/sky4-pos-y.png',
	              	'images/sky4-neg-y.png',
	              	'images/sky4-pos-z.png',
	              	'images/sky4-neg-z.png'
           		 ];


           		 var desert = [
           			'images/desert-pos-x.png',
	              	'images/desert-neg-x.png',
	              	'images/desert-pos-y.png',
	              	'images/desert-neg-y.png',
	              	'images/desert-pos-z.png',
	              	'images/desert-neg-z.png'
           		 ];


           		 var darkstormy = [
           		 	'images/DarkStormyFront2048.png',
           		 	'images/DarkStormyBack2048.png',
           		 	'images/DarkStormyUp2048.png',
           		 	'images/DarkStormyDown2048.png',
           		 	'images/DarkStormyRight2048.png',
           		 	'images/DarkStormyLeft2048.png'

           		 ];

           		 var city = [
								'images/city-pos-x.png',
           		 	'images/city-neg-x.png',
           		 	'images/city-pos-y.png',
           		 	'images/city-neg-y.png',
           		 	'images/city-pos-z.png',
           		 	'images/city-neg-z.png'

           		 ];


 				var tropical = [
           		 	'images/TropicalSunnyDayFront2048.png',
           		 	'images/TropicalSunnyDayBack2048.png',
           		 	'images/TropicalSunnyDayUp2048.png',
           		 	'images/TropicalSunnyDayDown2048.png',
           		 	'images/TropicalSunnyDayRight2048.png',
           		 	'images/TropicalSunnyDayLeft2048.png'

           		 ];

           		 var museum = [
           		 	'images/museum-pos-x.png',
           		 	'images/museum-neg-x.png',
           		 	'images/museum-pos-y.png',
           		 	'images/museum-neg-y.png',
           		 	'images/museum-pos-z.png',
           		 	'images/museum-neg-z.png'
           		 ];

           		 var ground = "images/ground.jpg";
           		 var water = "images/water.jpg";
           		 var sand = "images/sand.png";
           		 var checkered = "images/checkered.jpg";

				setSkyBoxAndGround(desert,sand);
				//window.scene = "desert";

				$("#desert").click(function() {
					setSkyBoxAndGround(desert, sand); 
					static = false;
					$("#scene").html("desert");
					resetStyle();
				});

				$("#ocean").click(function() {

					setSkyBoxAndGround(tropical, water); 
					static = false;
					$("#scene").html("ocean");
					resetStyle();
					$(".scene-options").css('color', 'rgb(200,200,200)');
				});

				$("#trippy").click(function() {
					setSkyBoxAndGround(darkstormy, checkered); 
					static = false;
					$("#scene").html("trippy");
					resetStyle();
					$("#sidebar").css('background', 'rgba(255,255,255,0.3');
					$("#musicxx").css('color', 'rbg(200,200,200)');
					$("div").css('color', 'rbg(200,200,200)');
					$("#go-instructions").css('color', 'rgba(30,30,30, 1)');

				});

				$("#room").click(function() {
					setSkyBoxAndGround(museum, ""); 
					$("#scene").html("room");
					static = true;
					resetStyle();
					//change style accordingly

				});

				$("#city").click(function() {
					setSkyBoxAndGround(city, ""); 
					$("#scene").html("city");
					static = true;
					resetStyle();
					//change style accordingly

				});

				var resetStyle = function () {
					$("#sidebar").css('background', 'rgba(255,255,255,0');
				
					$(".scene-options").css('color', 'rgb(30,30,30)');
					$("#musicxx").css('color', 'rbg(200,200,200)');
					$("div").css('color', 'rbg(200,200,200)');
					$("#go-instructions").css('color', 'rgba(255,255,255,0.6)');
				}


				renderer = new THREE.WebGLRenderer();
				renderer = new THREE.WebGLRenderer( { antialias: false } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight);
				renderer.autoClear = false;
				container.appendChild( renderer.domElement );
				loader = new THREE.BinaryTextureLoader();

				window.addEventListener( 'resize', onWindowResize, false );
			} 


			function setSkyBoxAndGround(urls, ground) {
				var reflectionCube = new THREE.CubeTextureLoader().load( urls );
				reflectionCube.format = THREE.RGBFormat;
				var refractionCube = new THREE.CubeTextureLoader().load( urls );
				refractionCube.mapping = THREE.CubeRefractionMapping;
				refractionCube.format = THREE.RGBFormat;
				//var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0x000000, specular:0xaa0000, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );
				var cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
				var cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xffee00, envMap: refractionCube, refractionRatio: 0.95 } );
				var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );
				// Skybox
				var shader = THREE.ShaderLib[ "cube" ];
				shader.uniforms[ "tCube" ].value = reflectionCube;
				var material = new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} ),
				mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
				mesh.name = "mesh";
				sceneCube.remove(sceneCube.getObjectByName("mesh"));
				sceneCube.add( mesh );

				//add ground
				if (ground === "") {
					sceneCube.remove(sceneCube.getObjectByName("ground"));
				} else {
					var grassTex = new THREE.TextureLoader().load(ground);
					grassTex.wrapS = THREE.RepeatWrapping;
					grassTex.wrapT =  THREE.RepeatWrapping;
					grassTex.repeat.x = 256;
					grassTex.repeat.y = 256;

					var groundMat = new THREE.MeshBasicMaterial({map:grassTex});

					
					var groundGeo = new THREE.PlaneGeometry(1000,1000);
					var ground = new THREE.Mesh(groundGeo,groundMat);
					ground.position.y = -2.5; //lower it
					ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
					ground.rotation.z = -Math.PI/2;

					this.ground = ground;

					//IMPORTANT, draw on both sides
					ground.doubleSided = true;
					ground.name = "ground";
					sceneCube.remove(sceneCube.getObjectByName("ground"));
					sceneCube.add(ground);
					} 
					
			}

			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				cameraCube.aspect = window.innerWidth / window.innerHeight;
				cameraCube.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

/*			function onKeydown(event) {
				if (event.keyCode === 103|71) {
					
					if (on) {
						on = false;
					} else {
						on = true;
					}
				}
			}*/

			//changes the go button according to on or off
			$("#go").click(function(){
				if (on) {
					$(this).attr('src','images/go.png');
					on = false;
				} else {
						$(this).attr('src','images/stop.png');
						on = true;
				}
			});

/*			var rotation = 0;
			var constant = 0.001;
			var elapsedTime = 0;*/
			function move() {

				if (static) {					
					if (on) {
							controls.autoRotate = true;
							controls.autoRotateSpeed = 1;
					} else {
						controls.autoRotate = false;
					}

				} else {
					controls.autoRotate = false;

					if (on) {
						var s = speed;	
					} else {
						var s = 0;
					}

					var vector = direction.clone().multiplyScalar(s,s,s);
					ground.position.x += vector.x;
					if(ground.position.x > 100) {
						resetGround();
					}
				}

			}

			function resetGround() {
				ground.position.x = 0;
			}

			//
			function animate() {

				move();
				requestAnimationFrame( animate );
				render();
			}
			function render() {
				controls.update();
				cameraCube.rotation.copy( camera.rotation );
				renderer.render( sceneCube, cameraCube );
				renderer.render( scene, camera );
				
			}