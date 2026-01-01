import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type Activity = {
  id: string;
  title: string;
  description: string;
  category: string;
  user: {
    name: string;
    initials: string;
    verified: boolean;
  };
  date: string;
  participants: number;
};

type Meeting = {
  id: string;
  partner: string;
  initials: string;
  startTime: Date;
  status: 'active' | 'completed' | 'failed';
  duration: number;
  mindfulnessPoints: number;
  reward?: {
    type: 'discount' | 'points';
    value: string;
    partner: string;
  };
};

type Reward = {
  id: string;
  title: string;
  description: string;
  partner: string;
  discount: string;
  icon: string;
  pointsCost: number;
};

type CharacterItem = {
  id: string;
  name: string;
  type: 'outfit' | 'accessory' | 'background' | 'effect';
  icon: string;
  color: string;
  pointsCost: number;
  levelRequired: number;
  description: string;
  owned: boolean;
  equipped: boolean;
};

type PlayerCharacter = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalMeetings: number;
  totalHoursOffline: number;
  equippedItems: {
    outfit?: CharacterItem;
    accessory?: CharacterItem;
    background?: CharacterItem;
    effect?: CharacterItem;
  };
};

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Шоппинг в ТЦ на выходных',
    description: 'Ищу компанию для похода за одеждой. Хочу обновить гардероб к лету, нужен честный совет по выбору вещей!',
    category: 'Шоппинг',
    user: { name: 'Анна', initials: 'АК', verified: true },
    date: '15 января',
    participants: 1
  },
  {
    id: '2',
    title: 'Свадьба друга - нужен +1',
    description: 'Приглашен на свадьбу с возможностью взять гостя. Будет весело, хорошая музыка и вкусная еда. Давай вместе отметим!',
    category: 'Мероприятия',
    user: { name: 'Максим', initials: 'МП', verified: true },
    date: '22 января',
    participants: 1
  },
  {
    id: '3',
    title: 'Поход в новый ресторан',
    description: 'Открылся интересный азиатский ресторан в центре. Хочу попробовать, но одному не так интересно. Составишь компанию?',
    category: 'Еда',
    user: { name: 'Елена', initials: 'ЕС', verified: false },
    date: '18 января',
    participants: 2
  },
  {
    id: '4',
    title: 'Фитнес тренировка в зале',
    description: 'Ищу напарника для утренних тренировок. Буду рад поделиться опытом или просто позаниматься вместе!',
    category: 'Спорт',
    user: { name: 'Дмитрий', initials: 'ДВ', verified: true },
    date: 'Каждый день',
    participants: 1
  }
];

const categories = ['Шоппинг', 'Мероприятия', 'Еда', 'Спорт', 'Путешествия', 'Культура', 'Хобби', 'Другое'];

const categoryIcons: Record<string, string> = {
  'Шоппинг': 'ShoppingBag',
  'Мероприятия': 'Calendar',
  'Еда': 'Coffee',
  'Спорт': 'Dumbbell',
  'Путешествия': 'Plane',
  'Культура': 'Theatre',
  'Хобби': 'Gamepad2',
  'Другое': 'Sparkles'
};

const mockMeetings: Meeting[] = [
  {
    id: '1',
    partner: 'Анна',
    initials: 'АК',
    startTime: new Date(Date.now() - 45 * 60000),
    status: 'active',
    duration: 45,
    mindfulnessPoints: 0
  },
  {
    id: '2',
    partner: 'Максим',
    initials: 'МП',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60000),
    status: 'completed',
    duration: 135,
    mindfulnessPoints: 150,
    reward: {
      type: 'discount',
      value: '20% скидка',
      partner: 'Кофе Хауз'
    }
  }
];

const initialCharacter: PlayerCharacter = {
  level: 8,
  xp: 2450,
  xpToNextLevel: 3000,
  totalMeetings: 24,
  totalHoursOffline: 52,
  equippedItems: {}
};

const shopItems: CharacterItem[] = [
  {
    id: '1',
    name: 'Худи уличный',
    type: 'outfit',
    icon: 'Shirt',
    color: '#8B5CF6',
    pointsCost: 150,
    levelRequired: 1,
    description: 'Стильная толстовка для встреч',
    owned: true,
    equipped: true
  },
  {
    id: '2',
    name: 'Деловой костюм',
    type: 'outfit',
    icon: 'Briefcase',
    color: '#1F2937',
    pointsCost: 300,
    levelRequired: 5,
    description: 'Для важных встреч и мероприятий',
    owned: false,
    equipped: false
  },
  {
    id: '3',
    name: 'Спортивная форма',
    type: 'outfit',
    icon: 'Dumbbell',
    color: '#0EA5E9',
    pointsCost: 200,
    levelRequired: 3,
    description: 'Для активных встреч и тренировок',
    owned: true,
    equipped: false
  },
  {
    id: '4',
    name: 'Солнечные очки',
    type: 'accessory',
    icon: 'Glasses',
    color: '#F59E0B',
    pointsCost: 100,
    levelRequired: 2,
    description: 'Добавь стиля своему образу',
    owned: true,
    equipped: false
  },
  {
    id: '5',
    name: 'Корона лидера',
    type: 'accessory',
    icon: 'Crown',
    color: '#EAB308',
    pointsCost: 500,
    levelRequired: 10,
    description: 'Для настоящих лидеров общения',
    owned: false,
    equipped: false
  },
  {
    id: '6',
    name: 'Наушники',
    type: 'accessory',
    icon: 'Headphones',
    color: '#EC4899',
    pointsCost: 150,
    levelRequired: 4,
    description: 'Музыка делает встречи лучше',
    owned: false,
    equipped: false
  },
  {
    id: '7',
    name: 'Город ночью',
    type: 'background',
    icon: 'Building2',
    color: '#6366F1',
    pointsCost: 250,
    levelRequired: 6,
    description: 'Фон ночного мегаполиса',
    owned: false,
    equipped: false
  },
  {
    id: '8',
    name: 'Летний парк',
    type: 'background',
    icon: 'Trees',
    color: '#10B981',
    pointsCost: 200,
    levelRequired: 4,
    description: 'Зелёный уютный парк',
    owned: false,
    equipped: false
  },
  {
    id: '9',
    name: 'Сияние звезды',
    type: 'effect',
    icon: 'Sparkles',
    color: '#FFD700',
    pointsCost: 400,
    levelRequired: 8,
    description: 'Эффект свечения вокруг героя',
    owned: true,
    equipped: false
  },
  {
    id: '10',
    name: 'Огненный ореол',
    type: 'effect',
    icon: 'Flame',
    color: '#F97316',
    pointsCost: 600,
    levelRequired: 12,
    description: 'Огненная аура вокруг персонажа',
    owned: false,
    equipped: false
  }
];

const availableRewards: Reward[] = [
  {
    id: '1',
    title: 'Скидка 30% в кино',
    description: 'Билет на любой сеанс в Кинотеатре "Мираж"',
    partner: 'Кинотеатр "Мираж"',
    discount: '30%',
    icon: 'Film',
    pointsCost: 200
  },
  {
    id: '2',
    title: 'Боулинг: 1 час бесплатно',
    description: 'Час игры в боулинг на двоих',
    partner: 'Cosmic Bowling',
    discount: '100%',
    icon: 'Trophy',
    pointsCost: 300
  },
  {
    id: '3',
    title: 'Кофе в подарок',
    description: 'Любой напиток размера Medium',
    partner: 'Кофе Хауз',
    discount: 'Бесплатно',
    icon: 'Coffee',
    pointsCost: 100
  },
  {
    id: '4',
    title: 'Ужин на двоих -50%',
    description: 'Скидка на меню в будние дни',
    partner: 'Ресторан "Seasons"',
    discount: '50%',
    icon: 'UtensilsCrossed',
    pointsCost: 250
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'feed' | 'my' | 'chats' | 'rewards' | 'profile' | 'shop'>('profile');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [mindfulnessPoints, setMindfulnessPoints] = useState(380);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(mockMeetings.find(m => m.status === 'active') || null);
  const [character, setCharacter] = useState<PlayerCharacter>(initialCharacter);
  const [inventory, setInventory] = useState<CharacterItem[]>(shopItems);
  const [shopFilter, setShopFilter] = useState<'all' | 'outfit' | 'accessory' | 'background' | 'effect'>('all');

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (currentActivityIndex < mockActivities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        setCurrentActivityIndex(0);
      }
      setSwipeDirection(null);
    }, 300);
  };

  const currentActivity = mockActivities[currentActivityIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {activeTab === 'feed' && (
          <div className="flex-1 p-6 flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Найди компанию
              </h1>
              <p className="text-muted-foreground mt-1">Свайпай и находи друзей для любых дел</p>
            </div>

            <div className="flex-1 flex items-center justify-center mb-6">
              <Card 
                className={`w-full h-[500px] p-6 shadow-xl border-0 transition-all duration-300 ${
                  swipeDirection === 'left' ? 'translate-x-[-400px] rotate-[-20deg] opacity-0' :
                  swipeDirection === 'right' ? 'translate-x-[400px] rotate-[20deg] opacity-0' : ''
                }`}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="gradient-primary text-white border-0">
                      <Icon name={categoryIcons[currentActivity.category]} size={14} className="mr-1" />
                      {currentActivity.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Icon name="Calendar" size={12} className="mr-1" />
                      {currentActivity.date}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-bold mb-3">{currentActivity.title}</h2>
                  <p className="text-muted-foreground mb-6 flex-1">{currentActivity.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 gradient-accent">
                        <AvatarFallback className="bg-transparent text-white font-semibold">
                          {currentActivity.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">{currentActivity.user.name}</span>
                          {currentActivity.user.verified && (
                            <Icon name="BadgeCheck" size={16} className="text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <Icon name="Users" size={12} className="inline mr-1" />
                          {currentActivity.participants} {currentActivity.participants === 1 ? 'участник' : 'участника'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 w-16 rounded-full border-2 hover:border-destructive hover:bg-destructive/10"
                onClick={() => handleSwipe('left')}
              >
                <Icon name="X" size={28} className="text-destructive" />
              </Button>
              <Button 
                size="lg" 
                className="h-20 w-20 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all"
                onClick={() => handleSwipe('right')}
              >
                <Icon name="Heart" size={32} />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'my' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Мои запросы</h1>
                <p className="text-sm text-muted-foreground">Управляй своими активностями</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gradient-primary rounded-full h-12 w-12 p-0">
                    <Icon name="Plus" size={24} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создать запрос</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="title">Заголовок</Label>
                      <Input id="title" placeholder="Например: Поход в кино" />
                    </div>
                    <div>
                      <Label htmlFor="category">Категория</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Выбери категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Расскажи подробнее о своём запросе..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Дата</Label>
                      <Input id="date" type="date" />
                    </div>
                    <Button className="w-full gradient-primary">
                      Создать запрос
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {userActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="Inbox" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Пока нет запросов</h3>
                <p className="text-muted-foreground text-sm">
                  Создай свой первый запрос и найди компанию!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userActivities.map(activity => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="gradient-primary text-white border-0">
                        {activity.category}
                      </Badge>
                      <Icon name="MoreVertical" size={20} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">Чаты</h1>
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Icon name="MessageCircle" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Пока нет сообщений</h3>
              <p className="text-muted-foreground text-sm">
                Начни общаться, когда найдёшь компанию!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="flex-1 p-6 overflow-auto pb-20">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Награды</h1>
              <div className="flex items-center gap-2">
                <div className="flex-1 gradient-primary rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm opacity-90">Очки осознанности</span>
                    <Icon name="Sparkles" size={20} />
                  </div>
                  <div className="text-3xl font-bold">{mindfulnessPoints}</div>
                </div>
              </div>
            </div>

            {activeMeeting && (
              <Card className="mb-6 p-4 border-2 border-primary/20 gradient-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="gradient-accent text-white border-0">
                    <Icon name="MapPin" size={12} className="mr-1" />
                    Активная встреча
                  </Badge>
                  <span className="text-sm font-semibold text-primary">
                    {activeMeeting.duration} мин
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12 gradient-accent">
                    <AvatarFallback className="bg-transparent text-white font-semibold">
                      {activeMeeting.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Встреча с {activeMeeting.partner}</p>
                    <p className="text-xs text-muted-foreground">
                      Уберите телефоны на 2 часа для получения бонусов
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс до награды</span>
                    <span className="font-semibold">{Math.round((activeMeeting.duration / 120) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary transition-all duration-500"
                      style={{ width: `${Math.min((activeMeeting.duration / 120) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Осталось {Math.max(120 - activeMeeting.duration, 0)} минут
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Icon name="Pause" size={16} className="mr-2" />
                    Пауза
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Icon name="X" size={16} className="mr-2" />
                    Завершить
                  </Button>
                </div>
              </Card>
            )}

            <div className="mb-4">
              <h2 className="text-lg font-bold mb-3">История встреч</h2>
              <div className="space-y-3">
                {meetings.filter(m => m.status === 'completed').map(meeting => (
                  <Card key={meeting.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 gradient-primary">
                        <AvatarFallback className="bg-transparent text-white font-semibold text-sm">
                          {meeting.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{meeting.partner}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                            <Icon name="Check" size={12} className="mr-1" />
                            Завершено
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {meeting.duration} минут вместе
                        </p>
                        {meeting.reward && (
                          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                            <Icon name="Gift" size={16} className="text-primary" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold">{meeting.reward.value}</p>
                              <p className="text-xs text-muted-foreground">{meeting.reward.partner}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          <Icon name="Sparkles" size={14} className="text-primary" />
                          <span className="text-sm font-semibold text-primary">
                            +{meeting.mindfulnessPoints} очков
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold mb-3">Доступные награды</h2>
              <div className="space-y-3">
                {availableRewards.map(reward => (
                  <Card key={reward.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon name={reward.icon} size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{reward.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {reward.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reward.partner}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Icon name="Sparkles" size={14} className="text-primary" />
                            <span className="text-sm font-semibold">{reward.pointsCost} очков</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="gradient-primary"
                            disabled={mindfulnessPoints < reward.pointsCost}
                          >
                            {mindfulnessPoints >= reward.pointsCost ? 'Получить' : 'Не хватает'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Как это работает?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Встречайтесь с друзьями в одной геолокации</li>
                    <li>• Не разблокируйте телефоны 2 часа</li>
                    <li>• Получайте очки и скидки у партнёров</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex-1 p-6 overflow-auto pb-24">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Профиль</h1>
            </div>
            
            <Card className="mb-6 p-6 gradient-primary text-white border-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">Ваше Имя</h2>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-0">
                      <Icon name="BadgeCheck" size={14} className="mr-1" />
                      Верифицирован
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0">
                      Уровень {character.level}
                    </Badge>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setActiveTab('shop')}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Icon name="ShoppingBag" size={16} className="mr-2" />
                  Магазин
                </Button>
              </div>

              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                {character.equippedItems.background && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Icon name={character.equippedItems.background.icon} size={120} style={{ color: character.equippedItems.background.color }} />
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {character.equippedItems.effect && (
                      <div className="absolute inset-0 -m-8 animate-pulse">
                        <Icon name={character.equippedItems.effect.icon} size={140} style={{ color: character.equippedItems.effect.color }} className="opacity-40" />
                      </div>
                    )}
                    
                    <div className="relative w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                      <Icon 
                        name={character.equippedItems.outfit?.icon || 'User'} 
                        size={64} 
                        style={{ color: character.equippedItems.outfit?.color || '#ffffff' }}
                      />
                    </div>
                    
                    {character.equippedItems.accessory && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                          <Icon name={character.equippedItems.accessory.icon} size={24} style={{ color: character.equippedItems.accessory.color }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="opacity-90">Опыт до {character.level + 1} уровня</span>
                    <span className="font-semibold">{character.xp} / {character.xpToNextLevel}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{character.totalMeetings}</div>
                    <div className="text-xs opacity-80">Встреч</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{character.totalHoursOffline}ч</div>
                    <div className="text-xs opacity-80">Без телефона</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mindfulnessPoints}</div>
                    <div className="text-xs opacity-80">Очков</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mb-4">
              <h2 className="text-lg font-bold mb-3">Экипированные вещи</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(character.equippedItems).map(([slot, item]) => {
                  if (!item) return null;
                  return (
                    <Card key={slot} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <Icon name={item.icon} size={20} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {Object.keys(character.equippedItems).length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                    Ничего не экипировано. Зайди в магазин!
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Shield" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Безопасность</p>
                    <p className="text-sm text-muted-foreground">Верификация и настройки</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </Card>

              <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon name="Bell" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">Уведомления</p>
                    <p className="text-sm text-muted-foreground">Настройки оповещений</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </Card>

              <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name="Settings" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Настройки</p>
                    <p className="text-sm text-muted-foreground">Общие параметры</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="flex-1 p-6 overflow-auto pb-24">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Магазин</h1>
                <p className="text-sm text-muted-foreground">Прокачай своего персонажа</p>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('profile')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
            </div>

            <div className="mb-6 gradient-primary rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Sparkles" size={20} />
                  <span className="font-semibold">Баланс очков</span>
                </div>
                <div className="text-2xl font-bold">{mindfulnessPoints}</div>
              </div>
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {(['all', 'outfit', 'accessory', 'background', 'effect'] as const).map(filter => (
                <Button
                  key={filter}
                  size="sm"
                  variant={shopFilter === filter ? 'default' : 'outline'}
                  onClick={() => setShopFilter(filter)}
                  className={shopFilter === filter ? 'gradient-primary' : ''}
                >
                  {filter === 'all' ? 'Всё' : 
                   filter === 'outfit' ? 'Одежда' :
                   filter === 'accessory' ? 'Аксессуары' :
                   filter === 'background' ? 'Фоны' : 'Эффекты'}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              {inventory
                .filter(item => shopFilter === 'all' || item.type === shopFilter)
                .map(item => (
                  <Card key={item.id} className={`p-4 transition-all ${item.equipped ? 'border-2 border-primary shadow-md' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}15`, border: `2px solid ${item.color}30` }}
                      >
                        <Icon name={item.icon} size={32} style={{ color: item.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {item.type === 'outfit' ? 'Одежда' :
                                 item.type === 'accessory' ? 'Аксессуар' :
                                 item.type === 'background' ? 'Фон' : 'Эффект'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Icon name="TrendingUp" size={10} className="mr-1" />
                                Ур. {item.levelRequired}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Icon name="Sparkles" size={14} className="text-primary" />
                            <span className="text-sm font-semibold">{item.pointsCost} очков</span>
                          </div>
                          
                          {item.equipped ? (
                            <Badge className="gradient-primary text-white border-0">
                              <Icon name="Check" size={12} className="mr-1" />
                              Экипировано
                            </Badge>
                          ) : item.owned ? (
                            <Button 
                              size="sm"
                              onClick={() => {
                                const newEquipped = { ...character.equippedItems };
                                newEquipped[item.type] = item;
                                setCharacter({ ...character, equippedItems: newEquipped });
                                setInventory(inventory.map(i => ({
                                  ...i,
                                  equipped: i.id === item.id ? true : (i.type === item.type ? false : i.equipped)
                                })));
                              }}
                            >
                              Надеть
                            </Button>
                          ) : character.level < item.levelRequired ? (
                            <Button size="sm" disabled>
                              <Icon name="Lock" size={14} className="mr-1" />
                              Закрыто
                            </Button>
                          ) : mindfulnessPoints < item.pointsCost ? (
                            <Button size="sm" disabled>
                              Мало очков
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              className="gradient-primary"
                              onClick={() => {
                                setMindfulnessPoints(prev => prev - item.pointsCost);
                                setInventory(inventory.map(i => 
                                  i.id === item.id ? { ...i, owned: true } : i
                                ));
                              }}
                            >
                              Купить
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            <Card className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Как получать очки?</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Встречайся с друзьями без телефонов</li>
                    <li>• Повышай уровень персонажа</li>
                    <li>• Открывай новые предметы и эффекты</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        <nav className="border-t bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-around p-4">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'feed' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Home" size={24} />
              <span className="text-xs font-medium">Главная</span>
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'my' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Grid" size={24} />
              <span className="text-xs font-medium">Мои</span>
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                activeTab === 'rewards' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Gift" size={24} />
              <span className="text-xs font-medium">Награды</span>
              {activeMeeting && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'chats' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="MessageCircle" size={24} />
              <span className="text-xs font-medium">Чаты</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name="User" size={24} />
              <span className="text-xs font-medium">Профиль</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}