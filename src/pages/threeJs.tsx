import type { NextPage } from "next";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useStyles } from "@/styles/pages/threeJs";
import gsap from "gsap";
import GUI from "lil-gui";

const ThreeJs: NextPage = () => {
  const canvasRef = useRef<any>(null);
  const { classes } = useStyles();

  useEffect(() => {
    const gui = new GUI();

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

    const loadingManager = new THREE.LoadingManager();

    // loadingManager.onStart = () => {
    //   console.log("onStart");
    // };

    // loadingManager.onLoad = () => {
    //   console.log("onLoad");
    // };

    // loadingManager.onProgress = () => {
    //   console.log("onProgress");
    // };

    // loadingManager.onError = () => {
    //   console.log("onError");
    // };

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const colorTexture = textureLoader.load("./textures/minecraft.png");
    const alphaTexture = textureLoader.load("./textures/door/alpha.jpg");
    const heightTexture = textureLoader.load("./textures/door/height.jpg");
    const normalTexture = textureLoader.load("./textures/door/normal.jpg");
    const ambientOcclusionTexture = textureLoader.load(
      "./textures/door/ambientOcclusion.jpg"
    );
    const metalnessTexture = textureLoader.load(
      "./textures/door/metalness.jpg"
    );
    const roughnessTexture = textureLoader.load(
      "./textures/door/roughness.jpg"
    );

    // colorTexture.repeat.x = 2;
    // colorTexture.repeat.y = 3;
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
    // colorTexture.wrapT = THREE.MirroredRepeatWrapping;

    // colorTexture.offset.x = 0.5;
    // colorTexture.offset.y = 0.5;

    // colorTexture.rotation = Math.PI / 4;
    // colorTexture.center.x = 0.5;
    // colorTexture.center.y = 0.5;

    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.magFilter = THREE.NearestFilter;

    // Scene
    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    console.log(geometry.attributes.uv);
    const material = new THREE.MeshBasicMaterial({
      map: colorTexture,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("elevation");

    gui.add(mesh, "visible");

    gui.add(material, "wireframe");

    const parameters = {
      spin: () => {
        gsap.to(mesh.rotation, {
          duration: 1,
          y: mesh.rotation.y + Math.PI * 2,
        });
      },
    };

    const spin = () => {};

    gui.addColor(material, "color");

    gui.add(parameters, "spin");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );

    camera.position.z = 9;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const clock = new THREE.Clock();

    // Animations
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <canvas className={classes.canvas} ref={canvasRef}></canvas>;
};

export default ThreeJs;
