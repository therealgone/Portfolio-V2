"use client";

import * as THREE from "three";
import { useRef, useCallback, useState, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { Bloom, EffectComposer, LUT } from "@react-three/postprocessing";
import { LUTCubeLoader } from "postprocessing";
import { Beam } from "./Beam";
import { Rainbow } from "./Rainbow";
import { Prism } from "./Prism";
import { Flare } from "./Flare";
import { Box } from "./Box";
import { calculateRefractionAngle, lerp, lerpV3 } from "./util";

export function PrismScene() {
  const [texture, setTexture] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  // ✅ Load LUT only once
  useEffect(() => {
    const loader = new LUTCubeLoader();
    loader.load("/lut/F-6800-STD.cube", setTexture);
  }, []);

  // ✅ Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // On load
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Low-power/adaptive performance detection
  useEffect(() => {
    const connection = typeof navigator !== 'undefined' && navigator.connection ? navigator.connection : null;
    const saveData = !!(connection && connection.saveData);
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowThreads = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    const lowDpr = window.devicePixelRatio && window.devicePixelRatio <= 1;
    setIsLowPower(saveData || reducedMotion || lowThreads || lowDpr);
  }, []);

  return (
    <div className="w-full h-screen min-h-screen flex">
      <Canvas
        orthographic
        dpr={[1, isLowPower ? 1.25 : 1.75]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        shadows={false}
        camera={{ position: [0, 0, 100], zoom: isMobile ? 24 : 64 }}
      >
        <color attach="background" args={["black"]} />
        <Scene isLowPower={isLowPower} />
        <EffectComposer disableNormalPass>
          <Bloom
            mipmapBlur
            levels={isLowPower || isMobile ? 3 : 6}
            intensity={isLowPower || isMobile ? 0.7 : 1.1}
            luminanceThreshold={1}
            luminanceSmoothing={1}
          />
          {(!isLowPower) && texture && <LUT lut={texture} />}
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function Scene({ isLowPower = false }) {
  const [isPrismHit, hitPrism] = useState(false);
  const flare = useRef(null);
  const ambient = useRef(null);
  const spot = useRef(null);
  const boxreflect = useRef(null);
  const rainbow = useRef(null);

  const rayOut = useCallback(() => hitPrism(false), []);
  const rayOver = useCallback((e) => {
    // Break raycast so the ray stops when it touches the prism
    e.stopPropagation();
    hitPrism(true);
    // Set the intensity really high on first contact
    rainbow.current.material.speed = isLowPower ? 0.6 : 1;
    rainbow.current.material.emissiveIntensity = isLowPower ? 6 : 16;
  }, []);

  const vec = new THREE.Vector3();
  const rayMove = useCallback(({ api, position, direction, normal }) => {
    if (!normal) return;
    // Extend the line to the prisms center
    vec.toArray(api.positions, api.number++ * 3);
    // Set flare
    flare.current.position.set(position.x, position.y, -0.5);
    flare.current.rotation.set(0, 0, -Math.atan2(direction.x, direction.y));
    // Calculate refraction angles
    let angleScreenCenter = Math.atan2(-position.y, -position.x);
    const normalAngle = Math.atan2(normal.y, normal.x);
    // The angle between the ray and the normal
    const incidentAngle = angleScreenCenter - normalAngle;
    // Calculate the refraction for the incident angle
    const refractionAngle = calculateRefractionAngle(incidentAngle) * 6;
    // Apply the refraction
    angleScreenCenter += refractionAngle;
    rainbow.current.rotation.z = angleScreenCenter;
    // Set spot light
    lerpV3(
      spot.current.target.position,
      [Math.cos(angleScreenCenter), Math.sin(angleScreenCenter), 0],
      0.05
    );
    spot.current.target.updateMatrixWorld();
  }, []);

  useFrame((state) => {
    // Tie beam to the mouse
    boxreflect.current.setRay(
      [
        (state.pointer.x * state.viewport.width) ,
        (state.pointer.y * state.viewport.height) ,
        0,
      ],
      [0, 0, 0]
    );
    // Animate rainbow intensity
    lerp(
      rainbow.current.material,
      "emissiveIntensity",
      isPrismHit ? (isLowPower ? 1.6 : 2.5) : 0,
      0.1
    );
    spot.current.intensity = rainbow.current.material.emissiveIntensity;
    // Animate ambience
    lerp(ambient.current, "intensity", 0.006, 0.05);
  });

  return (
    <>
      {/* Lights */}
      <ambientLight ref={ambient} intensity={0} />
      <pointLight position={[0, 0, 0]} intensity={0} />
      <pointLight position={[0, 0, 0]} intensity={0} />
      <pointLight position={[0, 0, 0]} intensity={0} />
      <spotLight
        ref={spot}
        intensity={1}
        distance={1}
        angle={1}
        penumbra={1}
        position={[1, 0, 1]}
      />
      {/* Caption */}
      <Center top bottom position={[0, 2, 0]}>
        <Text3D
          size={0.7}
          letterSpacing={-0.05}
          height={0.05}
          font="/fonts/Inter_Bold.json"
          
        >
          Jeevan Baabu Murugan
          <meshStandardMaterial color="White" />
        </Text3D>
      </Center>
      {/* Prism + blocks + reflect beam */}

      <Beam ref={boxreflect} bounce={10} far={30} instanceCount={isLowPower ? 60 : 100}>
        <Prism
          position={[0, -0.5, 0]}
          onRayOver={rayOver}
          onRayOut={rayOut}
          onRayMove={rayMove}
        />
        <Box position={[2.25, -3.5, 0]} rotation={[0, 0, Math.PI / 8]} />
        <Box position={[-2.5, -2.5, 0]} rotation={[0, 0, Math.PI / 3]} />
        <Box position={[-3, 1, 0]} rotation={[0, 0, Math.PI / 4]} />
        <Box position={[3, 1, 0]} rotation={[0, 0, Math.PI / 4]} />
        
      </Beam>
      {/* Rainbow and flares */}
      <Rainbow ref={rainbow} startRadius={0} endRadius={1.5} fade={1} />
      <Flare
        ref={flare}
        visible={isPrismHit}
        renderOrder={10}
        scale={isLowPower ? 0.9 : 1}
        streak={isLowPower ? [10, 16, 4] : [12.5, 20, 5]}
        lowPower={isLowPower}
      />
    </>
  );
}
