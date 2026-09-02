// Marketing pages own their own full-bleed layout. This layout is a
// pass-through so the route group can host multiple marketing pages
// (landing, /pricing, /templates, etc.) without each rebuilding chrome.

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
