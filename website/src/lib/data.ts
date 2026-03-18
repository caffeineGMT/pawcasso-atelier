export interface ArtworkItem {
  id: number;
  title: string;
  animal: string;
  style: string;
  imageUrl: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export const artworks: ArtworkItem[] = [
  { id: 1, title: "Cat with a Pearl Earring", animal: "Cat", style: "Renaissance", imageUrl: "/gallery/cat_vermeer.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoKAAoABUB8JYwC7ADbZ1kkAAD+7QkpkVuT3lgmTaNWj+2IydCqzydCvrypV9HFE3h8QbgAAAA=" },
  { id: 2, title: "Felt Family Portrait", animal: "Border Collie", style: "Needle Felt", imageUrl: "/gallery/border_collie_portrait_2048x2048.webp", width: 1676, height: 1584, blurDataURL: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoKAAkABUB8JYwC7AD8J1QcxCAA9ysGwsVNmj8okquEpfWz4xg81dvfStr1O3XWXj+YiMj6QkAAAA==" },
  { id: 3, title: "Boxing Match", animal: "Border Collie", style: "Ink Wash", imageUrl: "/gallery/alfie_border_collie_portrait_2048x2048.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoKAAoABUB8JQBdgBuHs2MVQAD+8d4RBjKtfJf0kXN66YfemiA6ECZugkQ8vHIPsYtCJDQ9HDoV/cCI9I0EAA==" },
  { id: 4, title: "Imperial Portrait", animal: "Border Collie", style: "Chinese Classical", imageUrl: "/gallery/alfie_imperial_portrait_2048x2048.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoKAAoABUB8JagCdADdlhAo4QAA/dI+LjzdTboE5IJ8fh7nBsxc1udLhR9K4wmO6ib9qZUAAAA=" },
  { id: 5, title: "Big Eyes", animal: "Border Collie", style: "Pixar 3D", imageUrl: "/gallery/alfie_portrait_final.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoKAAoABUB8JYwC7AELXa/4NlAA+yLqtt/qE81h/gVP2sZ4qcwWUTEZRLViiIaCSpw30fq8lhMK2AiGKCYGAy29BvMAl6AA" },
  { id: 6, title: "Perler Bead Pup", animal: "Chihuahua", style: "Pixel Art", imageUrl: "/gallery/chihuahua_portrait_16x9.webp", width: 2753, height: 1538, blurDataURL: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSBkAAAABH9D/iAgoaNuG6RvEqvzJDENE/2M9Ac96AFZQOCAuAAAAkAEAnQEqCgAGAAVAfCWkAALHpVQAAP7rgQZYhcK0UmSjJ77mO0WEJULupsAAAA==" },
  { id: 7, title: "Grumpy But Cute", animal: "Chihuahua", style: "Pixar 3D", imageUrl: "/gallery/chihuahua_portrait_square_2048.jpg", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoKAAoABUB8JaQAAxYUE2QsQAD89yeZDlciwwN9PdujiDa1huHrQI4TWTwtlj+2CxGNRbAAAAA=" },
  { id: 8, title: "Happy Chonk", animal: "Golden Retriever", style: "Pixar 3D", imageUrl: "/gallery/golden_retriever_portrait_square.webp", width: 2051, height: 2051, blurDataURL: "data:image/webp;base64,UklGRnwAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSB0AAAABL3D//4iICQbStilTMC9lCu7f2BVE9D+mXoD+AQBWUDggOAAAAPABAJ0BKgoACgAFQHwlkAJ0AQtdr3uQAAD+6JIaI87CxSO1kr4CNHd3CIOdKMwio8gpBgcT1kAA" },
  { id: 9, title: "Cloud Puff", animal: "Pomeranian", style: "Needle Felt", imageUrl: "/gallery/pomeranian_portrait_final.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRnIAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSBgAAAABH9D/iAgoaNuG6YVYjT+bQYjof9wq4A9WUDggNAAAAPABAJ0BKgoACgAFQHwljAJ0ALyEPbVHgAD8+2qRaIqmoy1LboTmtgGpI3faruvXPyAAAAA=" },
  { id: 10, title: "Felted Friend", animal: "Shiba Inu", style: "Needle Felt", imageUrl: "/gallery/shiba_inu_felt_portrait_2048x2048.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoKAAoABUB8JbACdABUCwAAXsPV9/YwkKTWtnPiXjdxPbOf1StpuyAA" },
  { id: 11, title: "Arms Crossed", animal: "Shiba Inu", style: "Vinyl Toy", imageUrl: "/gallery/shiba_inu_vinyl_toy_portrait_final.webp", width: 2049, height: 2049, blurDataURL: "data:image/webp;base64,UklGRoIAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSB8AAAABF6AQQADE37nRiIgYoaBtG6YXYscfziBE9D9uJfAHAFZQOCA8AAAA8AEAnQEqCgAKAAVAfCWQAnQBDw/9OUAAAP7rhXL5kybxcgsRwse4ZpYtulDOIRn7JaD6a2j//vFPVEQA" },
  { id: 12, title: "Round Boi", animal: "Shiba Inu", style: "Pixar 3D", imageUrl: "/gallery/shiba_portrait_final_2048x2048.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoKAAoABUB8JZACdAELZR12okwAAP7h4S2z+4VmbaxUoW7lVZBaidzinsHU4/vQeH/7WpOcYLngAA==" },
  { id: 13, title: "Good Boy", animal: "Shiba Inu", style: "Needle Felt", imageUrl: "/gallery/shiba_portrait_final.webp", width: 2048, height: 2048, blurDataURL: "data:image/webp;base64,UklGRngAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSBkAAAABF3D//4iIQUHbNkwvxI4/nEGI6H/cSuAPAFZQOCA4AAAA0AEAnQEqCgAKAAVAfCWYAnQA3JXQl4AA/pjwhV5rWVxEK9p0IUrjEGyFeynUilUvEko7YeZiQAA=" },
  { id: 14, title: "Snowball", animal: "Pomeranian", style: "Pixar 3D", imageUrl: "/gallery/white_pomeranian_portrait_final.webp", width: 2049, height: 2049, blurDataURL: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSBgAAAABJ9D/iAgQZNvsKssJ7k94goj+R9UF4AdWUDggLAAAADABAJ0BKgoACgAFQHwlpAADcAD+7TYRtG61iywXmaYHBhbE06bMMOhCDQAA" },
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
