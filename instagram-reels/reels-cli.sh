#!/bin/bash

# Pawcasso Instagram Reels CLI
# Manage 30-day Reels campaign: content, scheduling, analytics, engagement

set -e

REELS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CALENDAR_FILE="$REELS_DIR/reels-calendar-30day.json"
BATCH_FILE="$REELS_DIR/batch-output.json"
ANALYTICS_FILE="$REELS_DIR/analytics-data.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${MAGENTA}+----------------------------------------------------------+${NC}"
    echo -e "${MAGENTA}|${NC}  ${CYAN}Pawcasso Instagram Reels - 30 Day Campaign${NC}             ${MAGENTA}|${NC}"
    echo -e "${MAGENTA}|${NC}  ${BLUE}@pawcasso.atelier | 11 AM PT Daily${NC}                    ${MAGENTA}|${NC}"
    echo -e "${MAGENTA}+----------------------------------------------------------+${NC}"
}

# Show today's Reel
cmd_today() {
    print_header
    echo ""
    TODAY=$(date +%Y-%m-%d)
    echo -e "${BLUE}Today: $TODAY${NC}"
    echo ""

    if command -v jq &> /dev/null; then
        REEL=$(jq -r --arg date "$TODAY" '.days[] | select(.date == $date)' "$CALENDAR_FILE" 2>/dev/null || echo "")

        if [ -z "$REEL" ] || [ "$REEL" = "null" ]; then
            echo -e "${YELLOW}No Reel scheduled for today${NC}"
            echo ""
            echo "Next scheduled Reel:"
            jq -r --arg date "$TODAY" '
                .days[] | select(.date > $date) |
                "  Day \(.day) (\(.date)): \(.post.hook)"
            ' "$CALENDAR_FILE" | head -1
        else
            echo -e "${GREEN}TODAY'S REEL:${NC}"
            echo ""
            jq -r --arg date "$TODAY" '
                .days[] | select(.date == $date) |
                "  Day \(.day) - \(.title)\n" +
                "  Theme: \(.theme)\n" +
                "  Hook: \(.post.hook)\n" +
                "  Image: \(.post.image_file)\n" +
                "  Video Style: \(.post.video_style)\n" +
                "  Duration: \(.post.duration)\n" +
                "  CTA: \(.post.cta)\n" +
                "  Audio: \(.post.trending_audio)\n" +
                "  Engagement: \(.post.engagement_prompt)"
            ' "$CALENDAR_FILE"
            echo ""
            echo -e "${CYAN}CAPTION (copy-paste ready):${NC}"
            echo ""
            jq -r --arg date "$TODAY" '
                .days[] | select(.date == $date) |
                .post.caption + "\n\n" + .post.engagement_prompt + "\n\n.\n.\n.\n\n" + (.post.hashtags | join(" "))
            ' "$CALENDAR_FILE"
        fi
    else
        echo -e "${RED}jq required. Install: brew install jq${NC}"
    fi
}

# Show full 30-day calendar
cmd_calendar() {
    print_header
    echo ""
    echo -e "${GREEN}30-DAY REELS CALENDAR${NC}"
    echo ""
    echo -e "DAY | DATE       | THEME              | HOOK"
    echo "----|------------|--------------------|-----------------------------------------"

    if command -v jq &> /dev/null; then
        jq -r '.days[] |
            "\(if .day < 10 then " \(.day)" else "\(.day)" end)  | \(.date) | \(.theme | .[0:18] | . + " " * (18 - length)) | \(.post.hook | .[0:50])"
        ' "$CALENDAR_FILE"
    fi
    echo ""
    echo -e "${BLUE}Theme Distribution:${NC}"
    if command -v jq &> /dev/null; then
        jq -r '[.days[].theme] | group_by(.) | map("\(.[0]): \(length) reels") | .[]' "$CALENDAR_FILE" | while read line; do
            echo "  $line"
        done
    fi
}

# Generate batch content
cmd_generate() {
    print_header
    echo ""
    echo -e "${GREEN}Generating batch Reels content...${NC}"
    echo ""

    cd "$REELS_DIR/.."
    if command -v npx &> /dev/null; then
        npx tsx "$REELS_DIR/batch-reels-generator.ts"
    else
        echo -e "${YELLOW}npx not found. Run manually:${NC}"
        echo "  cd $REELS_DIR/.."
        echo "  npx tsx instagram-reels/batch-reels-generator.ts"
    fi
}

# Log engagement metrics
cmd_log() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: ./reels-cli.sh log <views> <likes> <comments> <shares> <saves> [followers] [orders] [revenue]${NC}"
        echo ""
        echo "Example: ./reels-cli.sh log 15000 1200 85 340 520 150 3 27"
        exit 1
    fi

    cd "$REELS_DIR/.."
    npx tsx "$REELS_DIR/reels-analytics.ts" log "$@"
}

# Show analytics dashboard
cmd_dashboard() {
    print_header
    echo ""
    cd "$REELS_DIR/.."
    npx tsx "$REELS_DIR/reels-analytics.ts" dashboard
}

# Test engagement bot
cmd_engage() {
    print_header
    echo ""
    cd "$REELS_DIR/.."

    if [ -z "$1" ]; then
        npx tsx "$REELS_DIR/engagement-bot.ts" demo
    else
        npx tsx "$REELS_DIR/engagement-bot.ts" categorize "$1"
    fi
}

# Generate hashtags report
cmd_hashtags() {
    print_header
    echo ""

    if [ -z "$1" ]; then
        echo -e "${GREEN}HASHTAG OVERVIEW${NC}"
        echo ""
        echo "Each Reel gets 30 strategic hashtags across 4 tiers:"
        echo ""
        echo -e "  ${CYAN}Primary (10):${NC}   High-volume, broad reach"
        echo -e "  ${CYAN}Niche (10):${NC}     Medium-volume, targeted"
        echo -e "  ${CYAN}Branded (5):${NC}    Community building"
        echo -e "  ${CYAN}Trending (5):${NC}   Current trends"
        echo ""
        echo "Run with day number for specific hashtags:"
        echo "  ./reels-cli.sh hashtags 1"
    else
        DAY=$1
        if command -v jq &> /dev/null; then
            echo -e "${GREEN}Hashtags for Day $DAY:${NC}"
            echo ""
            jq -r --argjson day "$DAY" '
                .days[] | select(.day == $day) |
                "Theme: \(.theme)\nHook: \(.post.hook)\n\nHashtags (\(.post.hashtags | length)):\n\(.post.hashtags | join(" "))"
            ' "$CALENDAR_FILE"
        fi
    fi
}

# Show posting schedule
cmd_schedule() {
    print_header
    echo ""
    echo -e "${GREEN}POSTING SCHEDULE${NC}"
    echo ""
    echo -e "Time: ${CYAN}11:00 AM PT daily${NC} (optimal engagement window)"
    echo -e "Account: ${CYAN}@pawcasso.atelier${NC}"
    echo ""

    if command -v jq &> /dev/null; then
        echo "Upcoming Reels:"
        TODAY=$(date +%Y-%m-%d)
        jq -r --arg date "$TODAY" '
            .days[] | select(.date >= $date) |
            "  \(.date) (Day \(.day)): \(.post.hook | .[0:55])"
        ' "$CALENDAR_FILE" | head -7
    fi
    echo ""
    echo -e "${YELLOW}Posting Checklist:${NC}"
    echo "  1. Review content via GitHub Issue (auto-created at 10 AM PT)"
    echo "  2. Copy caption from review page"
    echo "  3. Create Reel in Instagram app using gallery image"
    echo "  4. Add trending audio (check Reels audio tab)"
    echo "  5. Paste caption + hashtags"
    echo "  6. Post at 11:00 AM PT"
    echo "  7. Engage with comments for 1 hour after posting"
}

# Weekly report
cmd_report() {
    print_header
    echo ""
    WEEK=${1:-1}
    cd "$REELS_DIR/.."
    npx tsx "$REELS_DIR/reels-analytics.ts" report "$WEEK"
}

cmd_help() {
    print_header
    echo ""
    echo -e "${CYAN}COMMANDS:${NC}"
    echo ""
    echo -e "  ${YELLOW}today${NC}          Show today's Reel (caption, hashtags, everything)"
    echo -e "  ${YELLOW}calendar${NC}       View full 30-day content calendar"
    echo -e "  ${YELLOW}schedule${NC}       View posting schedule and checklist"
    echo -e "  ${YELLOW}generate${NC}       Generate batch content via n8n pipeline"
    echo -e "  ${YELLOW}hashtags${NC} [day] Show hashtag strategy (or specific day)"
    echo -e "  ${YELLOW}log${NC} <metrics>  Log engagement: views likes comments shares saves [followers] [orders] [revenue]"
    echo -e "  ${YELLOW}dashboard${NC}      Show analytics dashboard (follower growth, revenue)"
    echo -e "  ${YELLOW}report${NC} [week]  Generate weekly performance report"
    echo -e "  ${YELLOW}engage${NC} [text]  Test engagement bot (demo or specific comment)"
    echo -e "  ${YELLOW}help${NC}           Show this help"
    echo ""
    echo -e "${CYAN}EXAMPLES:${NC}"
    echo "  ./reels-cli.sh today"
    echo "  ./reels-cli.sh log 15000 1200 85 340 520 150 3 27"
    echo "  ./reels-cli.sh hashtags 5"
    echo "  ./reels-cli.sh engage 'I want one for my corgi!'"
    echo "  ./reels-cli.sh report 1"
    echo ""
    echo -e "${CYAN}GOALS:${NC}"
    echo "  5,000 followers in 90 days"
    echo "  5% conversion rate (250 customers)"
    echo "  1 Reel/day at 11 AM PT"
    echo "  30 hashtags per post"
    echo "  Engage with comments within 1 hour"
    echo ""
}

case "$1" in
    today)      cmd_today ;;
    calendar)   cmd_calendar ;;
    schedule)   cmd_schedule ;;
    generate)   cmd_generate ;;
    hashtags)   shift; cmd_hashtags "$@" ;;
    log)        shift; cmd_log "$@" ;;
    dashboard)  cmd_dashboard ;;
    report)     shift; cmd_report "$@" ;;
    engage)     shift; cmd_engage "$@" ;;
    help|--help|-h|"")
        cmd_help ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        cmd_help
        exit 1 ;;
esac
