export interface ArtworkItem {
  id: number;
  title: string;
  animal: string;
  style: string;
  imageUrl: string;
  width: number;
  height: number;
}

export const artworks: ArtworkItem[] = [
  { id: 1, title: "Cat with a Pearl Earring", animal: "Cat", style: "Renaissance", imageUrl: "/gallery/cat_vermeer.png", width: 2048, height: 2048 },
  { id: 2, title: "Felt Family Portrait", animal: "Border Collie", style: "Needle Felt", imageUrl: "/gallery/border_collie_portrait_2048x2048.png", width: 1676, height: 1584 },
  { id: 3, title: "Boxing Match", animal: "Border Collie", style: "Ink Wash", imageUrl: "/gallery/alfie_border_collie_portrait_2048x2048.png", width: 2048, height: 2048 },
  { id: 4, title: "Imperial Portrait", animal: "Border Collie", style: "Chinese Classical", imageUrl: "/gallery/alfie_imperial_portrait_2048x2048.png", width: 2048, height: 2048 },
  { id: 5, title: "Big Eyes", animal: "Border Collie", style: "Pixar 3D", imageUrl: "/gallery/alfie_portrait_final.png", width: 2048, height: 2048 },
  { id: 6, title: "Perler Bead Pup", animal: "Chihuahua", style: "Pixel Art", imageUrl: "/gallery/chihuahua_portrait_16x9.png", width: 2753, height: 1538 },
  { id: 7, title: "Grumpy But Cute", animal: "Chihuahua", style: "Pixar 3D", imageUrl: "/gallery/chihuahua_portrait_square_2048.jpg", width: 2048, height: 2048 },
  { id: 8, title: "Happy Chonk", animal: "Golden Retriever", style: "Pixar 3D", imageUrl: "/gallery/golden_retriever_portrait_square.png", width: 2051, height: 2051 },
  { id: 9, title: "Cloud Puff", animal: "Pomeranian", style: "Needle Felt", imageUrl: "/gallery/pomeranian_portrait_final.png", width: 2048, height: 2048 },
  { id: 10, title: "Felted Friend", animal: "Shiba Inu", style: "Needle Felt", imageUrl: "/gallery/shiba_inu_felt_portrait_2048x2048.png", width: 2048, height: 2048 },
  { id: 11, title: "Arms Crossed", animal: "Shiba Inu", style: "Vinyl Toy", imageUrl: "/gallery/shiba_inu_vinyl_toy_portrait_final.png", width: 2049, height: 2049 },
  { id: 12, title: "Round Boi", animal: "Shiba Inu", style: "Pixar 3D", imageUrl: "/gallery/shiba_portrait_final_2048x2048.png", width: 2048, height: 2048 },
  { id: 13, title: "Good Boy", animal: "Shiba Inu", style: "Needle Felt", imageUrl: "/gallery/shiba_portrait_final.png", width: 2048, height: 2048 },
  { id: 14, title: "Snowball", animal: "Pomeranian", style: "Pixar 3D", imageUrl: "/gallery/white_pomeranian_portrait_final.png", width: 2049, height: 2049 },
];

export const styles = ["All", "Renaissance", "Pixar 3D", "Needle Felt", "Pixel Art", "Ink Wash", "Chinese Classical", "Vinyl Toy", "Baroque", "Impressionist", "Ghibli", "Pop Art", "Watercolor", "Art Nouveau", "Ukiyo-e", "Fantasy", "Hyperrealism", "Cyberpunk", "Surrealist", "Art Deco", "Dark Fantasy", "Minimalist"];
export const animals = ["All", "Border Collie", "Shiba Inu", "Chihuahua", "Golden Retriever", "Pomeranian", "Cat", "Dog", "Lion", "Hamster", "Bird", "Owl", "Fox", "Penguin", "Red Panda", "Wolf", "Corgi", "Hedgehog", "Otter", "Fish", "Ram", "Rabbit", "Bull", "Elephant", "Dragon", "Raccoon", "Toucan"];

export const artStyleOptions = [
  { value: "renaissance", label: "Renaissance", description: "Classical portraiture with rich, warm tones" },
  { value: "baroque", label: "Baroque", description: "Dramatic lighting and ornate details" },
  { value: "impressionist", label: "Impressionist", description: "Soft, dreamy brushwork with vibrant colors" },
  { value: "ghibli", label: "Ghibli", description: "Whimsical, hand-painted fantasy illustration" },
  { value: "pop-art", label: "Pop Art", description: "Bold, colorful, and graphic style" },
  { value: "watercolor", label: "Watercolor", description: "Delicate, translucent washes of color" },
  { value: "art-nouveau", label: "Art Nouveau", description: "Flowing organic lines and decorative elegance" },
  { value: "ukiyo-e", label: "Ukiyo-e", description: "Traditional Japanese woodblock print aesthetic" },
  { value: "cyberpunk", label: "Cyberpunk Neon", description: "Futuristic neon-lit sci-fi atmosphere" },
  { value: "pixel-art", label: "Pixel Art", description: "Retro 8-bit and 16-bit game aesthetic" },
  { value: "surrealist", label: "Surrealist", description: "Dreamlike, Dali-inspired impossible scenes" },
  { value: "dark-fantasy", label: "Dark Fantasy", description: "Gothic, moody, and mythically dramatic" },
  { value: "minimalist", label: "Minimalist Line Art", description: "Clean, elegant single-line drawings" },
  { value: "pixar-3d", label: "Pixar 3D Chunky", description: "Round, fluffy, adorably grumpy 3D characters" },
  { value: "needle-felt", label: "Needle Felt", description: "Cozy wool-textured stop-motion style" },
  { value: "hyperrealism", label: "Hyperrealism", description: "Photorealistic detail and precision" },
  { value: "art-deco", label: "Art Deco", description: "Glamorous 1920s geometric elegance" },
];
