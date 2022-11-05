import type { NextPage } from "next";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeJs: NextPage = () => {
  const canvasRef = useRef<any>(null);

  // Sizes
  const sizes = {
    width: 800,
    height: 600,
  };

  const cursor = {
    x: 0,
    y: 0,
  };

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = -(event.clientY / sizes.height - 0.5);
    });
    // Scene
    const scene = new THREE.Scene();

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(mesh);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    // const aspectRatio = sizes.width / sizes.height;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );
    // camera.position.set(2, 2, 2);
    camera.position.z = 3;
    camera.lookAt(mesh.position);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });

    renderer.setSize(sizes.width, sizes.height);

    renderer.render(scene, camera);

    const clock = new THREE.Clock();

    // Animations
    const tick = () => {
      const deltaTime = clock.getElapsedTime();
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      // camera.position.y = cursor.y * 5;
      // camera.lookAt(mesh.position);
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };
    tick();
  }, [cursor, sizes.height, sizes.width]);

  return <canvas ref={canvasRef}></canvas>;
};

export default ThreeJs;
