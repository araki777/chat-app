import type { NextPage } from "next";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useStyles } from "@/styles/pages/threeJs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
    const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
    const doorAmbientOcclusionTexture = textureLoader.load(
      "/textures/door/ambientOcclusion.jpg"
    );
    const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
    const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
    const doorMetalnessTexture = textureLoader.load(
      "/textures/door/metalness.jpg"
    );
    const RoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
    const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
    const gradientsTexture = textureLoader.load("/textures/gradients/5.jpg");
    gradientsTexture.minFilter = THREE.NearestFilter;
    gradientsTexture.magFilter = THREE.NearestFilter;
    gradientsTexture.generateMipmaps = false;

    const environmentMapTexture = cubeTextureLoader.load([
      "/textures/environmentMaps/3/px.jpg",
      "/textures/environmentMaps/3/nx.jpg",
      "/textures/environmentMaps/3/py.jpg",
      "/textures/environmentMaps/3/ny.jpg",
      "/textures/environmentMaps/3/pz.jpg",
      "/textures/environmentMaps/3/nz.jpg",
    ]);

    // Scene
    const scene = new THREE.Scene();

    // const material = new THREE.MeshBasicMaterial();
    // material.map = doorColorTexture;
    // // material.color = new THREE.Color("#ff00ff");
    // // material.wireframe = true;
    // // material.opacity = 0.5;
    // material.transparent = true;
    // material.alphaMap = doorAlphaTexture;
    // material.side = THREE.DoubleSide;

    // const material = new THREE.MeshNormalMaterial();
    // material.flatShading = true;

    // const material = new THREE.MeshMatcapMaterial();
    // material.matcap = matcapTexture;

    // const material = new THREE.MeshDepthMaterial();

    // const material = new THREE.MeshLambertMaterial();

    // const material = new THREE.MeshPhongMaterial();
    // material.shininess = 100;
    // material.specular = new THREE.Color(0xff0000);

    // const material = new THREE.MeshToonMaterial();
    // material.gradientMap = gradientsTexture;

    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    material.envMap = environmentMapTexture;
    // material.map = doorColorTexture;
    // material.aoMap = doorAmbientOcclusionTexture;
    // material.aoMapIntensity = 1;
    // material.displacementMap = doorHeightTexture;
    // material.displacementScale = 0.05;
    // material.metalnessMap = doorMetalnessTexture;
    // material.roughnessMap = doorMetalnessTexture;
    // material.normalMap = doorNormalTexture;
    // material.normalScale.set(0.5, 0.5);
    // material.alphaMap = doorAlphaTexture;
    // material.transparent = true;

    gui.add(material, "metalness").min(0).max(1).step(0.0001);
    gui.add(material, "roughness").min(0).max(1).step(0.0001);
    gui.add(material, "aoMapIntensity").min(0).max(1).step(0.0001);
    gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material
    );
    sphere.position.x = -1.5;

    sphere.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 100, 100),
      material
    );

    plane.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material
    );

    torus.position.x = 1.5;

    torus.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    );

    scene.add(sphere, plane, torus);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );

    camera.position.z = 3;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvasRef.current);

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

      // update objects
      sphere.rotation.y = 0.1 * elapsedTime;
      plane.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.1 * elapsedTime;
      plane.rotation.x = 0.1 * elapsedTime;
      torus.rotation.x = 0.1 * elapsedTime;

      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <canvas className={classes.canvas} ref={canvasRef}></canvas>;
};

export default ThreeJs;
