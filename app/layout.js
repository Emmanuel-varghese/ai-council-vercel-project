import "./globals.css";

export const metadata = {
  title: "AI Council",
  description: "A multi-perspective AI decision council"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
