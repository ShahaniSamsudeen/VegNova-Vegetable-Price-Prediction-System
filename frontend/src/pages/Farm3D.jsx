import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";


useGLTF.preload("/models/carrot.glb");

/* 3D Plant Model */
function PlantModel({ type, position, delay }) {
  const ref = useRef();

  const modelMap = {
    Carrot: "/models/carrot.glb",
    Tomato: "/models/tomato.glb",
    Cabbage: "/models/cabbage.glb",
    Beans: "/models/Beans.glb",
    Leeks: "/models/leek.glb",
    Beetroot: "/models/beetroot.glb",
    Raddish: "/models/radish.glb",
    Knolkhol: "/models/knolkhol.glb",
  };

  const { scene } = useGLTF(modelMap[type] || "/models/carrot.glb");

  
  const model = useMemo(() => {
    const cloned = scene.clone();

    if (type === "Carrot") {
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: "#ff8c00",
            roughness: 0.7,
            metalness: 0.1,
          });
        }
      });
    }

    return cloned;
  }, [scene, type]);

  /* SCALE */
  const scaleMap = {
    Carrot: 7.5,
    Tomato: 2.0,
    Cabbage: 0.1,
    Beans: 7.5,
    Leeks: 0.05,
    Beetroot: 0.010,
    Raddish: 0.2,
    Knolkhol: 0.3,
  };

  const scale = scaleMap[type] || 1.5;

  /*  ANIMATION */
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() - delay;
    if (t > 0 && ref.current) {
      ref.current.position.y = Math.min(0.4, t);
    }
  });

  /* ROTATION */
  const rotationMap = {
    Beetroot: [0, 0, -Math.PI / 2],
    Knolkhol: [0, Math.PI / 2, 0.2],
    default: [0, Math.PI, 0],
  };

  const rotation = rotationMap[type] || rotationMap.default;

  
  const yMap = {
    Beetroot: -0.2,
    default: -0.4,
  };

  const yPos = yMap[type] || yMap.default;

  return (
    <primitive
      ref={ref}
      object={model}
      position={[position[0], yPos, position[2]]}
      scale={scale}
      rotation={rotation}
    />
  );
}

/*  MAIN FARM */
export default function Farm3D({ count, type, spacing }) {
  const plants = [];

  const size = 20;
  const offset = size / 2;

  /* DENSITY CONTROL */
  const baseGap = 0.6;
  const gap = spacing
    ? Math.max(0.3, Math.min(1.2, spacing / 10))
    : baseGap;

  /*  FULL EDGE-TO-EDGE GRID */
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      plants.push([
        (x - offset + 0.5) * gap, 
        0.25,
        (z - offset + 0.5) * gap, 
      ]);
    }
  }

  return (
    <Canvas
      style={{ height: "500px" }}
      camera={{
        position: [size * gap * 0.8, size * gap * 0.8, size * gap * 0.8],
        fov: 55,
      }}
      shadows
    >
      {/*  BACKGROUND */}
      <color attach="background" args={["#e6f7ec"]} />

      {/* LIGHTING */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 15, 10]} intensity={2} castShadow />

      {/*  GROUND  */}
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size * gap, size * gap]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>

      {/*  PLANTS */}
      <Suspense fallback={null}>
        {plants.map((pos, i) => (
          <PlantModel
            key={i}
            position={pos}
            delay={i * 0.005}
            type={type}
          />
        ))}
      </Suspense>

      {/*CONTROLS */}
      <OrbitControls
        enableRotate
        enableZoom
        enablePan
        autoRotate
        autoRotateSpeed={1}
        minDistance={size * gap * 0.5}
        maxDistance={size * gap * 2}
      />
    </Canvas>
  );
}