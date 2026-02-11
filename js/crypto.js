// Crypto.js - Encryption and Decryption Algorithms
const defaultKey = "b9e79274-474a-4e8d-a617-3c3e125d9a1d";
class CryptoEngine {
  constructor() {
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder();
  }

  // ==================== AES-256 Encryption ====================
  async aesEncrypt(text, password) {
    try {
      // Generate a key from the password
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await this.deriveKey(password, salt);

      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt
      const encodedText = this.textEncoder.encode(text);
      const encryptedData = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv: iv},
        key,
        encodedText,
      );

      // Combine salt, iv, and encrypted data
      const encryptedArray = new Uint8Array(encryptedData);
      const combined = new Uint8Array(
        salt.length + iv.length + encryptedArray.length,
      );
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(encryptedArray, salt.length + iv.length);

      // Convert to base64
      return this.arrayBufferToBase64(combined);
    } catch (error) {
      throw new Error("AES encryption failed: " + error.message);
    }
  }

  async aesDecrypt(encryptedText, password) {
    try {
      // Decode from base64
      const combined = this.base64ToArrayBuffer(encryptedText);

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encryptedData = combined.slice(28);

      // Derive key from password and salt
      const key = await this.deriveKey(password, salt);

      // Decrypt
      const decryptedData = await crypto.subtle.decrypt(
        {name: "AES-GCM", iv: iv},
        key,
        encryptedData,
      );

      return this.textDecoder.decode(decryptedData);
    } catch (error) {
      throw new Error("AES decryption failed. Check your password.");
    }
  }

  async deriveKey(password, salt) {
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      this.textEncoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"],
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      {name: "AES-GCM", length: 256},
      false,
      ["encrypt", "decrypt"],
    );
  }

  // ==================== Caesar Cipher ====================
  caesarEncrypt(text, shift) {
    return text
      .split("")
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
      })
      .join("");
  }

  caesarDecrypt(text, shift) {
    return this.caesarEncrypt(text, 26 - (shift % 26));
  }

  // ==================== Base64 Encoding ====================
  base64Encrypt(text) {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error("Base64 encoding failed: " + error.message);
    }
  }

  base64Decrypt(text) {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      throw new Error("Base64 decoding failed. Invalid input.");
    }
  }

  // ==================== XOR Cipher ====================
  xorEncrypt(text, key) {
    if (!key || key.length === 0) {
      throw new Error("XOR cipher requires a key");
    }

    const encrypted = [];
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      encrypted.push(textChar ^ keyChar);
    }

    // Convert to hex string
    return encrypted.map((num) => num.toString(16).padStart(2, "0")).join("");
  }

  xorDecrypt(encryptedHex, key) {
    try {
      if (!key || key.length === 0) {
        throw new Error("XOR cipher requires a key");
      }

      // Convert hex to array of numbers
      const encrypted = [];
      for (let i = 0; i < encryptedHex.length; i += 2) {
        encrypted.push(parseInt(encryptedHex.substr(i, 2), 16));
      }

      // XOR decrypt
      const decrypted = [];
      for (let i = 0; i < encrypted.length; i++) {
        const encChar = encrypted[i];
        const keyChar = key.charCodeAt(i % key.length);
        decrypted.push(String.fromCharCode(encChar ^ keyChar));
      }

      return decrypted.join("");
    } catch (error) {
      throw new Error("XOR decryption failed: " + error.message);
    }
  }

  // ==================== Helper Functions ====================
  arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // ==================== Main Encrypt/Decrypt Functions ====================
  async encrypt(text, method, key = "", shift = 3) {
    text = text.trim();

    if (!text) {
      throw new Error("Please enter text to encrypt");
    }

    switch (method) {
      case "aes":
        if (!key) key = defaultKey;
        return await this.aesEncrypt(text, key);

      case "caesar":
        return this.caesarEncrypt(text, parseInt(shift));

      case "base64":
        return this.base64Encrypt(text);

      case "xor":
        if (!key) throw new Error("Key is required for XOR encryption");
        return this.xorEncrypt(text, key);

      default:
        throw new Error("Unknown encryption method");
    }
  }

  async decrypt(text, method, key = "", shift = 3) {
    text = text.trim();

    if (!text) {
      throw new Error("Please enter text to decrypt");
    }

    switch (method) {
      case "aes":
        if (!key) key = defaultKey;
        return await this.aesDecrypt(text, key);

      case "caesar":
        return this.caesarDecrypt(text, parseInt(shift));

      case "base64":
        return this.base64Decrypt(text);

      case "xor":
        if (!key) throw new Error("Key is required for XOR decryption");
        return this.xorDecrypt(text, key);

      default:
        throw new Error("Unknown decryption method");
    }
  }
}

// Export the crypto engine
const cryptoEngine = new CryptoEngine();
