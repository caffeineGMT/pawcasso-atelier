#!/bin/bash

##############################################################################
# Pawcasso Atelier - Carousel Image Generator
#
# This script crops and optimizes gallery images for Meta Ads carousel format
# Requires: ImageMagick (brew install imagemagick)
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
GALLERY_DIR="../../../website/public/gallery"
OUTPUT_DIR="./carousel_output"
GRID_OUTPUT_DIR="./grid_output"

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$GRID_OUTPUT_DIR"

echo -e "${GREEN}=== Pawcasso Carousel Image Generator ===${NC}\n"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Install with: brew install imagemagick"
    exit 1
fi

echo -e "${YELLOW}Step 1: Generating Carousel Images (1080x1080)${NC}\n"

# Carousel Ad 1: Style Showcase (6 images)
carousel_images=(
    "alfie_portrait_final.webp:Pixar_3D"
    "border_collie_portrait_2048x2048.webp:Needle_Felt"
    "cat_vermeer.webp:Renaissance"
    "chihuahua_portrait_16x9.webp:Pixel_Art"
    "shiba_inu_vinyl_toy_portrait_final.webp:Vinyl_Toy"
    "alfie_border_collie_portrait_2048x2048.webp:Ink_Wash"
)

counter=1
for item in "${carousel_images[@]}"; do
    IFS=':' read -r filename style <<< "$item"
    input_file="$GALLERY_DIR/$filename"
    output_file="$OUTPUT_DIR/carousel_card_${counter}_${style}_1080x1080.jpg"

    if [ -f "$input_file" ]; then
        echo "Processing Card $counter: $style"

        # Crop to square (center crop) and resize to 1080x1080
        convert "$input_file" \
            -resize 1080x1080^ \
            -gravity center \
            -extent 1080x1080 \
            -quality 90 \
            "$output_file"

        # Add text overlay: Style name + "$9"
        convert "$output_file" \
            -font Helvetica-Bold \
            -pointsize 60 \
            -fill white \
            -stroke black \
            -strokewidth 3 \
            -gravity south \
            -annotate +0+50 "${style//_/ } - \$9" \
            "$output_file"

        echo -e "${GREEN}✓ Created: $output_file${NC}"
    else
        echo -e "${RED}✗ File not found: $input_file${NC}"
    fi

    ((counter++))
done

echo -e "\n${YELLOW}Step 2: Generating 2x2 Style Grid${NC}\n"

# Create 2x2 grid for Static Ad 2
grid_images=(
    "$GALLERY_DIR/alfie_portrait_final.webp"
    "$GALLERY_DIR/cat_vermeer.webp"
    "$GALLERY_DIR/border_collie_portrait_2048x2048.webp"
    "$GALLERY_DIR/chihuahua_portrait_16x9.webp"
)

# First, crop all to 540x540 (half of 1080x1080)
for i in {0..3}; do
    temp_file="$GRID_OUTPUT_DIR/temp_$i.jpg"
    convert "${grid_images[$i]}" \
        -resize 540x540^ \
        -gravity center \
        -extent 540x540 \
        -quality 90 \
        "$temp_file"
done

# Combine into 2x2 grid
montage \
    "$GRID_OUTPUT_DIR/temp_0.jpg" \
    "$GRID_OUTPUT_DIR/temp_1.jpg" \
    "$GRID_OUTPUT_DIR/temp_2.jpg" \
    "$GRID_OUTPUT_DIR/temp_3.jpg" \
    -tile 2x2 \
    -geometry +0+0 \
    -background white \
    "$GRID_OUTPUT_DIR/static_grid_2x2_styles.jpg"

# Add text overlay
convert "$GRID_OUTPUT_DIR/static_grid_2x2_styles.jpg" \
    -font Helvetica-Bold \
    -pointsize 80 \
    -fill white \
    -stroke black \
    -strokewidth 4 \
    -gravity center \
    -annotate +0+0 "30+ Styles • \$9 Each" \
    "$GRID_OUTPUT_DIR/static_grid_2x2_styles_final.jpg"

echo -e "${GREEN}✓ Created: $GRID_OUTPUT_DIR/static_grid_2x2_styles_final.jpg${NC}"

# Clean up temp files
rm -f "$GRID_OUTPUT_DIR/temp_"*.jpg

echo -e "\n${YELLOW}Step 3: Optimizing Hero Static Ad${NC}\n"

# Copy hero image (cat_vermeer) as-is for Static Ad 1
if [ -f "$GALLERY_DIR/cat_vermeer.webp" ]; then
    convert "$GALLERY_DIR/cat_vermeer.webp" \
        -resize 1080x1080 \
        -quality 90 \
        "$OUTPUT_DIR/static_hero_cat_vermeer_1080x1080.jpg"
    echo -e "${GREEN}✓ Created: $OUTPUT_DIR/static_hero_cat_vermeer_1080x1080.jpg${NC}"
fi

echo -e "\n${GREEN}=== All Images Generated Successfully! ===${NC}\n"

echo "Output directories:"
echo "  - Carousel images: $OUTPUT_DIR/"
echo "  - Grid images: $GRID_OUTPUT_DIR/"
echo ""
echo "Next steps:"
echo "  1. Review all generated images"
echo "  2. Upload to Meta Ads Manager"
echo "  3. Create carousel ads using the numbered cards"
echo "  4. Use static_grid_2x2_styles_final.jpg for Static Ad 2"
echo "  5. Use static_hero_cat_vermeer_1080x1080.jpg for Static Ad 1"
echo ""
echo -e "${YELLOW}Note: For video slideshow, use a tool like Canva or CapCut to create the 15-second video.${NC}"
