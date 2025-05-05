
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { ItemsList } from '@/components/ItemsList';
import { SelectedItems } from '@/components/SelectedItems';

const PREPARATION_TIME = 60; // время в секундах

const Preparation = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(PREPARATION_TIME);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Эффект для обратного отсчета
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      return;
    }
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);
  
  // Обработчик выбора предмета
  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      if (selectedItems.length < 3) { // Ограничение на 3 предмета
        setSelectedItems([...selectedItems, itemId]);
      }
    }
  };
  
  // Начало игры в комплексе
  const startComplex = () => {
    // Здесь будет переход к следующей фазе игры
    // navigate('/complex', { state: { items: selectedItems } });
    alert('Фаза комплекса будет доступна в следующем обновлении!');
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-300">Фаза подготовки</h1>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" className="text-yellow-500" />
            <div className="text-2xl font-bold text-yellow-500">{timeLeft}с</div>
          </div>
        </div>
        
        <Progress value={(timeLeft / PREPARATION_TIME) * 100} className="h-2 mb-8 bg-gray-800" indicatorClassName="bg-yellow-500" />
        
        {!isGameOver ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/70 border-purple-900/50 p-4">
              <h2 className="text-xl font-semibold mb-4 text-purple-200">Квартира Виктора</h2>
              <p className="mb-4 text-gray-300">
                У вас есть всего 60 секунд, чтобы собрать необходимые вещи перед отправлением в комплекс. 
                Выберите мудро - вы можете взять только 3 предмета.
              </p>
              
              <ItemsList onSelectItem={handleSelectItem} selectedItems={selectedItems} />
            </Card>
            
            <Card className="bg-black/70 border-purple-900/50 p-4">
              <h2 className="text-xl font-semibold mb-4 text-purple-200">Инвентарь</h2>
              <p className="mb-4 text-gray-300">
                Выбранные предметы ({selectedItems.length}/3):
              </p>
              
              <SelectedItems items={selectedItems} onRemove={handleSelectItem} />
              
              <div className="mt-6">
                <Button 
                  disabled={selectedItems.length === 0}
                  className="w-full bg-purple-800 hover:bg-purple-700 py-2"
                  onClick={startComplex}
                >
                  {selectedItems.length > 0 ? 'Отправиться в комплекс' : 'Выберите хотя бы один предмет'}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="bg-black/70 border-red-900/50 p-6 text-center">
            <h2 className="text-3xl font-bold text-red-400 mb-4">Время вышло!</h2>
            <p className="mb-6">
              Вы не успели собраться. В критической ситуации важно действовать быстро и решительно.
            </p>
            <Button 
              className="bg-purple-800 hover:bg-purple-700"
              onClick={() => {
                setTimeLeft(PREPARATION_TIME);
                setSelectedItems([]);
                setIsGameOver(false);
              }}
            >
              <Icon name="RefreshCw" className="mr-2" />
              Попробовать снова
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Preparation;
