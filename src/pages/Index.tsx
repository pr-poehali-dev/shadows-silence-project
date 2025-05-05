
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ThreeDScene from '@/components/ThreeDScene';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden relative">
      {/* 3D Сцена */}
      <ThreeDScene />
      
      {/* Главное содержимое */}
      <main className="container mx-auto px-4 py-10 z-10 flex flex-col items-center justify-center flex-grow text-center">
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg mb-4">
          <h1 className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200 horror-text">
            Тени Тишины
          </h1>
          <h2 className="text-xl text-purple-300 mb-8">Shadows of Silence</h2>
        </div>
        
        <Card className="max-w-2xl w-full bg-black/40 backdrop-blur-sm border-purple-900/50 p-6 mb-8">
          <p className="text-lg mb-4 text-gray-100">
            Вы играете за Виктора, бывшего сотрудника исследовательского комплекса времен Холодной войны, 
            который возвращается туда в поисках своей пропавшей дочери.
          </p>
          <p className="mb-4 text-gray-100">
            После неудачного эксперимента что-то вырвалось на свободу, превратив комплекс
            в смертельно опасное место, наполненное странными тенями.
          </p>
          <p className="text-purple-300 font-semibold">
            Сможете ли вы выжить и найти свою дочь, избегая встречи с Тенью?
          </p>
        </Card>
        
        <Button 
          className="bg-purple-800 hover:bg-purple-700 text-white px-8 py-6 text-xl"
          onClick={() => navigate('/preparation')}
        >
          <Icon name="Play" className="mr-2" />
          Начать историю
        </Button>
      </main>
      
      {/* Подвал */}
      <footer className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm z-10">
        <Separator className="bg-purple-900/30 mb-4" />
        3D Стелс-хоррор с элементами симулятора выживания © 2025
      </footer>
    </div>
  );
};

export default Index;
