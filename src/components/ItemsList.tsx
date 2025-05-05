
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Item = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const AVAILABLE_ITEMS: Item[] = [
  {
    id: 'flashlight',
    name: 'Фонарик',
    description: 'Ваш единственный источник света в темноте комплекса. Батарейки ограничены.',
    icon: 'Flashlight'
  },
  {
    id: 'medkit',
    name: 'Аптечка',
    description: 'Восстанавливает здоровье при использовании.',
    icon: 'FirstAid'
  },
  {
    id: 'food',
    name: 'Консервы',
    description: 'Утоляют голод и дают силы двигаться дальше.',
    icon: 'Utensils'
  },
  {
    id: 'radio',
    name: 'Радиоприемник',
    description: 'Может ловить обрывки сообщений или сигналы бедствия, дающие подсказки.',
    icon: 'Radio'
  },
  {
    id: 'wrench',
    name: 'Гаечный ключ',
    description: 'Для открытия запертых дверей или ремонта сломанных механизмов.',
    icon: 'Wrench'
  },
  {
    id: 'photo',
    name: 'Семейная фотография',
    description: 'Дает моральный буст, снижает уровень паники.',
    icon: 'Image'
  }
];

type ItemsListProps = {
  onSelectItem: (itemId: string) => void;
  selectedItems: string[];
};

export const ItemsList = ({ onSelectItem, selectedItems }: ItemsListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {AVAILABLE_ITEMS.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        
        return (
          <Card 
            key={item.id}
            className={`p-3 cursor-pointer transition-all duration-300 flex flex-col items-center text-center border
              ${isSelected 
                ? 'bg-purple-900/30 border-purple-500' 
                : 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/30'
              }
              ${hoveredItem === item.id ? 'ring-2 ring-purple-500' : ''}
            `}
            onClick={() => onSelectItem(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`p-3 rounded-full mb-2 
              ${isSelected ? 'bg-purple-800' : 'bg-gray-700'}`
            }>
              <Icon name={item.icon as any} size={24} className={isSelected ? 'text-purple-200' : 'text-gray-300'} />
            </div>
            <h3 className="font-medium mb-1">{item.name}</h3>
            {hoveredItem === item.id && (
              <p className="text-xs text-gray-400">{item.description}</p>
            )}
          </Card>
        );
      })}
    </div>
  );
};
