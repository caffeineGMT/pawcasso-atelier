import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Get Your Pet Portrait — $9 | Pawcasso Atelier',
  description:
    'Transform your pet into stunning AI-generated art in 60 seconds. 16+ art styles including Renaissance, Ghibli, Pixar 3D. As seen on TikTok.',
  openGraph: {
    title: 'Your Pet Deserves to Be a Masterpiece',
    description:
      'Custom AI pet portraits starting at $9. Upload a phone photo, get museum-quality art in 60 seconds. 50K+ portraits created.',
    images: [
      {
        url: '/gallery/golden_retriever_portrait_square.webp',
        width: 2048,
        height: 2048,
        alt: 'Golden Retriever Renaissance portrait by Pawcasso Atelier',
      },
    ],
    type: 'website',
    siteName: 'Pawcasso Atelier',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Pet Deserves to Be a Masterpiece',
    description: 'Custom AI pet portraits starting at $9. As seen on TikTok.',
    images: ['/gallery/golden_retriever_portrait_square.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TikTokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TikTok Pixel */}
      <Script id="tiktok-pixel" strategy="afterInteractive">
        {`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
            ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || ""}');
            ttq.page();
          }(window, document, 'ttq');
        `}
      </Script>
      {children}
    </>
  );
}
