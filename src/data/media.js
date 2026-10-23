/* Resolves Work-page images by path under src/assets/work/, so Astro can optimise them. */
const files = import.meta.glob('../assets/work/**/*.{jpg,png}', { eager: true, import: 'default' });

export function media(path) {
  const file = files[`../assets/work/${path}`];
  if (!file) throw new Error(`Missing work image: ${path}`);
  return file;
}
