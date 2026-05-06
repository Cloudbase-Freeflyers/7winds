import { youtubeVideoId } from "@/lib/constants";

export default function VideoSection() {
  const embed = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`;
  return (
    <section id="video" className="section bg-brand-soft">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-black">
          מה זה טיסת חוויה?
        </h2>
        <p className="mt-3 text-brand-dark text-lg max-w-2xl mx-auto">
          סרטון קצר שמסביר מה קורה בטיסה, איך זה עובד, ולמה זה מתאים כמעט לכל אחד.
        </p>

        <div className="mt-10 relative aspect-video w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embed}
            title="טיסת מצנח רחיפה — 7Winds"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
