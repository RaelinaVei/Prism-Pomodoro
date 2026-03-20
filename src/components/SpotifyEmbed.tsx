export function SpotifyEmbed() {
  return (
    <div className="fixed bottom-4 left-4 z-20 w-80 rounded-xl overflow-hidden shadow-lg">
      <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/4Zjli1P13J5mmSCD5iKAXK?utm_source=generator&theme=0"
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Lo-fi Playlist"
      />
    </div>
  );
}
