
import { Healer } from './types';

export const MOCK_HEALERS: Healer[] = [
  {
    id: 'h1',
    name: 'Dr. Seraphina Moon',
    specialty: 'Intuitive Energy Healing',
    bio: 'Guiding souls to find their inner light through ancient energy practices.',
    fullBio: 'With over 15 years of experience in the healing arts, Dr. Seraphina Moon combines her background in clinical psychology with ancient Reiki and chakra balancing techniques. Her sessions are a sanctuary for those seeking clarity, emotional release, and a renewed sense of purpose. She believes that every soul has a unique frequency, and her goal is to help you tune yours to its highest potential.',
    rating: 4.9,
    reviewsCount: 1240,
    pricePerMinute: 2.50,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    gallery: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400'
    ],
    introVideo: 'https://assets.mixkit.co/videos/preview/mixkit-woman-meditating-in-the-forest-30043-large.mp4',
    categories: ['Reiki', 'Chakra Balancing', 'Meditation'],
    location: 'United Kingdom',
    languages: ['English', 'French']
  },
  {
    id: 'h2',
    name: 'Master Kenji',
    specialty: 'Zen Mindfulness Coach',
    bio: '30 years of experience in monastic training. Specializing in anxiety relief.',
    fullBio: 'Master Kenji spent three decades in the mountain monasteries of Kyoto before deciding to bring his wisdom to the global community. His teaching focuses on the "Way of the Breath"—a powerful method to anchor the wandering mind. Whether you are facing high-pressure career challenges or deep personal grief, Kenji provides a grounded, compassionate space for stillness.',
    rating: 4.8,
    reviewsCount: 856,
    pricePerMinute: 1.80,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    gallery: [
      'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1545205597-3d9d02c17592?auto=format&fit=crop&q=80&w=400'
    ],
    introVideo: 'https://assets.mixkit.co/videos/preview/mixkit-man-sitting-on-a-rock-meditating-in-the-mountains-32766-large.mp4',
    categories: ['Zen', 'Breathwork', 'Counseling'],
    location: 'Japan',
    languages: ['Japanese', 'English']
  },
  {
    id: 'h3',
    name: 'Elena Vance',
    specialty: 'Astrology & Tarot Guide',
    bio: 'Unlocking the mysteries of the stars to help you navigate life transitions.',
    fullBio: 'Elena is a third-generation intuitive who reads the cosmic map to find your hidden paths. Her approach to Astrology is not just about prediction, but about empowerment. By understanding the planetary cycles at play in your life, you can make informed decisions about love, career, and personal growth. She uses her bespoke Tarot decks to provide immediate, actionable insights.',
    rating: 5.0,
    reviewsCount: 310,
    pricePerMinute: 3.00,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    gallery: [
      'https://images.unsplash.com/photo-1568910129154-1909a320579b?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=400'
    ],
    categories: ['Astrology', 'Tarot', 'Life Coaching'],
    location: 'Brazil',
    languages: ['Portuguese', 'Spanish', 'English']
  }
];

export const CATEGORIES = [
  'All', 'Reiki', 'Meditation', 'Zen', 'Astrology', 'Sound Therapy', 'Yoga', 'Psychology'
];

export const GLOBAL_STATS = {
  activeSessions: 142,
  countriesOnline: 48,
  healersAvailable: 1205
};
