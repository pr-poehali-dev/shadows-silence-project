
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';

interface Position {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

const ThreeDScene = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 0,
    y: 0,
    z: 0,
    rotation: 0
  });
  
  const [shadowPosition, setShadowPosition] = useState<Position>({
    x: -5,
    y: 0,
    z: -15,
    rotation: 0
  });
  
  const [isGameActive, setIsGameActive] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  
  // Начало игры
  const startGame = () => {
    setIsGameActive(true);
  };
  
  // Обработка нажатий клавиш
  useEffect(() => {
    if (!isGameActive) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key]: true }));
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameActive]);
  
  // Игровой цикл
  useEffect(() => {
    if (!isGameActive) return;
    
    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 1000; // в секундах
      lastTime = timestamp;
      
      // Передвижение игрока
      let moveX = 0;
      let moveZ = 0;
      let rotateY = 0;
      
      if (keysPressed['w'] || keysPressed['ArrowUp']) moveZ = -2;
      if (keysPressed['s'] || keysPressed['ArrowDown']) moveZ = 2;
      if (keysPressed['a'] || keysPressed['ArrowLeft']) rotateY = 2;
      if (keysPressed['d'] || keysPressed['ArrowRight']) rotateY = -2;
      
      // Обновление позиции игрока
      setPlayerPosition(prev => {
        const newRotation = prev.rotation + rotateY * deltaTime;
        
        // Вычисление направления движения в зависимости от поворота
        const radians = newRotation * (Math.PI / 180);
        const moveXRotated = moveZ * Math.sin(radians);
        const moveZRotated = moveZ * Math.cos(radians);
        
        return {
          x: prev.x + moveXRotated * deltaTime,
          y: prev.y,
          z: prev.z + moveZRotated * deltaTime,
          rotation: newRotation
        };
      });
      
      // Движение тени (простой ИИ)
      setShadowPosition(prev => {
        // Вычисляем вектор к игроку
        const dirX = playerPosition.x - prev.x;
        const dirZ = playerPosition.z - prev.z;
        const distance = Math.sqrt(dirX * dirX + dirZ * dirZ);
        
        // Если тень далеко от игрока, она движется к нему
        if (distance > 5) {
          const speed = 1.2 * deltaTime;
          const normalizedDirX = dirX / distance;
          const normalizedDirZ = dirZ / distance;
          
          return {
            x: prev.x + normalizedDirX * speed,
            y: prev.y,
            z: prev.z + normalizedDirZ * speed,
            rotation: Math.atan2(normalizedDirX, normalizedDirZ) * (180 / Math.PI)
          };
        }
        return prev;
      });
      
      // Проверка на столкновение игрока с тенью
      const distanceToShadow = Math.sqrt(
        Math.pow(playerPosition.x - shadowPosition.x, 2) + 
        Math.pow(playerPosition.z - shadowPosition.z, 2)
      );
      
      if (distanceToShadow < 1.5) {
        // Игра окончена!
        setIsGameActive(false);
        alert('Тень настигла вас...');
        navigate('/');
        return;
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    const animationRef = { current: 0 };
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isGameActive, keysPressed, playerPosition, shadowPosition, navigate]);
  
  // Обновление позиции камеры для 3D-эффекта
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const cameraElement = sceneRef.current.querySelector('.camera');
    const worldElement = sceneRef.current.querySelector('.world');
    
    if (cameraElement && worldElement) {
      // Применяем противоположное движение к миру
      const worldTransform = `translateZ(${-playerPosition.z * 10}px) 
                              translateX(${-playerPosition.x * 10}px) 
                              rotateY(${-playerPosition.rotation}deg)`;
      
      (worldElement as HTMLElement).style.transform = worldTransform;
    }
  }, [playerPosition]);
  
  // Создание мобильных контроллеров
  const renderMobileControls = () => {
    if (!isMobile || !isGameActive) return null;
    
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
        <button 
          className="bg-purple-800/70 p-4 rounded-full"
          onTouchStart={() => setKeysPressed(prev => ({ ...prev, 'ArrowUp': true }))}
          onTouchEnd={() => setKeysPressed(prev => ({ ...prev, 'ArrowUp': false }))}
        >
          ↑
        </button>
        <button 
          className="bg-purple-800/70 p-4 rounded-full"
          onTouchStart={() => setKeysPressed(prev => ({ ...prev, 'ArrowDown': true }))}
          onTouchEnd={() => setKeysPressed(prev => ({ ...prev, 'ArrowDown': false }))}
        >
          ↓
        </button>
        <button 
          className="bg-purple-800/70 p-4 rounded-full"
          onTouchStart={() => setKeysPressed(prev => ({ ...prev, 'ArrowLeft': true }))}
          onTouchEnd={() => setKeysPressed(prev => ({ ...prev, 'ArrowLeft': false }))}
        >
          ←
        </button>
        <button 
          className="bg-purple-800/70 p-4 rounded-full"
          onTouchStart={() => setKeysPressed(prev => ({ ...prev, 'ArrowRight': true }))}
          onTouchEnd={() => setKeysPressed(prev => ({ ...prev, 'ArrowRight': false }))}
        >
          →
        </button>
      </div>
    );
  };
  
  // Рендеринг сцены
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {!isGameActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/50">
          <h2 className="text-2xl mb-4 text-white">Готовы к испытанию?</h2>
          <button 
            className="bg-purple-800 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
            onClick={startGame}
          >
            Начать игру
          </button>
          <p className="mt-4 text-gray-300 text-sm">
            Используйте WASD или стрелки для передвижения.<br/>
            Избегайте встречи с тенью!
          </p>
        </div>
      )}
      
      <div ref={sceneRef} className="perspective w-full h-full">
        <div className="camera absolute inset-0">
          <div className="world absolute top-0 left-0 transition-transform" style={{ transformStyle: 'preserve-3d' }}>
            {/* Пол */}
            <div className="absolute" style={{ 
              width: '1000px', 
              height: '1000px', 
              transform: 'rotateX(90deg) translateZ(-1px)',
              background: 'linear-gradient(135deg, #111 0%, #222 100%)',
              backgroundSize: '20px 20px',
              transformOrigin: 'center center'
            }}>
              {/* Сетка на полу */}
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>
            
            {/* Стены */}
            {[...Array(6)].map((_, i) => (
              <div key={`wall-left-${i}`} className="absolute bg-gradient-to-b from-gray-900 to-gray-800" style={{
                width: '1000px',
                height: '50px',
                transform: `rotateY(90deg) translateZ(${-500 + i * 200}px) translateY(-25px)`,
                transformStyle: 'preserve-3d'
              }}></div>
            ))}
            
            {[...Array(6)].map((_, i) => (
              <div key={`wall-right-${i}`} className="absolute bg-gradient-to-b from-gray-900 to-gray-800" style={{
                width: '1000px',
                height: '50px',
                transform: `rotateY(-90deg) translateZ(${-500 + i * 200}px) translateY(-25px)`,
                transformStyle: 'preserve-3d'
              }}></div>
            ))}
            
            {/* Тень (противник) */}
            <div 
              className="absolute" 
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                filter: 'blur(5px)',
                transform: `translateX(${shadowPosition.x * 10}px) translateY(-15px) translateZ(${shadowPosition.z * 10}px)`,
                boxShadow: '0 0 20px 5px rgba(75, 0, 100, 0.4)'
              }}
            >
              <div className="absolute inset-0 animate-pulse opacity-70 rounded-full bg-purple-900/20"></div>
            </div>
          </div>
        </div>
      </div>
      
      {renderMobileControls()}
      
      {/* Индикатор игрока */}
      {isGameActive && (
        <div className="fixed bottom-4 right-4 z-20 bg-black/50 p-2 rounded text-xs text-white">
          <div>X: {playerPosition.x.toFixed(1)}</div>
          <div>Z: {playerPosition.z.toFixed(1)}</div>
          <div>Поворот: {playerPosition.rotation.toFixed(0)}°</div>
        </div>
      )}
    </div>
  );
};

export default ThreeDScene;
