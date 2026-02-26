export default function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-container mx-auto px-5">
      {children}
    </div>
  );
}