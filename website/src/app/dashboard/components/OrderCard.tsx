"use client";

import { useState } from "react";
import { Order } from "@prisma/client";
import OptimisticImage from "@/components/OptimisticImage";
import LoadingButton from "@/components/LoadingButton";

interface OrderCardProps {
  order: Order;
}

function StatusBadge({ status, deliveryStatus }: { status: string; deliveryStatus: string }) {
  const getStatusConfig = () => {
    if (deliveryStatus === "completed") {
      return {
        bg: "#06D6A0",
        text: "#fff",
        label: "Delivered",
      };
    }

    if (status === "completed") {
      return {
        bg: "#F4A261",
        text: "#fff",
        label: "Processing",
      };
    }

    if (status === "pending") {
      return {
        bg: "#E5E5E5",
        text: "#4A4A4A",
        label: "Pending Payment",
      };
    }

    if (status === "refunded") {
      return {
        bg: "#EF476F",
        text: "#fff",
        label: "Refunded",
      };
    }

    return {
      bg: "#E5E5E5",
      text: "#4A4A4A",
      label: status,
    };
  };

  const config = getStatusConfig();

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const portraitUrls = order.portraitUrls
    ? order.portraitUrls.split(",").map((url) => url.trim()).filter(Boolean)
    : [];

  const handleDownload = (url: string, index: number) => {
    window.open(url, "_blank");
  };

  const handleDownloadAll = async () => {
    if (portraitUrls.length === 0) return;

    setDownloadingAll(true);

    // Download each portrait in sequence
    for (let i = 0; i < portraitUrls.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay between downloads
      window.open(portraitUrls[i], "_blank");
    }

    setDownloadingAll(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header - Always Visible */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#2B2D42] mb-1">
              {order.petName}
            </h3>
            <p className="text-sm text-[#4A4A4A]">
              {order.tierName} • {order.style}
            </p>
          </div>
          <StatusBadge status={order.status} deliveryStatus={order.deliveryStatus} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-[#4A4A4A]">
            {formatDate(order.createdAt)}
          </div>
          <div className="font-semibold text-[#2B2D42]">
            ${order.amount.toFixed(2)}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="mt-4 flex items-center justify-center">
          <svg
            className={`w-5 h-5 text-[#4A4A4A] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[#E5E5E5] p-6 bg-[#FAFAFA]">
          {/* Order Details */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#2B2D42] mb-3">Order Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">Order ID</span>
                <span className="font-mono text-xs text-[#4A4A4A]">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">Tier</span>
                <span className="text-[#2B2D42] font-medium">{order.tierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">Art Style</span>
                <span className="text-[#2B2D42] font-medium">{order.style}</span>
              </div>
              {order.notes && (
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">Notes</span>
                  <span className="text-[#2B2D42] max-w-[200px] text-right">{order.notes}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">Delivered</span>
                  <span className="text-[#06D6A0] font-medium">{formatDate(order.deliveredAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Portrait Downloads */}
          {portraitUrls.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-[#2B2D42]">
                  Your Portraits ({portraitUrls.length})
                </h4>
                {portraitUrls.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloadingAll}
                    className="text-xs font-medium text-[#E07A5F] hover:text-[#E07A5F]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {downloadingAll && (
                      <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {downloadingAll ? "Downloading..." : "Download All"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {portraitUrls.map((url, index) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-[#E5E5E5]">
                    <OptimisticImage
                      src={url}
                      alt={`${order.petName} Portrait ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {/* Download overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(url, index);
                        }}
                        className="bg-white text-[#2B2D42] px-4 py-2 rounded-full text-xs font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </button>
                    </div>
                    {/* Portrait number */}
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1} of {portraitUrls.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Button */}
          <div className="pt-4 border-t border-[#E5E5E5]">
            <a
              href={`mailto:support@pawcasso-atelier.com?subject=Question about Order ${order.id.slice(0, 8)}&body=Order ID: ${order.id}%0D%0APet Name: ${order.petName}%0D%0A%0D%0AYour question:`}
              className="block w-full text-center bg-white border border-[#E5E5E5] text-[#2B2D42] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#F8F7F4] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
