// cryptoUtils.js
export const generateCipherKey = async () => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const raw = await crypto.subtle.exportKey("raw", key);
    return btoa(String.fromCharCode(...new Uint8Array(raw)));
  };
  
  export const importKeyFromBase64 = async (base64Key) => {
    const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return await crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
  };
  
  export const encryptWithKey = async (text, key) => {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text));
    return {
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  };
  
  export const decryptWithKey = async (base64Data, base64Iv, key) => {
    const decoder = new TextDecoder();
    const iv = Uint8Array.from(atob(base64Iv), c => c.charCodeAt(0));
    const encryptedBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBytes);
    return decoder.decode(decrypted);
  };
  