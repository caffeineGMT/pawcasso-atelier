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
];

export const styles = ["All", "Renaissance", "Baroque", "Impressionist", "Ghibli", "Pop Art", "Watercolor"];
export const animals = ["All", "Cat", "Dog", "Lion", "Hamster", "Bird", "Owl"];

export const artStyleOptions = [
  { value: "renaissance", label: "Renaissance", description: "Classical portraiture with rich, warm tones" },
  { value: "oil-painting", label: "Oil Painting", description: "Traditional oil painting with bold brushstrokes" },
  { value: "baroque", label: "Baroque", description: "Dramatic lighting and ornate details" },
  { value: "impressionist", label: "Impressionist", description: "Soft, dreamy brushwork with vibrant colors" },
  { value: "pop-art", label: "Pop Art", description: "Bold, colorful, and graphic style" },
  { value: "watercolor", label: "Watercolor", description: "Delicate, translucent washes of color" },
];
