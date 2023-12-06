// Configuração da cena e câmera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Posicionamento da câmera
camera.position.x = 30;
camera.position.y = 50;
camera.position.z = 150;

// Configuração do renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

// Luz ambiente
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
scene.background = new THREE.Color(0xffffff);

// Criação de um plano na cena
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshPhongMaterial({ color: 0xe7e7e7 })
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -20;
plane.receiveShadow = true;
scene.add(plane);

// Luzes pontuais
const light1 = new THREE.PointLight(0xf00, 1, 100);
light1.castShadow = true;
light1.shadow.mapSize.width = 4096;
light1.shadow.mapSize.height = 4096;
scene.add(light1);

const light2 = new THREE.PointLight(0x0f0, 1, 100);
light2.castShadow = true;
light2.shadow.mapSize.width = 4096;
light2.shadow.mapSize.height = 4096;
scene.add(light2);

// Criando geometria do texto
const loader = new THREE.FontLoader();

loader.load(`./assets/font1.json`, (font) => {
  let finalPositions = [];

  const textGeometry = new THREE.TextGeometry("PPGECC", {
    font: font,
    size: 5,
    height: 1,
    curveSegments: 50,
    bevelEnabled: false,
    bevelOffset: 0,
    bevelSegments: 1,
    bevelSize: 0.3,
    bevelThickness: 1,
  });

  // Armazenar posicoes finais das particulas
  textGeometry.vertices.forEach(function (vertex) {
    finalPositions.push(vertex.clone());
  });

  // Inicializando particulas em posicoes aleatorias
  textGeometry.vertices.forEach(function (vertex) {
    vertex.x = Math.random() * 500;
    vertex.y = Math.random() * 500;
    vertex.z = Math.random() * 500;
  });

  // Criação de um sistema de partículas com base na geometria de texto
  var particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    color: new THREE.Color(0xff0000),
  });

  var particleSystem = new THREE.Points(textGeometry, particleMaterial);
  scene.add(particleSystem);

  function animate() {
    const now = Date.now() / 1000;
    light1.position.y = 15;
    light2.position.y = 15;

    requestAnimationFrame(animate);
    controls.update();

    for (var i = 0; i < particleSystem.geometry.vertices.length; i++) {
      var particle = particleSystem.geometry.vertices[i];
      var finalPosition = finalPositions[i];
      // Interpolacao linear que move a particula da posicao inicial para a final
      particle.lerp(finalPosition, 0.05);
    }

    particleSystem.geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
  }

  // Adição de um botão e listener de eventos para reiniciar a animação
  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", restartAnimation);

  // Função para reiniciar a animação das partículas
  function restartAnimation() {
    // Reinicializa as posições das partículas
    particleSystem.geometry.vertices.forEach(function (vertex) {
      vertex.x = Math.random() * 500;
      vertex.y = Math.random() * 500;
      vertex.z = Math.random() * 500;
    });

    // Atualiza a cena
    scene.background = new THREE.Color(0xffffff);
    scene.remove(particleSystem);
    particleSystem = new THREE.Points(textGeometry, particleMaterial);
    scene.add(particleSystem);
  }

  // Adição de select para escolher o tipo de partículas
  const particleOptions = document.getElementById("particleOptions");
  particleOptions.addEventListener("change", updateParticleType);

  // Função para atualizar o tipo de partículas com base na escolha do usuário
  function updateParticleType() {
    const particleType = particleOptions.value;

    // Remove as partículas existentes
    scene.remove(particleSystem);

    // Cria novas partículas com base na escolha do usuário
    switch (particleType) {
      case "redParticles":
        particleMaterial = new THREE.PointsMaterial({
          size: 0.5,
          color: new THREE.Color(0xff0000),
        });
        break;
      case "greenParticles":
        particleMaterial = new THREE.PointsMaterial({
          size: 0.01,
          color: new THREE.Color(0x00ff00),
        });
        break;
      case "blueParticles":
        particleMaterial = new THREE.PointsMaterial({
          size: 1.5,
          color: new THREE.Color(0x0000ff),
        });
        break;
      default:
        particleMaterial = new THREE.PointsMaterial({
          size: 0.5,
          color: new THREE.Color(0xff0000),
        });
        break;
    }

    // Cria um novo sistema de partículas
    particleSystem = new THREE.Points(textGeometry, particleMaterial);
    scene.add(particleSystem);
  }

  // Chama a função para configurar o tipo de partículas inicialmente
  updateParticleType();

  animate();
});

// Adição de um listener para as alterações no select de opções de iluminação
const lightingOptions = document.getElementById("lightingOptions");
lightingOptions.addEventListener("change", updateLights);

function updateLights() {
  // Remove todas as luzes existentes
  scene.remove(...scene.children.filter((obj) => obj instanceof THREE.Light));

  // Adiciona as luzes conforme a escolha do usuário
  if (lightingOptions.value !== "noLights") {
    if (lightingOptions.value !== "noAmbient") {
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      scene.background = new THREE.Color(0xffffff);
    }

    if (lightingOptions.value !== "noPoint") {
      const light1 = new THREE.PointLight(0xf00, 1, 100);
      light1.castShadow = true;
      light1.shadow.mapSize.width = 4096;
      light1.shadow.mapSize.height = 4096;
      scene.add(light1);

      const light2 = new THREE.PointLight(0x0f0, 1, 100);
      light2.castShadow = true;
      light2.shadow.mapSize.width = 4096;
      light2.shadow.mapSize.height = 4096;
      scene.add(light2);
    }
  }
}

// Chama a função para configurar as luzes
updateLights();

// Criação de controles de órbita para interação do usuário
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, -40);
controls.update();
