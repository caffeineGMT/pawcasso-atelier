export interface Testimonial {
  id: string;
  name: string;
  petName: string;
  photo: string;
  rating: 5;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah K.",
    petName: "Duke",
    photo: "/gallery/golden_retriever_portrait_square.webp",
    rating: 5,
    quote:
      "I commissioned a Renaissance portrait of our rescue lab, Duke. When the file arrived, my wife cried. It's now the centerpiece of our living room.",
  },
  {
    id: "2",
    name: "James L.",
    petName: "Miso",
    photo: "/gallery/cat_vermeer.webp",
    rating: 5,
    quote:
      "We lost our tabby, Miso, last spring. Having her immortalized in an Impressionist style feels like she's still sitting in that sunbeam.",
  },
  {
    id: "3",
    name: "Priya M.",
    petName: "Baguette",
    photo: "/gallery/chihuahua_portrait_square_2048.jpg",
    rating: 5,
    quote:
      "I ordered a Baroque portrait of my French Bulldog, Baguette, as a joke gift. It was so stunning we had it printed on canvas the same day.",
  },
  {
    id: "4",
    name: "Mei T.",
    petName: "Shadow",
    photo: "/gallery/shiba_inu_felt_portrait_2048x2048.webp",
    rating: 5,
    quote:
      "The Ukiyo-e style for our black cat, Shadow, is my favorite. It looks like an authentic woodblock print from the Edo period.",
  },
  {
    id: "5",
    name: "Alex R.",
    petName: "Alfie",
    photo: "/gallery/alfie_border_collie_portrait_2048x2048.webp",
    rating: 5,
    quote:
      "Our Border Collie Alfie has never looked more regal. The oil painting style captured his intelligence and energy perfectly. Worth every penny!",
  },
  {
    id: "6",
    name: "Emma D.",
    petName: "Coco",
    photo: "/gallery/white_pomeranian_portrait_final.webp",
    rating: 5,
    quote:
      "I was skeptical about AI art, but this blew my mind. The attention to detail on Coco's fluffy fur is incredible. Feels hand-painted.",
  },
  {
    id: "7",
    name: "Marcus W.",
    petName: "Hiro",
    photo: "/gallery/shiba_portrait_final_2048x2048.webp",
    rating: 5,
    quote:
      "Got this as a gift for my girlfriend. She absolutely loved the Ghibli-style portrait of Hiro. The turnaround was super fast too.",
  },
  {
    id: "8",
    name: "Lisa Chen",
    petName: "Mochi",
    photo: "/gallery/pomeranian_portrait_final.webp",
    rating: 5,
    quote:
      "The Pop Art style for Mochi turned out amazing! It's vibrant, fun, and captures her personality. Already ordered two more for friends.",
  },
];
