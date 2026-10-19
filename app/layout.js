import "./globals.css";

export const metadata = {
  title: "Note Application",
  description: "A modern application for organizing your notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}