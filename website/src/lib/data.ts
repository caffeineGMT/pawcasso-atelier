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
  { id: 1, title: "Noble Hound", animal: "Dog", style: "Renaissance", imageUrl: "https://picsum.photos/seed/dog1/600/800", width: 600, height: 800 },
  { id: 2, title: "Regal Feline", animal: "Cat", style: "Oil Painting", imageUrl: "https://picsum.photos/seed/cat1/600/750", width: 600, height: 750 },
  { id: 3, title: "The Golden Retriever", animal: "Dog", style: "Baroque", imageUrl: "https://picsum.photos/seed/dog2/600/700", width: 600, height: 700 },
  { id: 4, title: "Midnight Whiskers", animal: "Cat", style: "Impressionist", imageUrl: "https://picsum.photos/seed/cat2/600/800", width: 600, height: 800 },
  { id: 5, title: "Parrot Royale", animal: "Bird", style: "Renaissance", imageUrl: "https://picsum.photos/seed/bird1/600/750", width: 600, height: 750 },
  { id: 6, title: "Bunny Aristocrat", animal: "Rabbit", style: "Oil Painting", imageUrl: "https://picsum.photos/seed/rabbit1/600/800", width: 600, height: 800 },
  { id: 7, title: "Sir Barksalot", animal: "Dog", style: "Baroque", imageUrl: "https://picsum.photos/seed/dog3/600/700", width: 600, height: 700 },
  { id: 8, title: "Duchess Meow", animal: "Cat", style: "Renaissance", imageUrl: "https://picsum.photos/seed/cat3/600/800", width: 600, height: 800 },
  { id: 9, title: "Equine Elegance", animal: "Horse", style: "Impressionist", imageUrl: "https://picsum.photos/seed/horse1/600/750", width: 600, height: 750 },
  { id: 10, title: "The Beagle Baron", animal: "Dog", style: "Oil Painting", imageUrl: "https://picsum.photos/seed/dog4/600/800", width: 600, height: 800 },
  { id: 11, title: "Tabby in Twilight", animal: "Cat", style: "Impressionist", imageUrl: "https://picsum.photos/seed/cat4/600/700", width: 600, height: 700 },
  { id: 12, title: "Cockatoo Court", animal: "Bird", style: "Baroque", imageUrl: "https://picsum.photos/seed/bird2/600/800", width: 600, height: 800 },
];

export const styles = ["All", "Renaissance", "Oil Painting", "Baroque", "Impressionist"];
export const animals = ["All", "Dog", "Cat", "Bird", "Rabbit", "Horse"];

export const artStyleOptions = [
  { value: "renaissance", label: "Renaissance", description: "Classical portraiture with rich, warm tones" },
  { value: "oil-painting", label: "Oil Painting", description: "Traditional oil painting with bold brushstrokes" },
  { value: "baroque", label: "Baroque", description: "Dramatic lighting and ornate details" },
  { value: "impressionist", label: "Impressionist", description: "Soft, dreamy brushwork with vibrant colors" },
  { value: "pop-art", label: "Pop Art", description: "Bold, colorful, and graphic style" },
  { value: "watercolor", label: "Watercolor", description: "Delicate, translucent washes of color" },
];
