const titleCache = new Map<string, string>();

/**
 * Extrae el ID de 11 caracteres de una URL de YouTube.
 * Soporta: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID y /embed/ID.
 * Si no encuentra coincidencia, devuelve el valor original.
 */
export function getYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|watch\?(?:.*&)?v=))([\w-]{11})/,
  );
  return match?.[1] ?? url;
}

/**
 * Obtiene el título real del video desde YouTube (oEmbed).
 * Si falla (sin internet, video privado, límite de peticiones), usa `fallback`.
 */
export async function getYouTubeTitle(
  url: string,
  fallback: string,
): Promise<string> {
  if (titleCache.has(url)) return titleCache.get(url)!;

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    );
    if (!res.ok) return fallback;

    const data = await res.json();
    const title = (data.title as string) || fallback;
    titleCache.set(url, title);
    return title;
  } catch {
    return fallback;
  }
}
