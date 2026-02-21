export function Footer() {
  return (
    <footer
      className="relative bg-wood-dark text-cream bg-cover bg-center bg-no-repeat h-40 flex items-center"
      style={{ backgroundImage: "url(/images/footer.png)" }}
    >
      {/* Overlay so text stays readable on any image */}
      {/* <div className="absolute inset-0 bg-wood-dark/80" aria-hidden />
      <div className="relative container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg">Prod&apos;Oine</span>
          <span className="text-stone/70 text-sm">• Créateur de mobilier •</span>
        </div>
        <p className="text-stone/80 text-sm">
          Mobilier industriel durable – Fabriqué en France
        </p>
      </div> */}
    </footer>
  );
}
