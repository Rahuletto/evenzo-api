export function generateUUID(len: number = 24): string {
    const bytes = new Uint8Array(Math.ceil(len / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
    }

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    // Convert to hex string
    const hexString = Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const rawUUID = hexString.slice(0, len);
    // Split into equal parts and join with dashes
    const partLength = Math.floor(len / 4);
    return rawUUID.match(new RegExp(`.{${partLength}}`, 'g'))?.join('-') || rawUUID;
}