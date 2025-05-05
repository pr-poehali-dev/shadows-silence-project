
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ThreeDSceneProps {
  className?: string;
}

const ThreeDScene = ({ className = '' }: ThreeDSceneProps) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Добавляем обработчик движения мыши для создания эффекта параллакса
    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      // Стены и пол
      const walls = sceneRef.current.querySelectorAll('.wall');
      walls.forEach(wall => {
        const element = wall as HTMLElement;
        element.style.transform = `translateX(${mouseX * -20}px) translateY(${mouseY * -20}px)`;
      });
      
      // Тень
      const shadow = sceneRef.current.querySelector('.shadow') as HTMLElement;
      if (shadow) {
        shadow.style.transform = `translateX(${mouseX * 40}px) translateY(${mouseY * 40}px)`;
      }
    };
    
    // Анимация тени
    let animationId: number;
    const animateShadow = () => {
      if (!sceneRef.current) return;
      const shadow = sceneRef.current.querySelector('.shadow') as HTMLElement;
      
      if (shadow) {
        const time = Date.now() * 0.001;
        shadow.style.opacity = (0.5 + Math.sin(time) * 0.2).toString();
      }
      
      animationId = requestAnimationFrame(animateShadow);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(animateShadow);
    
    // Очистка обработчиков
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div ref={sceneRef} className={`absolute inset-0 z-0 perspective overflow-hidden ${className}`}>
      {/* 3D коридор */}
      <div className="relative w-full h-full">
        {/* Пол */}
        <div className="wall absolute left-0 right-0 bottom-0 h-[30vh] bg-gradient-to-t from-gray-900 to-gray-800 origin-bottom transform rotateX(70deg) translateY(10vh)"></div>
        
        {/* Левая стена */}
        <div className="wall absolute top-0 bottom-0 left-0 w-[10vw] bg-gradient-to-r from-purple-900/30 to-gray-800/20 origin-left transform rotateY(20deg) translateX(-5vw)"></div>
        
        {/* Правая стена */}
        <div className="wall absolute top-0 bottom-0 right-0 w-[10vw] bg-gradient-to-l from-purple-900/30 to-gray-800/20 origin-right transform rotateY(-20deg) translateX(5vw)"></div>
        
        {/* Потолок */}
        <div className="wall absolute left-0 right-0 top-0 h-[25vh] bg-gradient-to-b from-gray-900 to-gray-800 origin-top transform rotateX(-70deg) translateY(-5vh)"></div>
        
        {/* Таинственная тень */}
        <div className="shadow absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-black/70 blur-md transition-transform duration-500 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-black/90 blur-sm"></div>
        </div>
        
        {/* Световые эффекты */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 -ml-48 -mt-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 -mr-32 -mb-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default ThreeDScene;
