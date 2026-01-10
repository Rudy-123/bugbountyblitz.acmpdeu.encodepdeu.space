import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bug Bounty Blitz",
  description: "A Capture The Flag adventure through time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "font-body antialiased min-h-screen flex flex-col relative overflow-auto text-white bg-black/90"
        )}
      >
        {/* 🎬 Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* 🌌 Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] -z-10" />

        <Providers>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}



// import type { Metadata } from 'next';
// import './globals.css';
// import { Providers } from './providers';
// import { Header } from '@/components/layout/Header';
// import { Toaster } from '@/components/ui/toaster';
// import { cn } from '@/lib/utils';

// export const metadata: Metadata = {
//   title: 'Evolution CTF',
//   description: 'A Capture The Flag adventure through time.',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body
//         className={cn(
//           "font-body antialiased min-h-screen flex flex-col relative overflow-hidden"
//         )}
//       >
//         {/* 🌌 Background Video */}
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover -z-10"
//         >
//           <source src="/video.mp4" type="video/mp4" />
//         </video>

//         <Providers>
//           <Header />
//           <main className="flex-1 container mx-auto px-4 py-8 text-white">
//             {children}
//           </main>
//           <Toaster />
//         </Providers>
//       </body>
//     </html>
//   );
// }


// // import type { Metadata } from 'next';
// // import './globals.css';
// // import { Providers } from './providers';
// // import { Header } from '@/components/layout/Header';
// // import { Toaster } from '@/components/ui/toaster';
// // import { cn } from '@/lib/utils';

// // export const metadata: Metadata = {
// //   title: 'Evolution CTF',
// //   description: 'A Capture The Flag adventure through time.',
// // };

// // export default function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
// //   return (
// //     <html lang="en" suppressHydrationWarning>
// //       <head>
// //         <link rel="preconnect" href="https://fonts.googleapis.com" />
// //         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
// //         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
// //         <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
// //       </head>
// //       <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
// //         <Providers>
// //           <Header />
// //           <main className="flex-1 container mx-auto px-4 py-8">
// //             {children}
// //           </main>
// //           <Toaster />
// //         </Providers>
// //       </body>
// //     </html>
// //   );
// // }
