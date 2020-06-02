export const hexToCss = color => '#' + color.toString(16).padStart(6, '0');

export const greyscale = color => 
    (((((((color >> 16) & 0xff)*76) + (((color >> 8) & 0xff)*150) + ((color & 0xff)*29)) >> 8)) << 16) |
    (((((((color >> 16) & 0xff)*76) + (((color >> 8) & 0xff)*150) + ((color & 0xff)*29)) >> 8)) << 8) |
    ((((((color >> 16) & 0xff)*76) + (((color >> 8) & 0xff)*150) + ((color & 0xff)*29)) >> 8));

export const rgbFromHex = color => ({
    r: Math.floor(color / 0x10000),
    g: Math.floor((color % 0x10000) / 0x100),
    b: color % 0x100,
});

export const hexFromRgb = rgb => rgb.b + rgb.g * 0x100 + rgb.r * 0x10000;

export const colorsDistance = (color1, color2) => {
    const rgb1 = rgbFromHex(color1);
    const rgb2 = rgbFromHex(color2);

    return Math.sqrt((rgb2.r - rgb1.r)**2 + (rgb2.g - rgb1.g)**2 + (rgb2.b - rgb1.b)**2);
};

export const findNearest = (colors, color) => {
    const haystack = [...colors];
    haystack.sort((a, b) => {
        return colorsDistance(a.color, color) - colorsDistance(b.color, color)
    });

    return haystack[0];
}