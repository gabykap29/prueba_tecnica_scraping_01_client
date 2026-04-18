import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rappi Competitive Intelligence",
  description: "Dashboard competitivo para Rappi, Uber Eats y DiDi Food",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#fff7f2]">
        <header className="bg-gradient-to-r from-rappi-red to-rappi-orange shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img
                  src="/rappi-logo.png"
                  alt="Rappi"
                  className="h-10 w-10 object-contain"
                />
                <h1 className="text-xl font-bold text-white">
                  Rappi Analytics
                </h1>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <span className="text-white/90">Mexico</span>
                <span className="text-white/90">Fast food</span>
                <span className="text-white/90">OSINT live</span>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
