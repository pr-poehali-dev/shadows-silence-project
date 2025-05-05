
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeDSceneProps {
  className?: string;
}

const ThreeDScene = ({ className = '' }: ThreeDSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Инициализация сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080810);
    scene.fog = new THREE.FogExp2(0x080810, 0.05);
    
    // Настройка камеры
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      100
    );
    camera.position.set(0, 1.6, 5);
    
    // Настройка рендерера
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    
    // Добавление света
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x9050ff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x7030a0, 1, 10);
    pointLight.position.set(0, 2, -2);
    scene.add(pointLight);
    
    // Создание коридора комплекса
    const corridorLength = 20;
    const corridorWidth = 3;
    const corridorHeight = 3;
    
    // Пол
    const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222, 
      roughness: 0.8 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -corridorLength / 2 + 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Стены
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.7 
    });
    
    // Левая стена
    const leftWallGeometry = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-corridorWidth / 2, corridorHeight / 2, -corridorLength / 2 + 2);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    
    // Правая стена
    const rightWallGeometry = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(corridorWidth / 2, corridorHeight / 2, -corridorLength / 2 + 2);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    // Потолок
    const ceilingGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.9 
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, corridorHeight, -corridorLength / 2 + 2);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    
    // Таинственная тень
    const shadowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(0, 0.5, -10);
    scene.add(shadow);
    
    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Анимация тени
      const time = Date.now() * 0.001;
      shadow.position.x = Math.sin(time) * 1.2;
      shadow.position.y = 0.5 + Math.sin(time * 0.7) * 0.3;
      
      // Пульсация света
      pointLight.intensity = 1 + Math.sin(time * 2) * 0.3;
      
      renderer.render(scene, camera);
    };
    
    // Обработка изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    animate();
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={mountRef} className={`absolute inset-0 z-0 ${className}`} />;
};

export default ThreeDScene;
