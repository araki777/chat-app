import type { NextPage } from "next";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useStyles } from "@/styles/pages/threeJs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as lil from "lil-gui";

const ThreeJs: NextPage = () => {
  const canvasRef = useRef<any>(null);
  const { classes } = useStyles();

  useEffect(() => {
    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("/textures/matcaps/7.png");

    // Scene
    const scene = new THREE.Scene();

    const axes = new THREE.AxesHelper();
    scene.add(axes);

    const fontLoader = new FontLoader();

    const donut: any = [];

    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Hello! Three.js", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      });

      textGeometry.center();

      const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
      const text = new THREE.Mesh(textGeometry, material);
      scene.add(text);

      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
      for (let i = 0; i < 300; i++) {
        donut[i] = new THREE.Mesh(donutGeometry, material);

        donut[i].position.x = (Math.random() - 0.5) * 10;
        donut[i].position.y = (Math.random() - 0.5) * 10;
        donut[i].position.z = (Math.random() - 0.5) * 10;

        const scale = Math.random();
        donut[i].scale.set(scale, scale, scale);

        scene.add(donut[i]);
      }

      tick();
    });

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );

    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const clock = new THREE.Clock();

    let rot = 0;

    // Animations
    const tick = () => {
      if (donut) {
        for (let i = 0; i < 300; i++) {
          donut[i].rotation.x += Math.random() * 0.01;
          donut[i].rotation.y += Math.random() * 0.01;
        }
      }
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };
  }, []);

  return <canvas className={classes.canvas} ref={canvasRef}></canvas>;
};

export default ThreeJs;
