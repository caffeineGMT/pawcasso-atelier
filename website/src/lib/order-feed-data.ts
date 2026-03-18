export interface OrderFeedEntry {
  name: string; // First name + city
  pet: string; // Pet breed/type
  tier: 'Basic' | 'Premium' | 'Deluxe' | 'Instant';
  timeAgo: string;
  avatar: string; // Gallery image path
}

export const orderFeedData: OrderFeedEntry[] = [
  { name: 'Sarah from Seattle', pet: 'Golden Retriever', tier: 'Premium', timeAgo: '3 minutes ago', avatar: '/gallery/golden_retriever_portrait_square.webp' },
  { name: 'Michael from Vancouver', pet: 'Border Collie', tier: 'Deluxe', timeAgo: '8 minutes ago', avatar: '/gallery/border_collie_portrait_2048x2048.webp' },
  { name: 'Emma from Austin', pet: 'Shiba Inu', tier: 'Basic', timeAgo: '12 minutes ago', avatar: '/gallery/shiba_portrait_final_2048x2048.webp' },
  { name: 'David from Portland', pet: 'Pomeranian', tier: 'Premium', timeAgo: '18 minutes ago', avatar: '/gallery/pomeranian_portrait_final.webp' },
  { name: 'Jessica from Denver', pet: 'Chihuahua', tier: 'Instant', timeAgo: '25 minutes ago', avatar: '/gallery/chihuahua_portrait_16x9.webp' },
  { name: 'Ryan from Boston', pet: 'Cat', tier: 'Deluxe', timeAgo: '32 minutes ago', avatar: '/gallery/cat_vermeer.webp' },
  { name: 'Olivia from Miami', pet: 'Border Collie', tier: 'Premium', timeAgo: '39 minutes ago', avatar: '/gallery/alfie_border_collie_portrait_2048x2048.webp' },
  { name: 'James from Chicago', pet: 'Golden Retriever', tier: 'Basic', timeAgo: '45 minutes ago', avatar: '/gallery/golden_retriever_portrait_square.webp' },
  { name: 'Sophia from San Francisco', pet: 'Pomeranian', tier: 'Deluxe', timeAgo: '52 minutes ago', avatar: '/gallery/white_pomeranian_portrait_final.webp' },
  { name: 'Daniel from New York', pet: 'Shiba Inu', tier: 'Premium', timeAgo: '1 hour ago', avatar: '/gallery/shiba_inu_felt_portrait_2048x2048.webp' },
  { name: 'Isabella from Los Angeles', pet: 'Border Collie', tier: 'Instant', timeAgo: '1 hour ago', avatar: '/gallery/alfie_imperial_portrait_2048x2048.webp' },
  { name: 'Matthew from Dallas', pet: 'Chihuahua', tier: 'Basic', timeAgo: '1 hour ago', avatar: '/gallery/chihuahua_portrait_square_2048.jpg' },
  { name: 'Ava from Phoenix', pet: 'Golden Retriever', tier: 'Premium', timeAgo: '2 hours ago', avatar: '/gallery/golden_retriever_portrait_square.webp' },
  { name: 'Christopher from Houston', pet: 'Shiba Inu', tier: 'Deluxe', timeAgo: '2 hours ago', avatar: '/gallery/shiba_inu_vinyl_toy_portrait_final.webp' },
  { name: 'Mia from Philadelphia', pet: 'Pomeranian', tier: 'Basic', timeAgo: '2 hours ago', avatar: '/gallery/pomeranian_portrait_final.webp' },
  { name: 'Andrew from San Diego', pet: 'Cat', tier: 'Premium', timeAgo: '3 hours ago', avatar: '/gallery/cat_vermeer.webp' },
  { name: 'Emily from San Jose', pet: 'Border Collie', tier: 'Instant', timeAgo: '3 hours ago', avatar: '/gallery/border_collie_portrait_2048x2048.webp' },
  { name: 'Joshua from Indianapolis', pet: 'Golden Retriever', tier: 'Deluxe', timeAgo: '3 hours ago', avatar: '/gallery/golden_retriever_portrait_square.webp' },
  { name: 'Charlotte from Columbus', pet: 'Shiba Inu', tier: 'Basic', timeAgo: '4 hours ago', avatar: '/gallery/shiba_portrait_final.webp' },
  { name: 'Anthony from Fort Worth', pet: 'Pomeranian', tier: 'Premium', timeAgo: '4 hours ago', avatar: '/gallery/white_pomeranian_portrait_final.webp' },
  { name: 'Amelia from Charlotte', pet: 'Chihuahua', tier: 'Deluxe', timeAgo: '4 hours ago', avatar: '/gallery/chihuahua_portrait_16x9.webp' },
  { name: 'Kevin from Detroit', pet: 'Border Collie', tier: 'Basic', timeAgo: '5 hours ago', avatar: '/gallery/alfie_portrait_final.webp' },
  { name: 'Harper from El Paso', pet: 'Cat', tier: 'Premium', timeAgo: '5 hours ago', avatar: '/gallery/cat_vermeer.webp' },
  { name: 'Brian from Memphis', pet: 'Golden Retriever', tier: 'Instant', timeAgo: '5 hours ago', avatar: '/gallery/golden_retriever_portrait_square.webp' },
  { name: 'Evelyn from Nashville', pet: 'Shiba Inu', tier: 'Deluxe', timeAgo: '6 hours ago', avatar: '/gallery/shiba_inu_felt_portrait_2048x2048.webp' },
  { name: 'Jason from Baltimore', pet: 'Pomeranian', tier: 'Basic', timeAgo: '6 hours ago', avatar: '/gallery/pomeranian_portrait_final.webp' },
  { name: 'Abigail from Oklahoma City', pet: 'Border Collie', tier: 'Premium', timeAgo: '6 hours ago', avatar: '/gallery/border_collie_portrait_2048x2048.webp' },
  { name: 'Tyler from Las Vegas', pet: 'Chihuahua', tier: 'Deluxe', timeAgo: '7 hours ago', avatar: '/gallery/chihuahua_portrait_square_2048.jpg' },
  { name: 'Elizabeth from Louisville', pet: 'Cat', tier: 'Basic', timeAgo: '7 hours ago', avatar: '/gallery/cat_vermeer.webp' },
  { name: 'Jacob from Milwaukee', pet: 'Golden Retriever', tier: 'Premium', timeAgo: '7 hours ago', avatar: '/gallery/golden_retriever_portrait_square.webp' },
  { name: 'Madison from Albuquerque', pet: 'Shiba Inu', tier: 'Instant', timeAgo: '8 hours ago', avatar: '/gallery/shiba_portrait_final_2048x2048.webp' },
  { name: 'Brandon from Tucson', pet: 'Pomeranian', tier: 'Deluxe', timeAgo: '8 hours ago', avatar: '/gallery/white_pomeranian_portrait_final.webp' },
  { name: 'Ella from Fresno', pet: 'Border Collie', tier: 'Basic', timeAgo: '9 hours ago', avatar: '/gallery/alfie_border_collie_portrait_2048x2048.webp' },
  { name: 'Nathan from Sacramento', pet: 'Chihuahua', tier: 'Premium', timeAgo: '9 hours ago', avatar: '/gallery/chihuahua_portrait_16x9.webp' },
  { name: 'Grace from Kansas City', pet: 'Cat', tier: 'Deluxe', timeAgo: '9 hours ago', avatar: '/gallery/cat_vermeer.webp' },
];
