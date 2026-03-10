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
  { id: 1, title: "Sovereign Light", animal: "Lion", style: "Baroque", imageUrl: "/gallery/lion_portrait.png", width: 2048, height: 2048 },
  { id: 2, title: "Cat with a Pearl Earring", animal: "Cat", style: "Renaissance", imageUrl: "/gallery/cat_vermeer.png", width: 2048, height: 2048 },
  { id: 3, title: "The Ramen Master", animal: "Hamster", style: "Ghibli", imageUrl: "/gallery/hamster_ramen.png", width: 2048, height: 2048 },
  { id: 4, title: "The Scholar's Gaze", animal: "Dog", style: "Renaissance", imageUrl: "/gallery/border_collie_renaissance.png", width: 2048, height: 2048 },
  { id: 5, title: "The Keeper of Pages", animal: "Owl", style: "Art Nouveau", imageUrl: "/gallery/owl_art_nouveau.png", width: 2048, height: 2048 },
  { id: 6, title: "Winter's Warmth", animal: "Fox", style: "Impressionist", imageUrl: "/gallery/fox_impressionist.png", width: 2048, height: 2048 },
  { id: 7, title: "Velvet & Vanity", animal: "Cat", style: "Baroque", imageUrl: "/gallery/persian_cat_baroque.png", width: 2048, height: 2048 },
  { id: 8, title: "The Short King", animal: "Dog", style: "Fantasy", imageUrl: "/gallery/corgi_throne.png", width: 2048, height: 2048 },
  { id: 9, title: "Black Tie Affair", animal: "Penguin", style: "Hyperrealism", imageUrl: "/gallery/penguin_gala.png", width: 2048, height: 2048 },
  { id: 10, title: "Chapter & Verse", animal: "Red Panda", style: "Ghibli", imageUrl: "/gallery/red_panda_bookshop.png", width: 2048, height: 2048 },
  { id: 11, title: "Song of the Mountain", animal: "Wolf", style: "Ukiyo-e", imageUrl: "/gallery/wolf_ukiyoe.png", width: 2048, height: 2048 },
];

export const styles = ["All", "Renaissance", "Baroque", "Impressionist", "Ghibli", "Pop Art", "Watercolor", "Art Nouveau", "Ukiyo-e", "Fantasy", "Hyperrealism"];
export const animals = ["All", "Cat", "Dog", "Lion", "Hamster", "Bird", "Owl", "Fox", "Penguin", "Red Panda", "Wolf"];

export const artStyleOptions = [
  { value: "renaissance", label: "Renaissance", description: "Classical portraiture with rich, warm tones" },
  { value: "baroque", label: "Baroque", description: "Dramatic lighting and ornate details" },
  { value: "impressionist", label: "Impressionist", description: "Soft, dreamy brushwork with vibrant colors" },
  { value: "ghibli", label: "Ghibli", description: "Whimsical, hand-painted fantasy illustration" },
  { value: "pop-art", label: "Pop Art", description: "Bold, colorful, and graphic style" },
  { value: "watercolor", label: "Watercolor", description: "Delicate, translucent washes of color" },
  { value: "art-nouveau", label: "Art Nouveau", description: "Flowing organic lines and decorative elegance" },
  { value: "ukiyo-e", label: "Ukiyo-e", description: "Traditional Japanese woodblock print aesthetic" },
];
