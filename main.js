import * as THREE from 'https://esm.sh/three@0.150.1';
import { OrbitControls } from 'https://esm.sh/three@0.150.1/examples/jsm/controls/OrbitControls.js';

// Configuración de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x505050, 1); // Gris oscuro
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Luces mejoradas
scene.add(new THREE.AmbientLight(0x404040, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(10, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
scene.add(dirLight);

// Luz de relleno
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, 3, -5);
scene.add(fillLight);

// Cargar texturas realistas
const textureLoader = new THREE.TextureLoader();
const birdTextures = {
  // Texturas base más realistas
  featherBase: textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg'),
  featherDetail: textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg'),
  beak: textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg'),
  eye: textureLoader.load('https://threejs.org/examples/textures/lava/lavatile.jpg'),
  wing: textureLoader.load('https://threejs.org/examples/textures/terrain/backgrounddetailed6.jpg'),
  body: textureLoader.load('https://threejs.org/examples/textures/crate.gif')
};

// Configurar texturas
Object.values(birdTextures).forEach(texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
});

// Estrellas de fondo
const starGeom = new THREE.BufferGeometry();
const starCount = 800;
const starPos = [];
for (let i = 0; i < starCount; i++) {
  starPos.push(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
}
starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
const starField = new THREE.Points(starGeom, new THREE.PointsMaterial({ 
  color: 0xffffff, 
  size: 1.0,
  transparent: true,
  opacity: 0.8
}));
scene.add(starField);

// Pecera/Jaula
const boxSize = { x: 4, y: 3, z: 3 };
let wireframe = createBox(boxSize);
scene.add(wireframe);

// Especies de aves con características distintivas
const birdSpecies = [
  {
    name: 'Cardinal',
    bodyColor: 0x8B0000,
    headColor: 0xFF0000,
    wingColor: 0x600000,
    beakColor: 0xFF4500,
    eyeColor: 0x000000,
    size: 1.0,
    bodyScale: { x: 1.3, y: 0.9, z: 0.8 },
    headScale: 1.0,
    wingScale: { x: 0.4, y: 1.8, z: 0.15 },
    tailLength: 0.08,
    beakLength: 0.03
  },
  {
    name: 'BlueJay',
    bodyColor: 0x4169E1,
    headColor: 0x0000FF,
    wingColor: 0x191970,
    beakColor: 0x2F4F4F,
    eyeColor: 0x000000,
    size: 1.1,
    bodyScale: { x: 1.4, y: 1.0, z: 0.9 },
    headScale: 1.1,
    wingScale: { x: 0.35, y: 2.0, z: 0.12 },
    tailLength: 0.09,
    beakLength: 0.035
  },
  {
    name: 'Goldfinch',
    bodyColor: 0xFFD700,
    headColor: 0xFFA500,
    wingColor: 0x2F4F4F,
    beakColor: 0xDEB887,
    eyeColor: 0x000000,
    size: 0.8,
    bodyScale: { x: 1.0, y: 0.8, z: 0.7 },
    headScale: 0.9,
    wingScale: { x: 0.3, y: 1.5, z: 0.1 },
    tailLength: 0.06,
    beakLength: 0.02
  },
  {
    name: 'Robin',
    bodyColor: 0x8B4513,
    headColor: 0xA0522D,
    wingColor: 0x654321,
    beakColor: 0xFFA500,
    eyeColor: 0x000000,
    size: 0.9,
    bodyScale: { x: 1.2, y: 0.9, z: 0.8 },
    headScale: 0.95,
    wingScale: { x: 0.35, y: 1.7, z: 0.13 },
    tailLength: 0.07,
    beakLength: 0.025
  },
  {
    name: 'Canary',
    bodyColor: 0xFFFF00,
    headColor: 0xFFD700,
    wingColor: 0xDAA520,
    beakColor: 0xFF8C00,
    eyeColor: 0x000000,
    size: 0.7,
    bodyScale: { x: 1.0, y: 0.7, z: 0.6 },
    headScale: 0.8,
    wingScale: { x: 0.25, y: 1.3, z: 0.08 },
    tailLength: 0.05,
    beakLength: 0.018
  }
];

// Crear geometría realista de ave
function createBirdGeometry(species) {
  const birdGroup = new THREE.Group();
  const scale = species.size;
  
  // Cuerpo principal - más detallado
  const bodyGeometry = new THREE.SphereGeometry(0.05 * scale, 20, 16);
  bodyGeometry.scale(species.bodyScale.x, species.bodyScale.y, species.bodyScale.z);
  
  const bodyTexture = birdTextures.featherBase.clone();
  bodyTexture.repeat.set(3, 2);
  bodyTexture.needsUpdate = true;
  
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    map: bodyTexture,
    color: species.bodyColor,
    shininess: 30,
    specular: 0x111111
  });
  
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = 'body';
  birdGroup.add(body);
  
  // Cabeza - más proporcionada
  const headGeometry = new THREE.SphereGeometry(0.03 * scale * species.headScale, 16, 12);
  const headTexture = birdTextures.featherDetail.clone();
  headTexture.repeat.set(2, 2);
  headTexture.needsUpdate = true;
  
  const headMaterial = new THREE.MeshPhongMaterial({ 
    map: headTexture,
    color: species.headColor,
    shininess: 40,
    specular: 0x222222
  });
  
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.01 * scale, 0.07 * scale);
  head.castShadow = true;
  head.receiveShadow = true;
  head.name = 'head';
  birdGroup.add(head);
  
  // Ojos - más realistas
  const eyeGeometry = new THREE.SphereGeometry(0.008 * scale, 8, 6);
  const eyeMaterial = new THREE.MeshPhongMaterial({ 
    color: species.eyeColor,
    shininess: 100,
    specular: 0x555555
  });
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.015 * scale, 0.015 * scale, 0.08 * scale);
  leftEye.name = 'leftEye';
  birdGroup.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.015 * scale, 0.015 * scale, 0.08 * scale);
  rightEye.name = 'rightEye';
  birdGroup.add(rightEye);
  
  // Pico - más detallado
  const beakGeometry = new THREE.ConeGeometry(0.01 * scale, species.beakLength * scale, 8);
  const beakTexture = birdTextures.beak.clone();
  beakTexture.repeat.set(1, 1);
  beakTexture.needsUpdate = true;
  
  const beakMaterial = new THREE.MeshPhongMaterial({ 
    map: beakTexture,
    color: species.beakColor,
    shininess: 80,
    specular: 0x333333
  });
  
  const beak = new THREE.Mesh(beakGeometry, beakMaterial);
  beak.position.set(0, 0, 0.095 * scale);
  beak.rotation.x = Math.PI / 2;
  beak.castShadow = true;
  beak.name = 'beak';
  birdGroup.add(beak);
  
  // Alas - más realistas con plumaje
  const wingGeometry = new THREE.SphereGeometry(0.04 * scale, 16, 12);
  wingGeometry.scale(species.wingScale.x, species.wingScale.y, species.wingScale.z);
  
  const wingTexture = birdTextures.wing.clone();
  wingTexture.repeat.set(2, 4);
  wingTexture.needsUpdate = true;
  
  const wingMaterial = new THREE.MeshPhongMaterial({ 
    map: wingTexture,
    color: species.wingColor,
    shininess: 20,
    specular: 0x111111
  });
  
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial.clone());
  leftWing.position.set(-0.05 * scale, 0, 0.02 * scale);
  leftWing.rotation.z = -0.3;
  leftWing.rotation.y = -0.2;
  leftWing.castShadow = true;
  leftWing.receiveShadow = true;
  leftWing.name = 'leftWing';
  birdGroup.add(leftWing);
  
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial.clone());
  rightWing.position.set(0.05 * scale, 0, 0.02 * scale);
  rightWing.rotation.z = 0.3;
  rightWing.rotation.y = 0.2;
  rightWing.castShadow = true;
  rightWing.receiveShadow = true;
  rightWing.name = 'rightWing';
  birdGroup.add(rightWing);
  
  // Cola - más proporcionada
  const tailGeometry = new THREE.ConeGeometry(0.02 * scale, species.tailLength * scale, 8);
  const tailTexture = birdTextures.wing.clone();
  tailTexture.repeat.set(1, 2);
  tailTexture.needsUpdate = true;
  
  const tailMaterial = new THREE.MeshPhongMaterial({ 
    map: tailTexture,
    color: species.wingColor,
    shininess: 25,
    specular: 0x111111
  });
  
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.set(0, 0, -0.09 * scale);
  tail.rotation.x = Math.PI / 2;
  tail.castShadow = true;
  tail.receiveShadow = true;
  tail.name = 'tail';
  birdGroup.add(tail);
  
  // Patas - nuevas
  const legGeometry = new THREE.CylinderGeometry(0.002 * scale, 0.002 * scale, 0.02 * scale, 6);
  const legMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFF8C00,
    shininess: 60 
  });
  
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.01 * scale, -0.05 * scale, 0.01 * scale);
  leftLeg.name = 'leftLeg';
  birdGroup.add(leftLeg);
  
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.01 * scale, -0.05 * scale, 0.01 * scale);
  rightLeg.name = 'rightLeg';
  birdGroup.add(rightLeg);
  
  // Almacenar referencias para animación
  birdGroup.userData.leftWing = leftWing;
  birdGroup.userData.rightWing = rightWing;
  birdGroup.userData.wingPhase = Math.random() * Math.PI * 2;
  birdGroup.userData.species = species;
  birdGroup.userData.scale = scale;
  
  return birdGroup;
}

// Array de aves y variables de control
const birds = [];
let migrationDirection = new THREE.Vector3(1, 0, 0.5).normalize();
let groupSeparationTimer = 0;
let separationActive = false;

// Función para agregar ave
function addBird(position = new THREE.Vector3(0, 0, 0)) {
  const species = birdSpecies[Math.floor(Math.random() * birdSpecies.length)];
  const bird = createBirdGeometry(species);
  
  bird.position.copy(position);
  
  // Velocidad inicial
  bird.userData.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.025 + migrationDirection.x * 0.015,
    (Math.random() - 0.5) * 0.025 + migrationDirection.y * 0.015,
    (Math.random() - 0.5) * 0.025 + migrationDirection.z * 0.015
  );
  
  bird.userData.groupTime = 0;
  bird.userData.separationForce = new THREE.Vector3();
  bird.userData.lastSeparationTime = 0;
  
  scene.add(bird);
  birds.push(bird);
  updateBirdCountInput();
}

// Función para remover ave
function removeLastBird() {
  const bird = birds.pop();
  if (bird) {
    scene.remove(bird);
    // Limpiar geometrías y materiales
    bird.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
  }
  updateBirdCountInput();
}

// Inicializar con 8 aves
for (let i = 0; i < 8; i++) {
  addBird(new THREE.Vector3(
    (Math.random() - 0.5) * 1.0,
    (Math.random() - 0.5) * 1.0,
    (Math.random() - 0.5) * 1.0
  ));
}

// Animación de alas mejorada
function animateWings(bird, deltaTime) {
  const leftWing = bird.userData.leftWing;
  const rightWing = bird.userData.rightWing;
  const scale = bird.userData.scale;
  
  bird.userData.wingPhase += deltaTime * 12; // Velocidad de aleteo
  
  const wingAngle = Math.sin(bird.userData.wingPhase) * 0.4;
  const wingTilt = Math.cos(bird.userData.wingPhase * 0.5) * 0.1;
  
  leftWing.rotation.z = -0.3 + wingAngle;
  leftWing.rotation.y = -0.2 + wingTilt;
  
  rightWing.rotation.z = 0.3 - wingAngle;
  rightWing.rotation.y = 0.2 - wingTilt;
}

// Sistema de boids mejorado
function updateBirds(deltaTime) {
  const maxSpeed = 0.05;
  const minSpeed = 0.02;
  
  // Fuerzas dinámicas
  const alignStrength = separationActive ? 0.04 : 0.1;
  const cohesionStrength = separationActive ? 0.02 : 0.04;
  const separationStrength = separationActive ? 0.3 : 0.2;
  const migrationStrength = separationActive ? 0.1 : 0.06;
  
  // Radios de influencia
  const neighborRadius = separationActive ? 0.8 : 1.0;
  const separationRadius = separationActive ? 0.5 : 0.4;
  
  // Control de separación temporal
  groupSeparationTimer += deltaTime;
  
  if (!separationActive && groupSeparationTimer > 12 + Math.random() * 8) {
    separationActive = true;
    groupSeparationTimer = 0;
    
    // Nueva dirección migratoria
    migrationDirection.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 2
    ).normalize();
  } else if (separationActive && groupSeparationTimer > 6 + Math.random() * 4) {
    separationActive = false;
    groupSeparationTimer = 0;
  }
  
  // Cambio direccional aleatorio
  if (Math.random() < 0.002) {
    migrationDirection.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 2
    ).normalize();
  }

  birds.forEach((bird, i) => {
    const pos = bird.position;
    const vel = bird.userData.velocity;
    const species = bird.userData.species;

    let align = new THREE.Vector3();
    let cohesion = new THREE.Vector3();
    let separation = new THREE.Vector3();
    let neighborCount = 0;
    let separationCount = 0;

    // Analizar vecinos
    for (let j = 0; j < birds.length; j++) {
      if (i === j) continue;
      const other = birds[j];
      const dist = pos.distanceTo(other.position);
      
      // Separación
      if (dist < separationRadius && dist > 0.001) {
        const diff = pos.clone().sub(other.position);
        diff.divideScalar(dist * dist);
        separation.add(diff);
        separationCount++;
      }
      
      // Alineación y cohesión
      if (dist < neighborRadius && dist > 0.001) {
        align.add(other.userData.velocity);
        cohesion.add(other.position);
        neighborCount++;
      }
    }

    // Aplicar fuerzas
    if (neighborCount > 0) {
      // Alineación
      align.divideScalar(neighborCount);
      align.sub(vel);
      if (align.length() > 0) {
        align.normalize().multiplyScalar(maxSpeed);
        align.sub(vel);
        vel.add(align.multiplyScalar(alignStrength));
      }

      // Cohesión
      cohesion.divideScalar(neighborCount);
      cohesion.sub(pos);
      if (cohesion.length() > 0) {
        cohesion.normalize().multiplyScalar(maxSpeed);
        cohesion.sub(vel);
        vel.add(cohesion.multiplyScalar(cohesionStrength));
      }
    }

    // Separación
    if (separationCount > 0) {
      separation.divideScalar(separationCount);
      if (separation.length() > 0) {
        separation.normalize().multiplyScalar(maxSpeed);
        separation.sub(vel);
        vel.add(separation.multiplyScalar(separationStrength));
      }
    }

    // Migración
    const migration = migrationDirection.clone();
    migration.multiplyScalar(maxSpeed);
    migration.sub(vel);
    vel.add(migration.multiplyScalar(migrationStrength));

    // Turbulencia durante separación
    if (separationActive) {
      const turbulence = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      );
      vel.add(turbulence);
    }

    // Limitar velocidad según especie
    const speciesMaxSpeed = maxSpeed * species.size;
    const speciesMinSpeed = minSpeed * species.size;
    
    const speed = vel.length();
    if (speed > speciesMaxSpeed) {
      vel.setLength(speciesMaxSpeed);
    } else if (speed < speciesMinSpeed) {
      vel.setLength(speciesMinSpeed);
    }

    // Actualizar posición
    pos.add(vel);

    // Orientación basada en velocidad
    if (vel.length() > 0.001) {
      const dir = vel.clone().normalize();
      bird.lookAt(pos.clone().add(dir));
      bird.rotateY(Math.PI);
    }

    // Animación de alas
    animateWings(bird, deltaTime);

    // Rebote en paredes con amortiguación
    const halfX = boxSize.x / 2;
    const halfY = boxSize.y / 2;
    const halfZ = boxSize.z / 2;
    const bounceStrength = 0.7;
    const margin = 0.15;
    
    if (pos.x < -halfX + margin) {
      pos.x = -halfX + margin;
      vel.x = Math.abs(vel.x) * bounceStrength;
    } else if (pos.x > halfX - margin) {
      pos.x = halfX - margin;
      vel.x = -Math.abs(vel.x) * bounceStrength;
    }
    
    if (pos.y < -halfY + margin) {
      pos.y = -halfY + margin;
      vel.y = Math.abs(vel.y) * bounceStrength;
    } else if (pos.y > halfY - margin) {
      pos.y = halfY - margin;
      vel.y = -Math.abs(vel.y) * bounceStrength;
    }
    
    if (pos.z < -halfZ + margin) {
      pos.z = -halfZ + margin;
      vel.z = Math.abs(vel.z) * bounceStrength;
    } else if (pos.z > halfZ - margin) {
      pos.z = halfZ - margin;
      vel.z = -Math.abs(vel.z) * bounceStrength;
    }
  });
}

// Crear caja wireframe
function createBox(size) {
  const boxGeom = new THREE.BoxGeometry(size.x, size.y, size.z);
  const edges = new THREE.EdgesGeometry(boxGeom);
  const lineMat = new THREE.LineBasicMaterial({ 
    color: 0x00ff00,
    linewidth: 2,
    transparent: true,
    opacity: 0.8
  });
  return new THREE.LineSegments(edges, lineMat);
}

// Event listeners para controles
document.getElementById('applyScale').addEventListener('click', () => {
  const scale = parseFloat(document.getElementById('scaleInput').value);
  if (isNaN(scale) || scale <= 0) return;

  boxSize.x = 4 * scale;
  boxSize.y = 3 * scale;
  boxSize.z = 3 * scale;

  scene.remove(wireframe);
  wireframe = createBox(boxSize);
  scene.add(wireframe);

  // Reposicionar aves fuera de los límites
  const halfX = boxSize.x / 2;
  const halfY = boxSize.y / 2;
  const halfZ = boxSize.z / 2;
  
  for (let bird of birds) {
    const pos = bird.position;
    if (Math.abs(pos.x) > halfX || Math.abs(pos.y) > halfY || Math.abs(pos.z) > halfZ) {
      bird.position.set(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );
      bird.userData.velocity.set(
        (Math.random() - 0.5) * 0.025 + migrationDirection.x * 0.015,
        (Math.random() - 0.5) * 0.025 + migrationDirection.y * 0.015,
        (Math.random() - 0.5) * 0.025 + migrationDirection.z * 0.015
      );
    }
  }
});

document.getElementById('addBirdBtn').addEventListener('click', () => {
  addBird(new THREE.Vector3(0, 0, 0));
});

document.getElementById('removeBirdBtn').addEventListener('click', () => {
  removeLastBird();
});

document.getElementById('setBirdCount').addEventListener('click', () => {
  const desired = parseInt(document.getElementById('birdCountInput').value);
  if (isNaN(desired) || desired < 0) return;

  while (birds.length < desired) {
    addBird(new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    ));
  }
  while (birds.length > desired) {
    removeLastBird();
  }
});

// Actualizar contador
function updateBirdCountInput() {
  document.getElementById('birdCountInput').value = birds.length;
}

// Variables de tiempo
let lastTime = 0;

// Loop de animación
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const deltaTime = (currentTime - lastTime) * 0.001;
  lastTime = currentTime;
  
  controls.update();
  updateBirds(deltaTime);
  
  // Rotación suave de las estrellas
  starField.rotation.y += 0.0002;
  starField.rotation.x += 0.0001;
  
  renderer.render(scene, camera);
}

// Manejo de resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar animación
animate(0);
