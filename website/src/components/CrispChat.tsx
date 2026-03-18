"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface CrispChatProps {
  websiteId: string;
  enableConversionTriggers?: boolean;
}

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export default function CrispChat({
  websiteId,
  enableConversionTriggers = false
}: CrispChatProps) {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stylePromptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownIdlePrompt = useRef(false);
  const hasShownStylePrompt = useRef(false);

  useEffect(() => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    // Wait for Crisp to load
    const checkCrispLoaded = setInterval(() => {
      if (window.$crisp && Array.isArray(window.$crisp)) {
        clearInterval(checkCrispLoaded);
        initializeCrisp();
      }
    }, 100);

    return () => {
      clearInterval(checkCrispLoaded);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (stylePromptTimerRef.current) clearTimeout(stylePromptTimerRef.current);
    };
  }, [websiteId]);

  const initializeCrisp = () => {
    if (!window.$crisp) return;

    // Set custom data for segmentation
    window.$crisp.push(["set", "session:data", [[
      ["page", "order"],
      ["intent", "high_conversion"],
      ["source", "order_page"]
    ]]]);

    // Hide the default chat box initially (we'll show it with triggers)
    window.$crisp.push(["do", "chat:hide"]);

    // Set up conversion triggers if enabled
    if (enableConversionTriggers) {
      setupConversionTriggers();
    }

    // Listen for chat events
    window.$crisp.push(["on", "chat:opened", () => {
      // Track engagement when user opens chat
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag('event', 'chat_opened', {
          event_category: 'engagement',
          event_label: 'order_page_chat'
        });
      }
      // Clear timers if user opens chat manually
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (stylePromptTimerRef.current) clearTimeout(stylePromptTimerRef.current);
    }]);

    // Auto-responder for common questions
    setupAutoResponders();
  };

  const setupConversionTriggers = () => {
    // Trigger 1: Welcome message after 3 seconds (gentle intro)
    setTimeout(() => {
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:show"]);
        window.$crisp.push(["do", "message:show", [
          "text",
          "👋 Need help? I can answer questions about styles, delivery, or pricing!"
        ]]);
      }
    }, 3000);

    // Trigger 2: Style preference prompt after 60 seconds
    stylePromptTimerRef.current = setTimeout(() => {
      if (!hasShownStylePrompt.current && window.$crisp) {
        hasShownStylePrompt.current = true;
        window.$crisp.push(["do", "message:show", [
          "text",
          "Quick question - what style are you leaning toward? I can show you similar examples! 🎨"
        ]]);

        // Track this trigger
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag('event', 'chat_trigger_style', {
            event_category: 'conversion',
            event_label: '60s_style_prompt'
          });
        }
      }
    }, 60000); // 60 seconds

    // Trigger 3: Cart abandonment prevention after 90 seconds of inactivity
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        if (!hasShownIdlePrompt.current && window.$crisp) {
          hasShownIdlePrompt.current = true;
          window.$crisp.push(["do", "message:show", [
            "text",
            "Need help deciding? I can recommend the best style for your pet! 🐾"
          ]]);

          // Track abandonment trigger
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag('event', 'chat_trigger_abandonment', {
              event_category: 'conversion',
              event_label: '90s_idle_prompt'
            });
          }
        }
      }, 90000); // 90 seconds
    };

    // Reset idle timer on any user activity
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Start the idle timer
    resetIdleTimer();
  };

  const setupAutoResponders = () => {
    // Listen for user messages
    if (window.$crisp) {
      window.$crisp.push(["on", "message:received", (message: any) => {
        if (!message || message.from !== "user") return;

        const text = message.content?.toLowerCase() || "";

        // FAQ Auto-responses
        if (text.includes("delivery") || text.includes("how long") || text.includes("when")) {
          setTimeout(() => {
            window.$crisp.push(["do", "message:send", [
              "text",
              "⚡ Your portrait will be delivered within 24 hours! We also offer instant delivery with our Premium package."
            ]]);
          }, 800);
        }
        else if (text.includes("price") || text.includes("cost") || text.includes("how much")) {
          setTimeout(() => {
            window.$crisp.push(["do", "message:send", [
              "text",
              "💰 We have 4 packages:\n• Basic: $9 (24hr delivery, 1 portrait)\n• Standard: $19 (6hr delivery, 3 portraits + extras)\n• Premium: $49 (instant delivery, 5 portraits + all extras)\n• Professional: $79 (instant delivery, 10 portraits + commercial license)"
            ]]);
          }, 800);
        }
        else if (text.includes("style") || text.includes("which style") || text.includes("recommend")) {
          setTimeout(() => {
            window.$crisp.push(["do", "message:send", [
              "text",
              "🎨 Popular styles:\n• Renaissance (elegant, classic) - like the Mona Lisa!\n• Pixar 3D (cute, animated)\n• Needle Felt (cozy, handmade look)\n• Ghibli (whimsical, dreamy)\n\nWhat kind of vibe are you going for?"
            ]]);
          }, 800);
        }
        else if (text.includes("refund") || text.includes("guarantee") || text.includes("satisfied")) {
          setTimeout(() => {
            window.$crisp.push(["do", "message:send", [
              "text",
              "✅ 100% satisfaction guaranteed! If you're not happy with your portrait, we'll redo it or give you a full refund - no questions asked."
            ]]);
          }, 800);
        }
        else if (text.includes("photo") || text.includes("picture") || text.includes("quality")) {
          setTimeout(() => {
            window.$crisp.push(["do", "message:send", [
              "text",
              "📸 Any clear photo works! Phone photos are perfect. Just make sure:\n• Your pet's face is visible\n• Good lighting (no dark shadows)\n• JPG, PNG, or WebP format (max 10MB)"
            ]]);
          }, 800);
        }
        else if (text.includes("gift") || text.includes("someone else")) {
          setTimeout(() => {
            window.$crisp.push(["do", "message:send", [
              "text",
              "🎁 Perfect gift idea! After checkout, you'll get a high-res download link that you can:\n• Print yourself\n• Send digitally\n• Frame and gift\n\nWe also have a 10% off referral code you can share!"
            ]]);
          }, 800);
        }
      }]);
    }
  };

  return (
    <>
      <Script
        id="crisp-chat"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="${websiteId}";
            (function(){
              var d=document;
              var s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `
        }}
      />
    </>
  );
}
