export interface NewsItem {
  id: string;
  title: string;
  neighborhood: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
}

export interface Comment {
  id: string;
  userAlias: string;
  residencePeriod: string;
  text: string;
  recommended: boolean;
}

export interface Building {
  id: string;
  name: string;
  neighborhood: string;
  summary: string;
  commentCount: number;
  imageUrl: string;
  comments: Comment[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export const news: NewsItem[] = [
  {
    id: 'n1',
    title: 'Nuevo proyecto urbano en Palermo Soho',
    neighborhood: 'Palermo',
    date: '20 Oct 2023',
    summary: 'Se aprueba la construcción de un nuevo complejo residencial de lujo con espacios verdes.',
    content: 'La municipalidad ha dado luz verde al proyecto "Verde Palermo", que promete transformar una antigua zona industrial en un pulmón residencial. El complejo contará con 3 torres de 20 pisos, piscina climatizada y un jardín central abierto al público durante el día. Los vecinos tienen opiniones divididas sobre el impacto en el tráfico de la zona.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'n2',
    title: 'Renovación de fachadas en San Telmo',
    neighborhood: 'San Telmo',
    date: '18 Oct 2023',
    summary: 'El plan de preservación histórica alcanza a 15 edificios emblemáticos del barrio.',
    content: 'Como parte del programa de Patrimonio Urbano, se han iniciado las obras de restauración en la mítica calle Defensa. El objetivo es devolver el esplendor original a las fachadas del siglo XIX sin alterar su estructura interna.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e087563ef3f5?auto=format&fit=crop&w=400&q=80',
  },
];

export const buildings: Building[] = [
  {
    id: 'b1',
    name: 'Edificio Mirador',
    neighborhood: 'Belgrano',
    summary: 'Mayoría positiva',
    commentCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    comments: [
      {
        id: 'c1',
        userAlias: 'JuanP88',
        residencePeriod: '2019 - 2022',
        text: 'Las expensas son un poco caras, pero el mantenimiento es impecable. El gimnasio siempre está limpio.',
        recommended: true,
      },
      {
        id: 'c2',
        userAlias: 'Meli_R',
        residencePeriod: '2021 - Presente',
        text: 'Un poco de ruido en los pisos bajos por la avenida, pero la seguridad es excelente.',
        recommended: true,
      },
    ],
  },
  {
    id: 'b2',
    name: 'Torre del Parque',
    neighborhood: 'Nuñez',
    summary: 'Opiniones divididas',
    commentCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1449156001533-cb39c1482830?auto=format&fit=crop&w=400&q=80',
    comments: [
      {
        id: 'c3',
        userAlias: 'Arquitecto92',
        residencePeriod: '2020 - 2021',
        text: 'Problemas estructurales de humedad en las paredes que dan al sur. No lo recomiendo por el precio.',
        recommended: false,
      },
    ],
  },
];

export const conversations: Conversation[] = [
  {
    id: 'v1',
    title: 'Vecinos de Palermo',
    lastMessage: '¿Alguien sabe por qué cortaron el agua?',
    lastMessageTime: '10:30 AM',
    messages: [
      { id: 'm1', sender: 'Roberto', text: 'Hola a todos!', timestamp: '09:00 AM', isMe: false },
      { id: 'm2', sender: 'Yo', text: 'Hola Roberto!', timestamp: '09:05 AM', isMe: true },
      { id: 'm3', sender: 'Elena', text: '¿Alguien sabe por qué cortaron el agua?', timestamp: '10:30 AM', isMe: false },
    ],
  },
  {
    id: 'v2',
    title: 'Consulta Edificio Mirador',
    lastMessage: 'Me interesa alquilar ahí, ¿qué tal es el portero?',
    lastMessageTime: 'Ayer',
    messages: [
      { id: 'm4', sender: 'Interesado', text: 'Me interesa alquilar ahí, ¿qué tal es el portero?', timestamp: 'Ayer', isMe: false },
    ],
  },
];
