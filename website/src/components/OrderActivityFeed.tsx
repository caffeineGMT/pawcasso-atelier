'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { orderFeedData, type OrderFeedEntry } from '@/lib/order-feed-data';

export default function OrderActivityFeed() {
  const [currentOrder, setCurrentOrder] = useState<OrderFeedEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;

    const showNextOrder = () => {
      if (isPaused) return;

      // Pick a random order from the data
      const randomIndex = Math.floor(Math.random() * orderFeedData.length);
      const order = orderFeedData[randomIndex];

      setCurrentOrder(order);
      setIsVisible(true);

      // Hide after 4 seconds
      hideTimeoutId = setTimeout(() => {
        if (!isPaused) {
          setIsVisible(false);
        }
      }, 4000);
    };

    // Show first notification after 2 seconds
    const initialTimeout = setTimeout(() => {
      showNextOrder();
    }, 2000);

    // Show new notification every 8 seconds
    intervalId = setInterval(() => {
      if (!isPaused) {
        showNextOrder();
      }
    }, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
      clearTimeout(hideTimeoutId);
    };
  }, [isPaused]);

  if (!currentOrder) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.5,
          }}
          className="fixed bottom-8 left-8 z-50 max-w-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-background-elevated/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-4">
              {/* Pet Avatar */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold/30 flex-shrink-0">
                <Image
                  src={currentOrder.avatar}
                  alt={currentOrder.pet}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-text-primary font-medium text-sm truncate">
                    {currentOrder.name}
                  </p>
                  {/* Verified Purchase Checkmark */}
                  <svg
                    className="w-4 h-4 text-gold flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-text-secondary text-xs">
                  {currentOrder.tier} • {currentOrder.pet}
                </p>
                <p className="text-text-secondary/60 text-[11px] mt-0.5">
                  {currentOrder.timeAgo}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
