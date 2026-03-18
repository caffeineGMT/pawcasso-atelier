#!/bin/bash

# Pawcasso Content Engine CLI
# Manage viral content creation, tracking, and optimization

set -e

CONTENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CALENDAR_FILE="$CONTENT_DIR/calendar-30day.json"
TRACKER_FILE="$CONTENT_DIR/engagement-tracker.json"
AD_SPEND_FILE="$CONTENT_DIR/ad-spend-tracker.json"
GALLERY_DIR="$CONTENT_DIR/../website/public/gallery"
METADATA_DIR="$GALLERY_DIR/metadata"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${MAGENTA}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC}  ${CYAN}🎨 Pawcasso Content Engine${NC}                       ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚══════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Command: show today's content
cmd_today() {
    print_header
    echo ""

    TODAY=$(date +%Y-%m-%d)
    print_info "Today's date: ${CYAN}$TODAY${NC}"
    echo ""

    # Extract today's posts from calendar using jq if available
    if command -v jq &> /dev/null; then
        POSTS=$(jq -r --arg date "$TODAY" '.days[] | select(.date == $date) | .posts[]' "$CALENDAR_FILE" 2>/dev/null || echo "")

        if [ -z "$POSTS" ]; then
            print_warning "No scheduled posts for today"
        else
            echo -e "${GREEN}📅 SCHEDULED POSTS FOR TODAY:${NC}"
            echo ""
            jq -r --arg date "$TODAY" '
                .days[] | select(.date == $date) |
                "Day \(.day) - Theme: \(.theme)\n" +
                (.posts[] |
                    "  \(.slot | ascii_upcase) (\(.time)):\n" +
                    "    Hook: \(.hook)\n" +
                    "    Image: \(.image_file)\n" +
                    "    CTA: \(.cta)\n" +
                    "    Expected: \(.expected_virality)\n"
                )
            ' "$CALENDAR_FILE"
        fi
    else
        print_error "jq not installed. Install with: brew install jq"
    fi
}

# Command: list all images
cmd_images() {
    print_header
    echo ""
    echo -e "${GREEN}🖼️  AVAILABLE GALLERY IMAGES:${NC}"
    echo ""

    if [ -d "$GALLERY_DIR" ]; then
        ls -1 "$GALLERY_DIR"/*.{webp,jpg,png} 2>/dev/null | while read -r img; do
            filename=$(basename "$img")

            # Try to get metadata if it exists
            meta_file="$METADATA_DIR/${filename%.*}.json"
            if [ -f "$meta_file" ] && command -v jq &> /dev/null; then
                title=$(jq -r '.title // "Untitled"' "$meta_file")
                animal=$(jq -r '.animal // "Unknown"' "$meta_file")
                style=$(jq -r '.style // "Unknown"' "$meta_file")
                echo -e "  ${CYAN}$filename${NC}"
                echo -e "    Title: $title | Animal: $animal | Style: $style"
            else
                echo -e "  ${CYAN}$filename${NC}"
            fi
        done
    else
        print_error "Gallery directory not found: $GALLERY_DIR"
    fi
}

# Command: generate video batch list
cmd_batch() {
    print_header
    echo ""
    echo -e "${GREEN}🎬 VIDEO BATCH GENERATION PLAN:${NC}"
    echo ""

    print_info "Target: 50 videos"
    print_info "Templates: 6 types (CapCut)"
    print_info "Sources: 14 gallery images + 36 user submissions"
    echo ""

    echo -e "${YELLOW}BATCH BREAKDOWN:${NC}"
    echo "  - Template 1 (Before/After Split): 15 videos"
    echo "  - Template 2 (Zoom Reveal): 10 videos"
    echo "  - Template 3 (Fast Montage): 8 videos"
    echo "  - Template 4 (Museum Wall): 7 videos"
    echo "  - Template 5 (Game Boy): 5 videos"
    echo "  - Template 6 (Reaction Style): 5 videos"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. Collect 36 user-submitted pet photos (Instagram DMs, form)"
    echo "  2. Open CapCut desktop app"
    echo "  3. Create custom templates with placeholders"
    echo "  4. Batch replace images and export"
    echo "  5. Add trending audio from TikTok Creative Center"
    echo ""
    print_success "Estimated time: 4-6 hours for 50 videos"
}

# Command: track engagement
cmd_track() {
    print_header
    echo ""

    if [ -z "$1" ]; then
        print_error "Usage: ./cli.sh track <post_id> <views> <likes> <comments> <shares> <saves>"
        exit 1
    fi

    POST_ID="$1"
    VIEWS="${2:-0}"
    LIKES="${3:-0}"
    COMMENTS="${4:-0}"
    SHARES="${5:-0}"
    SAVES="${6:-0}"

    ENGAGEMENT_RATE=$(echo "scale=2; ($LIKES + $COMMENTS + $SHARES + $SAVES) / $VIEWS * 100" | bc)

    echo -e "${GREEN}📊 ENGAGEMENT LOGGED:${NC}"
    echo "  Post ID: ${CYAN}$POST_ID${NC}"
    echo "  Views: $VIEWS"
    echo "  Likes: $LIKES"
    echo "  Comments: $COMMENTS"
    echo "  Shares: $SHARES"
    echo "  Saves: $SAVES"
    echo "  Engagement Rate: ${YELLOW}${ENGAGEMENT_RATE}%${NC}"
    echo ""

    # Determine performance category
    if [ "$VIEWS" -ge 100000 ]; then
        echo -e "${MAGENTA}🚀 VIRAL! Boost with \$100/day${NC}"
    elif [ "$VIEWS" -ge 50000 ]; then
        echo -e "${GREEN}📈 HIGH PERFORMANCE! Boost with \$50/day${NC}"
    elif [ "$VIEWS" -ge 10000 ]; then
        echo -e "${CYAN}✓ Medium performance. Monitor for 48h.${NC}"
    elif [ "$VIEWS" -ge 5000 ]; then
        echo -e "${YELLOW}→ Baseline. Keep posting organic.${NC}"
    else
        echo -e "${RED}⚠ Underperforming. Analyze and adjust.${NC}"
    fi
}

# Command: ad spend report
cmd_adspend() {
    print_header
    echo ""
    echo -e "${GREEN}💰 AD SPEND SUMMARY:${NC}"
    echo ""

    if command -v jq &> /dev/null; then
        echo "Total Budget: $(jq -r '.total_budget' "$AD_SPEND_FILE")"
        echo "Spent: \$$(jq -r '.campaign_totals.total_spent' "$AD_SPEND_FILE")"
        echo "Revenue: \$$(jq -r '.campaign_totals.total_revenue' "$AD_SPEND_FILE")"
        echo "ROAS: $(jq -r '.campaign_totals.total_roas' "$AD_SPEND_FILE")"
        echo "Customers Acquired: $(jq -r '.campaign_totals.total_customers_acquired' "$AD_SPEND_FILE")"
        echo "Avg CPA: \$$(jq -r '.campaign_totals.avg_cpa' "$AD_SPEND_FILE")"
    else
        print_error "jq not installed. Install with: brew install jq"
    fi
}

# Command: hooks library
cmd_hooks() {
    print_header
    echo ""
    echo -e "${GREEN}🎣 VIRAL HOOKS LIBRARY:${NC}"
    echo ""

    if command -v jq &> /dev/null; then
        jq -r '.viral_hooks_library[]' "$CALENDAR_FILE" | nl
    else
        print_error "jq not installed. Install with: brew install jq"
    fi
}

# Command: trending audio check
cmd_audio() {
    print_header
    echo ""
    echo -e "${GREEN}🎵 TRENDING AUDIO SOURCES:${NC}"
    echo ""
    echo "1. TikTok Creative Center:"
    echo "   https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en"
    echo ""
    echo "2. Instagram Reels Trends:"
    echo "   Check Reels tab → Audio trending section daily"
    echo ""
    echo "3. Epidemic Sound (licensed):"
    echo "   https://www.epidemicsound.com"
    echo ""
    print_info "Spend 15 min/day scrolling For You Page, save sounds you hear 3+ times"
}

# Command: help
cmd_help() {
    print_header
    echo ""
    echo -e "${CYAN}AVAILABLE COMMANDS:${NC}"
    echo ""
    echo "  ${YELLOW}today${NC}      - Show today's scheduled posts"
    echo "  ${YELLOW}images${NC}     - List all available gallery images"
    echo "  ${YELLOW}batch${NC}      - Show video batch generation plan"
    echo "  ${YELLOW}track${NC}      - Log engagement metrics for a post"
    echo "               Usage: ./cli.sh track <post_id> <views> <likes> <comments> <shares> <saves>"
    echo "  ${YELLOW}adspend${NC}    - Show ad spend summary"
    echo "  ${YELLOW}hooks${NC}      - List viral hook templates"
    echo "  ${YELLOW}audio${NC}      - Show trending audio sources"
    echo "  ${YELLOW}help${NC}       - Show this help message"
    echo ""
    echo -e "${CYAN}EXAMPLES:${NC}"
    echo "  ./cli.sh today"
    echo "  ./cli.sh track 20260319_morning 15000 1200 85 340 520"
    echo "  ./cli.sh hooks"
    echo ""
}

# Main command router
case "$1" in
    today)
        cmd_today
        ;;
    images)
        cmd_images
        ;;
    batch)
        cmd_batch
        ;;
    track)
        shift
        cmd_track "$@"
        ;;
    adspend)
        cmd_adspend
        ;;
    hooks)
        cmd_hooks
        ;;
    audio)
        cmd_audio
        ;;
    help|--help|-h|"")
        cmd_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        cmd_help
        exit 1
        ;;
esac
