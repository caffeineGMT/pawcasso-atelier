// Pawcasso Atelier — Content Concept Generator v3
// NEW: Style reference images from Pinterest/art databases for style matching
// Each style has curated reference URLs that Manus uses to match artistic style

const calendar = {
  pillars: [
    { id: 'old_masters', name: 'Old Masters, New Paws', type: 'image', prompts: [
      'Reimagine "{painting}" by {artist} but with a {animal} as the subject, wearing period-appropriate attire',
      'A {animal} posed exactly like the subject in "{painting}" by {artist}, authentic style with craquelure texture',
    ]},
    { id: 'cinema', name: 'Cinema Unleashed', type: 'image', prompts: [
      'A {animal} recreating the iconic {movie} movie poster, cinematic and dramatic',
      'Movie poster parody of {movie} starring a {animal}, full poster layout with title text',
    ]},
    { id: 'daily_portrait', name: 'The Daily Portrait', type: 'image', prompts: [
      'A stunning artistic portrait of a {animal} in {setting}, museum-quality fine art',
      'Majestic {animal} portrait with dramatic chiaroscuro lighting, rich warm tones',
    ]},
    { id: 'fantasy', name: 'What Breed Is This?', type: 'image', prompts: [
      'A mythical hybrid creature: half {animal}, half {creature2}, in a {setting}, fantasy illustration',
      'A {animal} with magical {feature} in a fantasy landscape, ethereal and dreamlike',
    ]},
    { id: 'historical', name: 'Pets Through Time', type: 'image', prompts: [
      'A {animal} dressed as a {historical_figure} in {era} era, historically accurate setting and costume',
      'A {animal} in {era} period clothing posing for a formal portrait, vintage atmosphere',
    ]},
    { id: 'tiny_worlds', name: 'Tiny Worlds', type: 'image', prompts: [
      'A {animal} running a tiny {shop_type} in a miniature world, incredible detail, warm lighting',
      'A {animal} in a whimsical diorama-like {scene}, tilt-shift miniature feel',
    ]},
    { id: 'emoji_moods', name: 'Mood Pack', type: 'image', prompts: [
      'Create a set of 9 expressive emoji-style illustrations of a {animal}, arranged in a 3x3 grid. Each emoji shows a different mood: happy, sleepy, surprised, guilty, love-eyes, grumpy, cool with sunglasses, crying, laughing. Style: cute but artistic, clean illustration with warm tones on dark background (#0a0a0a). Each emoji in a circle.',
      'Create a 3x3 grid of 9 adorable {animal} emoji faces showing different expressions: excited, bored, shocked, mischievous, dreamy, hangry, zen, confused, zoomies-mode. Artistic sticker style, warm palette on dark background (#0a0a0a).',
    ]},
    { id: 'zodiac', name: 'Zodiac Portraits', type: 'image', prompts: [
      'A majestic {zodiac_animal} representing the {zodiac_sign} zodiac sign, rendered in {style} style. The zodiac symbol subtly incorporated into the composition. Dark background (#0a0a0a), stunning artistic quality, square format.',
    ]},
    { id: 'animated', name: 'Living Portraits', type: 'video', prompts: [
      'Create a short animated video (5-10 seconds) of a {animal} in {animation_style} style: {animation_scene}. Seamless loop if possible. Square format.',
      'Animate a {animal} doing {animation_action} in {animation_style} style. Short clip, 5-10 seconds, charming and shareable. Square format.',
    ]},
    { id: 'grumpy_cuties', name: 'Grumpy Cuties', type: 'image', prompts: [
      'Create a grid of 12 cute, chunky 3D animated animals (4 columns x 3 rows) in Pixar/DreamWorks style. Each animal is different: {grumpy_animals}. Every character is round, fluffy, slightly chubby with arms crossed and a grumpy/sassy expression. Vivid saturated fur colors. Clean white/light gray studio background. Extremely detailed fur rendering, oversized expressive eyes, tiny feet, big round body. Each character in its own cell of the grid. Square format.',
      'Create a single adorable {animal} character in Pixar 3D style — chunky, fluffy, round body, arms crossed, grumpy expression, vivid fur color, clean white studio background. Think cute plush toy with attitude. Ultra-detailed 3D rendering. Square format.',
    ]},
    { id: 'felt_friends', name: 'Felt Friends', type: 'image', prompts: [
      'Create a heartwarming scene of a {animal} as a needle-felted wool puppet, similar to Aardman Animations style. The character has woolly textured fur with visible fibers, big round glossy eyes, and wears a tiny knitted {felt_accessory}. Background is {felt_bg_color} felt fabric texture. Warm soft lighting, cozy handmade aesthetic. Square format.',
      'Create a family portrait of 3 {animal}s as needle-felted wool puppets in stop-motion style (like Wallace & Gromit). Each has slightly different coloring and personality. One wears round glasses. Background is dusty blue felt texture. Big glossy eyes, woolly texture, incredibly charming. Square format.',
    ]},
  ],

  // ===== STYLE REFERENCE DATABASE =====
  // Curated reference images from Pinterest, Wikimedia, and art databases
  // Each style has reference URLs and a prompt modifier for Manus
  styleReferences: {
    'Renaissance Oil Painting': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meisje_met_de_parel.jpg/800px-Meisje_met_de_parel.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Raffael_058.jpg/800px-Raffael_058.jpg',
      ],
      guidance: 'Match the rich oil paint texture, dramatic chiaroscuro lighting, warm earth tones, and classical composition of Renaissance masters. Use visible brushstrokes, craquelure aging effects, and a dark vignette background. The subject should look like it was painted in the 15th-16th century.',
      searchQuery: 'Renaissance oil painting animal portrait classical art',
    },
    'Studio Ghibli / Anime': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/en/d/d5/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
        'https://upload.wikimedia.org/wikipedia/en/4/4b/Spirited_Away_poster.png',
      ],
      guidance: 'Match the soft watercolor-like palette, gentle linework, expressive eyes, and whimsical atmosphere of Studio Ghibli films. Use pastel backgrounds, delicate shading, and that signature warm, nostalgic feeling. Characters should have large expressive eyes and simplified but charming features.',
      searchQuery: 'Studio Ghibli animal art style cute anime',
    },
    'Cyberpunk Neon': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/en/9/9d/BladeRunner2049-poster.png',
      ],
      guidance: 'Use vivid neon colors (cyan, magenta, electric blue, hot pink) against dark urban backgrounds. Include glowing light effects, holographic elements, rain-slicked surfaces reflecting neon, and futuristic technology. The aesthetic should feel like Blade Runner meets Tokyo nightlife.',
      searchQuery: 'cyberpunk neon art animal portrait futuristic',
    },
    'Watercolor Botanical': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg',
      ],
      guidance: 'Use soft, translucent watercolor washes with visible paper texture bleeding through. Include delicate botanical elements (flowers, leaves, vines). Colors should be soft pastels with occasional rich accents. Maintain the loose, fluid quality of real watercolor with natural color bleeds and gradients.',
      searchQuery: 'watercolor botanical illustration animal art delicate',
    },
    'Pop Art (Warhol/Lichtenstein)': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Drowning_Girl.jpg/800px-Drowning_Girl.jpg',
      ],
      guidance: 'Use bold flat colors, thick black outlines, Ben-Day dots pattern, and high contrast. Channel Andy Warhol\'s repeated color variations or Roy Lichtenstein\'s comic-book style with speech bubbles and halftone dots. Colors should be primary and saturated (red, yellow, blue, black, white).',
      searchQuery: 'pop art animal portrait warhol lichtenstein style bold',
    },
    'Pixel Art / 8-Bit': {
      refs: [],
      guidance: 'Create in authentic pixel art style with visible individual pixels, limited color palette (16-32 colors), and clean pixel placement. Think SNES/Game Boy era sprites but high-resolution. Include subtle dithering for shading. No anti-aliasing — every pixel should be deliberate.',
      searchQuery: 'pixel art animal portrait 8-bit retro game style',
    },
    'Art Nouveau': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Alfons_Mucha_-_1896_-_Autumn.jpg/800px-Alfons_Mucha_-_1896_-_Autumn.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Alfons_Mucha_-_F._Champenois_Imprimeur-%C3%89diteur.jpg/800px-Alfons_Mucha_-_F._Champenois_Imprimeur-%C3%89diteur.jpg',
      ],
      guidance: 'Use flowing organic curves, ornamental borders with floral motifs, and the elegant poster style of Alphonse Mucha. Include decorative halos/arches behind the subject, muted but rich colors (gold, teal, burgundy, cream), and sinuous lines inspired by natural forms.',
      searchQuery: 'art nouveau mucha style animal illustration ornamental',
    },
    'Hyperrealism': {
      refs: [],
      guidance: 'Create photorealistic detail that looks like a high-resolution photograph but with subtle artistic enhancement. Every fur strand, whisker, and eye reflection should be meticulously rendered. Use dramatic studio lighting, shallow depth of field, and incredible textural detail that makes the viewer question if it\'s a photo.',
      searchQuery: 'hyperrealistic animal portrait painting photorealistic',
    },
    'Ukiyo-e (Japanese Woodblock)': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Hiroshige_-_Evening_Snow_at_Kanbara.jpg/800px-Hiroshige_-_Evening_Snow_at_Kanbara.jpg',
      ],
      guidance: 'Use flat areas of color with bold black outlines, limited muted palette typical of Edo-period prints. Include wave patterns, cherry blossoms, or Mount Fuji as background elements. The composition should feel like an authentic ukiyo-e woodblock print by Hokusai or Hiroshige.',
      searchQuery: 'ukiyo-e woodblock print animal art japanese traditional',
    },
    'Dark Fantasy / Gothic': {
      refs: [],
      guidance: 'Create a dark, atmospheric scene with deep shadows, muted colors pierced by dramatic highlights. Include gothic architectural elements (pointed arches, gargoyles, ravens). The mood should be mysterious and slightly ominous. Think dark castle, moonlit scene, thorny vines, ancient tomes.',
      searchQuery: 'dark fantasy gothic art animal portrait atmospheric',
    },
    'Impressionist': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Chicago.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Chicago.jpg',
      ],
      guidance: 'Use visible, energetic brushstrokes with thick impasto texture. Colors should be vibrant and applied in dabs rather than blended smooth. Capture the play of light on surfaces with broken color technique. Channel Monet\'s garden scenes or Renoir\'s warm portraits.',
      searchQuery: 'impressionist painting animal art monet renoir style',
    },
    'Baroque': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/800px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Peter_Paul_Rubens_-_The_Fall_of_Phaeton_%28National_Gallery_of_Art%29.jpg/800px-Peter_Paul_Rubens_-_The_Fall_of_Phaeton_%28National_Gallery_of_Art%29.jpg',
      ],
      guidance: 'Use dramatic tenebrism with deep blacks and brilliant highlights. Rich, luxurious textures (velvet, silk, gold, fur). Include opulent settings with columns, drapery, and ornate frames. Channel Rembrandt\'s portraits or Rubens\' dramatic compositions. Heavy use of gold, burgundy, and deep brown.',
      searchQuery: 'baroque painting animal portrait rembrandt caravaggio dramatic',
    },
    'Surrealist (Dali)': {
      refs: [
        'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg',
      ],
      guidance: 'Create dreamlike, impossible scenes with melting forms, impossible perspectives, and symbolic elements. Channel Salvador Dali\'s precision-painted impossible scenes or Magritte\'s philosophical puzzles. Include unexpected juxtapositions, floating objects, and hyper-detailed rendering of impossible scenarios.',
      searchQuery: 'surrealist art animal portrait dali magritte dreamlike',
    },
    'Minimalist Line Art': {
      refs: [],
      guidance: 'Use continuous single-line or minimal-line drawing style with clean, confident strokes on a simple background. The beauty is in what\'s left out. Use a limited palette (black on white, or one accent color). Think Picasso\'s one-line animal drawings or modern minimalist illustration.',
      searchQuery: 'minimalist line art animal drawing single line modern',
    },
    'Pixar 3D Chunky': {
      refs: [],
      guidance: 'Create a cute, chunky 3D animated character in Pixar/DreamWorks quality. The animal should be round, fluffy, and slightly chubby with exaggerated proportions. It should have a grumpy or sassy expression with arms crossed. Vivid, saturated fur colors. The character stands on a clean white/light gray studio background with soft shadows. Think Pixar character design meets plush toy — extremely detailed fur rendering, oversized expressive eyes, tiny feet, big round body. The overall feel should be adorable but with attitude.',
      searchQuery: 'cute grumpy 3D animals Pixar style fluffy chunky character design studio background',
    },
    'Needle Felt / Stop-Motion': {
      refs: [],
      guidance: 'Create an image that looks like a handmade needle-felted or wool stop-motion puppet, similar to Aardman Animations (Wallace & Gromit, Shaun the Sheep). The animal should have a woolly, textured surface with visible felt/yarn fibers. Big, round, glossy eyes (like plastic doll eyes). The background should be a solid-colored felt/fabric texture (dusty blue, sage green, or warm terracotta). The character may wear a tiny knitted sweater or accessory. The overall aesthetic should feel handmade, cozy, and charming — like a real craft project photographed with a macro lens. Warm, soft lighting with gentle shadows.',
      searchQuery: 'needle felted animal art wool stop motion puppet Aardman style handmade felt craft',
    },
  },

  styles: [
    'Renaissance Oil Painting', 'Studio Ghibli / Anime', 'Cyberpunk Neon',
    'Watercolor Botanical', 'Pop Art (Warhol/Lichtenstein)', 'Pixel Art / 8-Bit',
    'Art Nouveau', 'Hyperrealism', 'Ukiyo-e (Japanese Woodblock)', 'Dark Fantasy / Gothic',
    'Impressionist', 'Baroque', 'Surrealist (Dali)', 'Minimalist Line Art',
    'Pixar 3D Chunky', 'Needle Felt / Stop-Motion'
  ],
  animals: [
    'duck', 'cat', 'dog', 'owl', 'fox', 'lion', 'wolf', 'elephant',
    'hummingbird', 'pug', 'corgi', 'shiba inu', 'persian cat', 'parrot',
    'hamster', 'frog', 'mouse', 'hedgehog', 'snow leopard', 'turtle',
    'dalmatian', 'golden retriever', 'bulldog', 'barn owl', 'eagle',
    'penguin', 'flamingo', 'raccoon', 'red panda', 'otter',
    'border collie', 'husky', 'dachshund', 'siamese cat', 'rabbit'
  ],
  paintings: [
    { title: 'Girl with a Pearl Earring', artist: 'Vermeer' },
    { title: 'The Birth of Venus', artist: 'Botticelli' },
    { title: 'American Gothic', artist: 'Grant Wood' },
    { title: 'The Starry Night', artist: 'Van Gogh' },
    { title: 'Mona Lisa', artist: 'da Vinci' },
    { title: 'The Scream', artist: 'Munch' },
    { title: 'The Great Wave', artist: 'Hokusai' },
    { title: 'The Persistence of Memory', artist: 'Dali' },
    { title: 'Whistlers Mother', artist: 'Whistler' },
    { title: 'The Son of Man', artist: 'Magritte' },
    { title: 'Nighthawks', artist: 'Edward Hopper' },
    { title: 'A Sunday on La Grande Jatte', artist: 'Seurat' },
  ],
  movies: [
    'The Matrix', 'Jaws', 'Titanic', 'Scarface', 'Star Wars',
    'The Godfather', 'Jurassic Park', 'Pulp Fiction', 'Forrest Gump',
    'The Shining', 'E.T.', 'Back to the Future', 'Blade Runner',
    'Indiana Jones', 'The Wizard of Oz', 'Ghostbusters', 'Top Gun',
    'Harry Potter', 'Lord of the Rings', 'The Lion King'
  ],
  eras: [
    { era: 'Ancient Egyptian', figure: 'pharaoh' },
    { era: 'Medieval', figure: 'knight' },
    { era: 'Renaissance', figure: 'nobleman' },
    { era: 'Feudal Japanese', figure: 'samurai' },
    { era: '1920s Art Deco', figure: 'jazz singer' },
    { era: 'Victorian', figure: 'detective' },
    { era: '1960s Space Age', figure: 'astronaut' },
    { era: 'Ancient Roman', figure: 'senator' },
    { era: 'Roaring Twenties', figure: 'flapper' },
    { era: 'Wild West', figure: 'sheriff' },
  ],
  zodiac: [
    { sign: 'Aries', animal: 'ram', style: 'Renaissance Oil Painting', dates: '03-21 to 04-19' },
    { sign: 'Taurus', animal: 'bull', style: 'Baroque', dates: '04-20 to 05-20' },
    { sign: 'Gemini', animal: 'twin foxes', style: 'Pop Art', dates: '05-21 to 06-20' },
    { sign: 'Cancer', animal: 'crab', style: 'Studio Ghibli / Anime', dates: '06-21 to 07-22' },
    { sign: 'Leo', animal: 'lion', style: 'Art Nouveau', dates: '07-23 to 08-22' },
    { sign: 'Virgo', animal: 'white dove', style: 'Watercolor Botanical', dates: '08-23 to 09-22' },
    { sign: 'Libra', animal: 'twin swans', style: 'Impressionist', dates: '09-23 to 10-22' },
    { sign: 'Scorpio', animal: 'scorpion', style: 'Dark Fantasy / Gothic', dates: '10-23 to 11-21' },
    { sign: 'Sagittarius', animal: 'horse with archer symbolism', style: 'Hyperrealism', dates: '11-22 to 12-21' },
    { sign: 'Capricorn', animal: 'mountain goat', style: 'Ukiyo-e (Japanese Woodblock)', dates: '12-22 to 01-19' },
    { sign: 'Aquarius', animal: 'mystical seahorse', style: 'Cyberpunk Neon', dates: '01-20 to 02-18' },
    { sign: 'Pisces', animal: 'koi fish', style: 'Ukiyo-e (Japanese Woodblock)', dates: '02-19 to 03-20' },
  ],
  animation_styles: [
    'Pixar/Disney 3D', 'Studio Ghibli hand-drawn', 'watercolor animation',
    'stop-motion claymation', 'retro cartoon (Looney Tunes)', 'anime',
    'paper cut-out animation', 'oil painting come to life'
  ],
  animation_scenes: [
    'slowly blinking and looking around curiously',
    'knocking something off a table with a paw, looking smug',
    'chasing its own tail in circles',
    'falling asleep gradually, head drooping',
    'ears perking up hearing something offscreen',
    'shaking off water in slow motion',
    'trying to catch a butterfly',
  ],
  animation_actions: [
    'yawning dramatically', 'doing a happy dance', 'sneaking across a room',
    'being startled by a cucumber', 'stretching luxuriously', 'tilting head in confusion',
  ],
  shops: ['ramen shop', 'bakery', 'bookshop', 'flower shop', 'coffee cart', 'tailor', 'vinyl record store', 'potion shop', 'cheese shop'],
  scenes: ['mushroom forest library', 'treehouse village', 'cloud city', 'underwater coral palace', 'starlit rooftop garden', 'cozy train compartment', 'rainy window cafe'],
  features: ['butterfly wings', 'crystalline antlers', 'bioluminescent fur', 'flower crown that blooms', 'galaxy-patterned coat', 'phoenix tail feathers'],
  creatures: ['phoenix', 'dragon', 'unicorn', 'griffin', 'kirin', 'thunderbird'],
  settings: ['moonlit forest', 'golden hour savanna', 'misty mountain peak', 'rainy Tokyo street', 'cherry blossom garden', 'Venetian canal at sunset', 'Scottish highlands in mist', 'Moroccan marketplace'],
  grumpy_animal_sets: [
    'hamster, yak, tiger, rabbit, dragon, snake, hippo, sheep, gorilla, rooster, fox, pig',
    'corgi, cat, panda, owl, penguin, hedgehog, lion, frog, bear, parrot, raccoon, otter',
    'pug, elephant, wolf, flamingo, turtle, mouse, eagle, koala, bunny, duck, horse, deer',
  ],
  felt_accessories: ['sweater', 'scarf', 'bow tie', 'beret', 'tiny backpack', 'winter hat', 'cape', 'vest'],
  felt_bg_colors: ['dusty blue', 'sage green', 'warm terracotta', 'soft mauve', 'cream', 'muted coral'],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const dayOfWeek = new Date().getDay();

// Day-to-pillar mapping
// Sun=zodiac, Mon=portrait, Tue=grumpy_cuties, Wed=tiny_worlds, Thu=cinema, Fri=felt_friends, Sat=old_masters
const pillarMap = {
  0: 'zodiac',
  1: 'daily_portrait',
  2: 'grumpy_cuties',
  3: 'tiny_worlds',
  4: 'cinema',
  5: 'felt_friends',
  6: 'old_masters',
};

// 30% chance to override with a random pillar for variety
const pillarId = Math.random() < 0.3
  ? pick(calendar.pillars.map(p => p.id))
  : pillarMap[dayOfWeek];

const pillar = calendar.pillars.find(p => p.id === pillarId) || calendar.pillars[0];
const style = pick(calendar.styles);
const animal = pick(calendar.animals);

// Build the prompt
let promptTemplate = pick(pillar.prompts);
let prompt = promptTemplate;

// Handle zodiac-specific replacements
if (pillar.id === 'zodiac') {
  const zodiacEntry = pick(calendar.zodiac);
  prompt = prompt
    .replace('{zodiac_animal}', zodiacEntry.animal)
    .replace('{zodiac_sign}', zodiacEntry.sign)
    .replace('{style}', zodiacEntry.style);
} else if (pillar.id === 'animated') {
  prompt = prompt
    .replace('{animation_style}', pick(calendar.animation_styles))
    .replace('{animation_scene}', pick(calendar.animation_scenes))
    .replace('{animation_action}', pick(calendar.animation_actions));
}

// Standard replacements
const chosenPainting = pick(calendar.paintings);
const chosenEra = pick(calendar.eras);
prompt = prompt
  .replace('{animal}', animal)
  .replace('{painting}', chosenPainting.title)
  .replace('{artist}', chosenPainting.artist)
  .replace('{movie}', pick(calendar.movies))
  .replace('{era}', chosenEra.era)
  .replace('{historical_figure}', chosenEra.figure)
  .replace('{shop_type}', pick(calendar.shops))
  .replace('{scene}', pick(calendar.scenes))
  .replace('{feature}', pick(calendar.features))
  .replace('{creature2}', pick(calendar.creatures))
  .replace('{setting}', pick(calendar.settings))
  .replace('{grumpy_animals}', pick(calendar.grumpy_animal_sets))
  .replace('{felt_accessory}', pick(calendar.felt_accessories))
  .replace('{felt_bg_color}', pick(calendar.felt_bg_colors))
  .replace('{style}', style);

// ===== STYLE REFERENCE INTEGRATION =====
// Get the style reference data for the chosen style
const styleRef = calendar.styleReferences[style] || {};
const referenceUrls = styleRef.refs || [];
const styleGuidance = styleRef.guidance || `Create in ${style} style with high artistic quality.`;
const pinterestSearchQuery = styleRef.searchQuery || `${style} animal portrait art`;

// Pick a random reference image (if available)
const referenceImageUrl = referenceUrls.length > 0 ? pick(referenceUrls) : null;

const isVideo = pillar.type === 'video';
const formatNote = isVideo
  ? 'Create a short animated video (5-10 seconds, square format, seamless loop if possible).'
  : 'Square format (1:1 ratio, 2048x2048 or larger). Make it visually striking and shareable.';

// Build the Manus prompt WITH style reference
let fullPrompt;
if (isVideo) {
  fullPrompt = `Using Nano Banana, ${prompt}. ${formatNote} Save the video file.`;
} else if (referenceImageUrl) {
  // When we have a reference image, tell Manus to match its style
  fullPrompt = `Using Nano Banana image generation, create an artistic image.

STYLE REFERENCE: First, visit this reference image to understand the target artistic style: ${referenceImageUrl}
STYLE GUIDANCE: ${styleGuidance}

SUBJECT: ${prompt}

Create the image matching the artistic style, composition techniques, and color palette of the reference. The final image should look like it belongs in the same art collection as the reference.

${formatNote} Save the image and provide a direct download link.`;
} else {
  // Fallback: search Pinterest for reference, then generate
  fullPrompt = `Using Nano Banana image generation, create an artistic image.

STEP 1 - FIND STYLE REFERENCE: Search Pinterest for "${pinterestSearchQuery}" and study 2-3 top results to understand the ${style} artistic style, color palette, and composition techniques.

STEP 2 - CREATE IMAGE: Based on the style references you found, create: ${prompt}

STYLE GUIDANCE: ${styleGuidance}

The final image should authentically match the ${style} aesthetic, as if created by an artist working in that tradition.

${formatNote} Save the image and provide a direct download link.`;
}

const today = new Date().toISOString().split('T')[0];

return [{
  json: {
    date: today,
    pillar: pillar.name,
    pillar_id: pillar.id,
    content_type: pillar.type || 'image',
    style: style,
    animal: animal,
    concept: prompt,
    manus_prompt: fullPrompt,
    is_video: isVideo,
    reference_image_url: referenceImageUrl,
    pinterest_search_query: pinterestSearchQuery,
    style_guidance: styleGuidance,
    attempt: 1,
    max_attempts: 3
  }
}];
