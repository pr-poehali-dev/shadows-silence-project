
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type SelectedItemsProps = {
  items: string[];
  onRemove: (itemId: string) => void;
};

const getItemDetails = (itemId: string) => {
  const itemMap: Record<string, { name: string; icon: string; description: string }> = {
    'flashlight': { 
      name: 'Фонарик', 
      icon: 'Flashlight', 
      description: 'Ваш единственный источник света в темноте.' 
    },
    'medkit': { 
      name: 'Аптечка', 
      icon: 'FirstAid', 
      description: 'Восстанавливает здоровье при использовании.' 
    },
    'food': { 
      name: 'Консервы', 
      icon: 'Utensils', 
      description: 'Утоляют голод и дают силы двигаться дальше.' 
    },
    'radio': { 
      name: 'Радиоприемник', 
      icon: 'Radio', 
      description: 'Может ловить обрывки сообщений или сигналы бедствия.' 
    },
    'wrench': { 
      name: 'Гаечный ключ', 
      icon: 'Wrench', 
      description: 'Для открытия запертых дверей или ремонта механизмов.' 
    },
    'photo': { 
      name: 'Семейная фотография', 
      icon: 'Image', 
      description: 'Дает моральный буст, снижает уровень паники.' 
    },
  };
  
  return itemMap[itemId] || { name: 'Неизвестный предмет', icon: 'HelpCircle', description: 'Описание отсутствует' };
};

export const SelectedItems = ({ items, onRemove }: SelectedItemsProps) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
        <Icon name="Package" size={32} className="mx-auto mb-2 opacity-50" />
        <p>Ваш инвентарь пуст</p>
        <p className="text-sm">Выберите предметы из левой панели</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {items.map((itemId) => {
        const item = getItemDetails(itemId);
        
        return (
          <Card key={itemId} className="p-3 bg-gray-800/40 border-gray-700 flex items-center">
            <div className="bg-purple-800 p-2 rounded-full mr-3">
              <Icon name={item.icon as any} size={20} className="text-purple-200" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-red-900/30"
              onClick={() => onRemove(itemId)}
            >
              <Icon name="X" size={16} />
            </Button>
          </Card>
        );
      })}
      
      {items.length < 3 && (
        <div className="text-center text-sm text-gray-500 pt-2">
          <p>Осталось мест: {3 - items.length}</p>
        </div>
      )}
    </div>
  );
};
