import type { ArtworkItem } from "@/lib/data";

/**
 * Generate a large collection of artworks for performance testing
 * Extends the base artworks with procedurally generated variations
 */
export function generateArtworks(baseArtworks: ArtworkItem[], targetCount: number = 120): ArtworkItem[] {
  if (baseArtworks.length >= targetCount) {
    return baseArtworks;
  }

  const animals = ["Border Collie", "Shiba Inu", "Cat", "Golden Retriever", "Pomeranian", "Chihuahua", "Corgi", "French Bulldog", "Husky", "German Shepherd", "Beagle", "Pug", "Dachshund", "Australian Shepherd", "Samoyed", "Akita", "Labrador", "Rottweiler", "Doberman", "Great Dane"];

  const styles = ["Renaissance", "Pixar 3D", "Needle Felt", "Pixel Art", "Ink Wash", "Chinese Classical", "Vinyl Toy", "Baroque", "Impressionist", "Ghibli", "Pop Art", "Watercolor", "Art Nouveau", "Ukiyo-e", "Fantasy", "Hyperrealism", "Cyberpunk", "Surrealist", "Art Deco", "Dark Fantasy", "Minimalist"];

  const titleTemplates = [
    (animal: string) => `${animal} in Repose`,
    (animal: string) => `Portrait of ${animal}`,
    (animal: string) => `${animal} Contemplating`,
    (animal: string) => `Noble ${animal}`,
    (animal: string) => `${animal} at Rest`,
    (animal: string) => `Majestic ${animal}`,
    (animal: string) => `${animal} in Profile`,
    (animal: string) => `The Great ${animal}`,
    (animal: string) => `${animal} Dreaming`,
    (animal: string) => `${animal} Portrait Study`,
    (animal: string) => `${animal} in the Garden`,
    (animal: string) => `${animal} by the Window`,
    (animal: string) => `${animal} at Sunset`,
    (animal: string) => `${animal} in Spring`,
    (animal: string) => `Regal ${animal}`,
  ];

  const generated: ArtworkItem[] = [...baseArtworks];
  let id = baseArtworks.length + 1;

  while (generated.length < targetCount) {
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

    // Use a base artwork's image for variety (cycling through base images)
    const baseIndex = (id - baseArtworks.length - 1) % baseArtworks.length;
    const baseArtwork = baseArtworks[baseIndex];

    generated.push({
      id,
      title: titleTemplate(animal),
      animal,
      style,
      imageUrl: baseArtwork.imageUrl,
      width: baseArtwork.width,
      height: baseArtwork.height,
      blurDataURL: baseArtwork.blurDataURL,
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      reviewCount: Math.floor(50 + Math.random() * 150),
    });

    id++;
  }

  return generated;
}
