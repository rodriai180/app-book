/**
 * Determina si una URL de imagen es válida para mostrar.
 * Las URLs de Pollinations.ai se consideran inválidas (placeholders no confiables).
 */
export const isValidImageUrl = (url?: string): boolean => {
    if (!url || url.trim() === '') return false;
    if (url.includes('image.pollinations.ai')) return false;
    return true;
};
