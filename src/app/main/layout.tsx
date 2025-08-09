export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans">
      <main className="h-screen w-screen pt-16">{children}</main>
    </div>
  );
}
