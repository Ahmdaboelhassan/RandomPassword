# 🔐 Text Encryptor

A modern, feature-rich text encryption and decryption tool built with vanilla JavaScript. No frameworks, no dependencies - just pure JavaScript, HTML, and CSS.

## ✨ Features

- **Multiple Encryption Methods**
  - AES-256 (Advanced Encryption Standard)
  - Caesar Cipher
  - Base64 Encoding
  - XOR Cipher

- **Built-in Password Generator** 🎲
  - Customizable password length (4-64 characters)
  - Toggle uppercase letters (A-Z)
  - Toggle lowercase letters (a-z)
  - Toggle numbers (0-9)
  - Toggle special characters (!@#$%^&*)
  - Real-time password strength indicator
  - One-click copy and apply to encryption key

- **User-Friendly Interface**
  - Clean, modern design
  - Responsive layout for all devices
  - Real-time character counting
  - Toast notifications for feedback
  - Keyboard shortcuts (Ctrl/Cmd + E/D, ESC)

- **Security Features**
  - Client-side encryption (your data never leaves your browser)
  - Password visibility toggle
  - Strong AES-256 encryption with PBKDF2 key derivation
  - 100,000 iterations for password hashing
  - Cryptographically secure random password generation (crypto.getRandomValues)

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start encrypting!

No build process, no npm install, no dependencies required!

### Usage

1. **Choose an encryption method** from the four available options
2. **Enter your text** in the input field
3. **Provide a key/password** (for AES and XOR) or shift value (for Caesar)
   - Click the 🎲 button to open the **Password Generator**
   - Customize length and character types
   - Generate strong passwords with one click
   - Copy or directly apply to encryption key
4. Click **Encrypt** or **Decrypt**
5. Copy the result using the copy button

### Password Generator

The built-in password generator helps you create strong, secure passwords:

1. Click the **🎲 dice button** next to the encryption key field
2. Adjust the password length using the slider (4-64 characters)
3. Select which character types to include:
   - **Uppercase Letters**: A-Z
   - **Lowercase Letters**: a-z
   - **Numbers**: 0-9
   - **Special Characters**: !@#$%^&*()_+-=[]{}|;:,.<>?
4. Click **Generate Password** to create a new password
5. View the **real-time strength indicator** (Weak/Fair/Good/Strong)
6. **Copy** the password or click **Use This Password** to apply it directly

The password generator uses `crypto.getRandomValues()` for cryptographically secure randomness.

## 📚 Encryption Methods Explained

### AES-256
- **Security Level**: ⭐⭐⭐⭐⭐ (Very High)
- **Use Case**: Protecting sensitive data
- **How it works**: Industry-standard encryption used by governments and banks
- **Requirements**: Strong password needed
- **Note**: Uses Web Crypto API with GCM mode and PBKDF2 key derivation

### Caesar Cipher
- **Security Level**: ⭐ (Very Low - Educational Only)
- **Use Case**: Learning cryptography basics
- **How it works**: Shifts each letter by a fixed number of positions
- **Requirements**: Shift value (1-25)
- **Note**: NOT secure for real data - easily broken

### Base64
- **Security Level**: None (This is encoding, not encryption)
- **Use Case**: Data transmission, encoding binary data
- **How it works**: Converts text to ASCII characters
- **Requirements**: None
- **Note**: This is NOT encryption - anyone can decode it

### XOR Cipher
- **Security Level**: ⭐⭐ (Low to Medium)
- **Use Case**: Simple obfuscation
- **How it works**: Performs XOR operation with a key
- **Requirements**: Encryption key
- **Note**: Security depends on key quality and length

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + E` - Encrypt text
- `Ctrl/Cmd + D` - Decrypt text
- `ESC` - Close password generator modal

## 🏗️ Project Structure

```
text-encryptor/
│
├── index.html              # Main HTML structure
├── styles.css              # All styling and animations
├── crypto.js               # Encryption/decryption algorithms
├── password-generator.js   # Password generation logic
├── app.js                  # UI logic and event handling
└── README.md               # This file
```

## 🔧 Technical Details

### Technologies Used
- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Web Crypto API (for AES encryption)

### Browser Compatibility
- Chrome/Edge 60+
- Firefox 57+
- Safari 11+
- Opera 47+

**Note**: AES encryption requires HTTPS or localhost for the Web Crypto API to work.

## 🎨 Features Breakdown

### Crypto.js
Contains all encryption/decryption logic:
- `aesEncrypt()` / `aesDecrypt()` - AES-256-GCM with PBKDF2
- `caesarEncrypt()` / `caesarDecrypt()` - Caesar cipher implementation
- `base64Encrypt()` / `base64Decrypt()` - Base64 encoding/decoding
- `xorEncrypt()` / `xorDecrypt()` - XOR cipher with hex output

### Password-Generator.js
Secure password generation system:
- `PasswordGenerator` class - Core generation logic using crypto.getRandomValues
- `PasswordGeneratorUI` class - Modal interface and controls
- Strength calculation algorithm (Weak/Fair/Good/Strong)
- Guaranteed character type inclusion
- Cryptographically secure shuffling

### App.js
Handles all UI interactions:
- Method selection
- Input/output management
- Toast notifications
- Copy to clipboard
- Character counting
- Error handling

## 🔒 Security Considerations

**Important**: This is a client-side tool for educational and basic encryption needs.

✅ **Safe for**:
- Personal notes
- Non-sensitive data
- Learning cryptography
- Quick obfuscation

❌ **NOT recommended for**:
- Banking information
- Passwords to other accounts
- Highly sensitive personal data
- Production systems

**Why?**
- Encryption happens in the browser (no backend verification)
- Key management is manual
- No key storage or recovery
- For serious security needs, use professional encryption services

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Future Enhancements

Potential features to add:
- [ ] More encryption algorithms (RSA, Blowfish)
- [ ] File encryption support
- [ ] Batch encryption
- [x] ~~Password strength meter~~ ✅ (Implemented!)
- [x] ~~Password generator~~ ✅ (Implemented!)
- [ ] Export/import encrypted data
- [ ] Dark mode toggle
- [ ] Encryption history
- [ ] Multiple language support
- [ ] Password manager integration

## 🐛 Known Limitations

1. Base64 is encoding, not encryption (provides no security)
2. Caesar cipher is easily breakable (for educational use only)
3. XOR cipher security depends heavily on key quality
4. No key recovery mechanism if you forget your password
5. Maximum text size depends on browser memory

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Add new encryption algorithms
- Improve the UI/UX
- Add animations
- Implement file encryption
- Add tests

## ⚠️ Disclaimer

This tool is provided for educational purposes. The authors are not responsible for any misuse or data loss. Always keep backups of important data and use professional encryption services for sensitive information.

## 📞 Support

If you encounter any issues or have questions:
1. Check that you're using a modern browser
2. Ensure you're on HTTPS or localhost (required for Web Crypto API)
3. Verify your encryption key/password is correct when decrypting

---

**Built with ❤️ using Vanilla JavaScript**

No frameworks. No dependencies. Just pure web technologies.
