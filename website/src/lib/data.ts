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
  { id: 2, title: "Felt Family Portrait", animal: "Border Collie", style: "Needle Felt", imageUrl: "/gallery/border_collie_portrait_2048x2048.png", width: 2048, height: 2048 },
];

export const styles = ["All", "Renaissance", "Baroque", "Impressionist", "Ghibli", "Pop Art", "Watercolor", "Art Nouveau", "Ukiyo-e", "Fantasy", "Hyperrealism", "Cyberpunk", "Pixel Art", "Surrealist", "Pixar 3D", "Needle Felt", "Art Deco", "Dark Fantasy", "Minimalist"];
export const animals = ["All", "Cat", "Dog", "Lion", "Hamster", "Bird", "Owl", "Fox", "Penguin", "Red Panda", "Wolf", "Corgi", "Hedgehog", "Otter", "Fish", "Ram", "Rabbit", "Bull", "Elephant", "Dragon", "Raccoon", "Toucan"];

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
