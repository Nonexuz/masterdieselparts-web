const whatsappNumber = "5516994384160";

const defaultMessage =
  "Olá! Estou no site da Master Diesel e gostaria de atendimento para encontrar uma peça.";

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  defaultMessage
)}`;

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Master Diesel pelo WhatsApp"
      title="Falar com a Master Diesel"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-green-600 px-5 py-4 font-black text-white shadow-xl transition hover:scale-105 hover:bg-green-500"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 fill-current"
      >
        <path d="M12.04 2a9.84 9.84 0 0 0-8.52 14.76L2 22l5.38-1.48A9.99 9.99 0 1 0 12.04 2Zm0 17.95a8 8 0 0 1-4.08-1.11l-.29-.17-3.19.88.85-3.1-.19-.31A7.9 7.9 0 1 1 12.04 19.95Zm4.38-5.92c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
      </svg>

      <span className="hidden sm:inline">Fale pelo WhatsApp</span>
    </a>
  );
}