export type PassportQuizOption = {
  id: string;
  text: string;
};

export type PassportQuizQuestion = {
  id: string;
  question: string;
  options: PassportQuizOption[];
  correctOptionId: string;
};

export type PassportQuizMode = 'easy' | 'sharp';

export const easyTravelerQuestions: PassportQuizQuestion[] = [
  {
    id: 'easy_1',
    question: 'Which city is famous for the Eiffel Tower?',
    options: [
      { id: 'A', text: 'Rome' },
      { id: 'B', text: 'Paris' },
      { id: 'C', text: 'Vienna' },
      { id: 'D', text: 'Madrid' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_2',
    question: 'Which country is known for pizza and pasta?',
    options: [
      { id: 'A', text: 'Italy' },
      { id: 'B', text: 'Greece' },
      { id: 'C', text: 'Portugal' },
      { id: 'D', text: 'Belgium' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'easy_3',
    question: 'In which country would you find the pyramids of Giza?',
    options: [
      { id: 'A', text: 'Jordan' },
      { id: 'B', text: 'Egypt' },
      { id: 'C', text: 'Morocco' },
      { id: 'D', text: 'Turkey' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_4',
    question: 'Which city is known for its canals and gondolas?',
    options: [
      { id: 'A', text: 'Venice' },
      { id: 'B', text: 'Prague' },
      { id: 'C', text: 'Lisbon' },
      { id: 'D', text: 'Dubrovnik' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'easy_5',
    question: 'Which country is famous for tulips and windmills?',
    options: [
      { id: 'A', text: 'Denmark' },
      { id: 'B', text: 'Netherlands' },
      { id: 'C', text: 'Switzerland' },
      { id: 'D', text: 'Austria' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_6',
    question: 'What is the capital of Japan?',
    options: [
      { id: 'A', text: 'Kyoto' },
      { id: 'B', text: 'Osaka' },
      { id: 'C', text: 'Tokyo' },
      { id: 'D', text: 'Seoul' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'easy_7',
    question: 'Which country is often linked with fjords?',
    options: [
      { id: 'A', text: 'Norway' },
      { id: 'B', text: 'Spain' },
      { id: 'C', text: 'Hungary' },
      { id: 'D', text: 'Croatia' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'easy_8',
    question: 'Which monument stands in New York Harbor?',
    options: [
      { id: 'A', text: 'Big Ben' },
      { id: 'B', text: 'Statue of Liberty' },
      { id: 'C', text: 'Christ the Redeemer' },
      { id: 'D', text: 'Colosseum' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_9',
    question: 'Which country is famous for the island of Santorini?',
    options: [
      { id: 'A', text: 'Greece' },
      { id: 'B', text: 'Italy' },
      { id: 'C', text: 'Cyprus' },
      { id: 'D', text: 'Malta' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'easy_10',
    question: 'Which city is home to the Colosseum?',
    options: [
      { id: 'A', text: 'Athens' },
      { id: 'B', text: 'Rome' },
      { id: 'C', text: 'Milan' },
      { id: 'D', text: 'Naples' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_11',
    question: 'Which country is known for maple syrup?',
    options: [
      { id: 'A', text: 'Sweden' },
      { id: 'B', text: 'Canada' },
      { id: 'C', text: 'Ireland' },
      { id: 'D', text: 'Finland' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_12',
    question: 'Which animal is often associated with Australia?',
    options: [
      { id: 'A', text: 'Panda' },
      { id: 'B', text: 'Kangaroo' },
      { id: 'C', text: 'Tiger' },
      { id: 'D', text: 'Alpaca' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_13',
    question: 'Which city is famous for red double-decker buses?',
    options: [
      { id: 'A', text: 'London' },
      { id: 'B', text: 'Dublin' },
      { id: 'C', text: 'Edinburgh' },
      { id: 'D', text: 'Berlin' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'easy_14',
    question: 'Which country is known for flamenco dancing?',
    options: [
      { id: 'A', text: 'Portugal' },
      { id: 'B', text: 'Spain' },
      { id: 'C', text: 'Argentina' },
      { id: 'D', text: 'Mexico' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'easy_15',
    question: 'What do travelers often throw into the Trevi Fountain for luck?',
    options: [
      { id: 'A', text: 'Flowers' },
      { id: 'B', text: 'Notes' },
      { id: 'C', text: 'Coins' },
      { id: 'D', text: 'Tickets' },
    ],
    correctOptionId: 'C',
  },
];

export const sharpExplorerQuestions: PassportQuizQuestion[] = [
  {
    id: 'sharp_1',
    question: 'Which country has the most official languages?',
    options: [
      { id: 'A', text: 'India' },
      { id: 'B', text: 'South Africa' },
      { id: 'C', text: 'Switzerland' },
      { id: 'D', text: 'Belgium' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'sharp_2',
    question: 'Petra, the ancient city carved into rock, is located in which country?',
    options: [
      { id: 'A', text: 'Jordan' },
      { id: 'B', text: 'Oman' },
      { id: 'C', text: 'Egypt' },
      { id: 'D', text: 'Lebanon' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'sharp_3',
    question: 'Which European city is known as the “City of a Hundred Spires”?',
    options: [
      { id: 'A', text: 'Vienna' },
      { id: 'B', text: 'Prague' },
      { id: 'C', text: 'Kraków' },
      { id: 'D', text: 'Budapest' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'sharp_4',
    question: 'In which country would you find the ancient city of Bagan, famous for thousands of temples?',
    options: [
      { id: 'A', text: 'Cambodia' },
      { id: 'B', text: 'Thailand' },
      { id: 'C', text: 'Myanmar' },
      { id: 'D', text: 'Laos' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'sharp_5',
    question: 'Which desert town in Peru is famous as a natural oasis surrounded by sand dunes?',
    options: [
      { id: 'A', text: 'Arequipa' },
      { id: 'B', text: 'Cusco' },
      { id: 'C', text: 'Huacachina' },
      { id: 'D', text: 'Puno' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'sharp_6',
    question: 'Which country is home to the historic region of Transylvania?',
    options: [
      { id: 'A', text: 'Romania' },
      { id: 'B', text: 'Bulgaria' },
      { id: 'C', text: 'Serbia' },
      { id: 'D', text: 'Slovakia' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'sharp_7',
    question: 'What is the traditional Japanese inn called?',
    options: [
      { id: 'A', text: 'Hanok' },
      { id: 'B', text: 'Ryokan' },
      { id: 'C', text: 'Riad' },
      { id: 'D', text: 'Chalet' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'sharp_8',
    question: 'Which island is famous for its white-and-blue cliffside villages of Oia and Fira?',
    options: [
      { id: 'A', text: 'Crete' },
      { id: 'B', text: 'Corfu' },
      { id: 'C', text: 'Santorini' },
      { id: 'D', text: 'Rhodes' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'sharp_9',
    question: 'Which African city is famous for its blue-painted medina?',
    options: [
      { id: 'A', text: 'Fez' },
      { id: 'B', text: 'Tunis' },
      { id: 'C', text: 'Chefchaouen' },
      { id: 'D', text: 'Marrakesh' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'sharp_10',
    question: 'The giant sandstone pillars of Wulingyuan inspired scenery in which film?',
    options: [
      { id: 'A', text: 'Dune' },
      { id: 'B', text: 'Avatar' },
      { id: 'C', text: 'The Lord of the Rings' },
      { id: 'D', text: 'Moana' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'sharp_11',
    question: 'Which country is known for the medieval town of Kotor on the Adriatic coast?',
    options: [
      { id: 'A', text: 'Croatia' },
      { id: 'B', text: 'Montenegro' },
      { id: 'C', text: 'Albania' },
      { id: 'D', text: 'Slovenia' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'sharp_12',
    question: 'What is a riad traditionally associated with?',
    options: [
      { id: 'A', text: 'A mountain cabin in Austria' },
      { id: 'B', text: 'A desert road in Jordan' },
      { id: 'C', text: 'A traditional house with an inner courtyard in Morocco' },
      { id: 'D', text: 'A temple garden in Japan' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'sharp_13',
    question: 'Which country is home to Lake Bled?',
    options: [
      { id: 'A', text: 'Slovenia' },
      { id: 'B', text: 'Slovakia' },
      { id: 'C', text: 'Croatia' },
      { id: 'D', text: 'Austria' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'sharp_14',
    question: 'The Faroe Islands belong to which kingdom?',
    options: [
      { id: 'A', text: 'Norway' },
      { id: 'B', text: 'Iceland' },
      { id: 'C', text: 'Denmark' },
      { id: 'D', text: 'Sweden' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'sharp_15',
    question: 'Which place is famous for its cave dwellings and fairy chimneys?',
    options: [
      { id: 'A', text: 'Cappadocia' },
      { id: 'B', text: 'Meteora' },
      { id: 'C', text: 'Sintra' },
      { id: 'D', text: 'Andorra' },
    ],
    correctOptionId: 'A',
  },
];