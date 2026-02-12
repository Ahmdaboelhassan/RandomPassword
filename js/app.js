// App.js - Main Application Logic

class EncryptionApp {
  constructor() {
    this.currentMethod = "aes";
    this.initElements();
    this.attachEventListeners();
    this.updateUI();
  }

  initElements() {
    // Input/Output
    this.inputText = document.getElementById("inputText");
    this.outputText = document.getElementById("outputText");
    this.encryptionKey = document.getElementById("encryptionKey");
    this.shiftValue = document.getElementById("shiftValue");

    // Buttons
    this.encryptBtn = document.getElementById("encryptBtn");
    this.decryptBtn = document.getElementById("decryptBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.copyBtn = document.getElementById("copyBtn");
    this.toggleKeyBtn = document.getElementById("toggleKey");
    this.methodBtns = document.querySelectorAll(".method-btn");

    // Sections
    this.keySection = document.getElementById("keySection");
    this.shiftSection = document.getElementById("shiftSection");

    // Info displays
    this.charCount = document.querySelector(".char-count");
    this.outputMethod = document.getElementById("outputMethod");
    this.outputStatus = document.getElementById("outputStatus");

    // Toast
    this.toast = document.getElementById("toast");
  }

  attachEventListeners() {
    // Method selection
    this.methodBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.selectMethod(e.target.dataset.method);
      });
    });

    // Encryption/Decryption
    this.encryptBtn.addEventListener("click", () => this.handleEncrypt());
    this.decryptBtn.addEventListener("click", () => this.handleDecrypt());

    // Utilities
    this.clearBtn.addEventListener("click", () => this.clearAll());
    this.copyBtn.addEventListener("click", () => this.copyOutput());
    this.toggleKeyBtn.addEventListener("click", () =>
      this.toggleKeyVisibility(),
    );

    // Input updates
    this.inputText.addEventListener("input", () => this.updateCharCount());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "e") {
          e.preventDefault();
          this.handleEncrypt();
        } else if (e.key === "d") {
          e.preventDefault();
          this.handleDecrypt();
        }
      }
    });
  }

  selectMethod(method) {
    this.currentMethod = method;

    // Update button states
    this.methodBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.method === method);
    });

    this.updateUI();
    this.outputText.value = "";
    this.updateOutputInfo("-", "-");
  }

  updateUI() {
    // Show/hide appropriate input sections based on method
    const needsKey = ["aes", "xor"].includes(this.currentMethod);
    const needsShift = this.currentMethod === "caesar";

    this.keySection.style.display = needsKey ? "block" : "none";
    this.shiftSection.style.display = needsShift ? "block" : "none";

    // Update key section label for XOR
    const keyLabel = this.keySection.querySelector("label");
    if (this.currentMethod === "xor") {
      keyLabel.textContent = "XOR Key:";
      this.encryptionKey.placeholder = "Enter a key for XOR cipher";
    } else {
      keyLabel.textContent = "Encryption Key:";
      this.encryptionKey.placeholder = "Enter a strong password";
    }
  }

  async handleEncrypt() {
    try {
      const text = this.inputText.value;
      const key = this.encryptionKey.value;
      const shift = this.shiftValue.value;

      if (!text.trim()) {
        this.showToast("Please enter some text to encrypt", "error");
        return;
      }

      // Show loading state
      this.encryptBtn.disabled = true;
      this.encryptBtn.textContent = "🔒 Encrypting...";

      const encrypted = await cryptoEngine.encrypt(
        text,
        this.currentMethod,
        key,
        shift,
      );

      this.outputText.value = encrypted;
      this.updateOutputInfo(this.getMethodName(), "Encrypted ✓");
      this.showToast("Text encrypted successfully!", "success");
    } catch (error) {
      this.showToast(error.message, "error");
      this.outputText.value = "";
      this.updateOutputInfo("-", "Error");
    } finally {
      this.encryptBtn.disabled = false;
      this.encryptBtn.textContent = "🔒 Encrypt";
    }
  }

  async handleDecrypt() {
    try {
      const text = this.inputText.value;
      const key = this.encryptionKey.value;
      const shift = this.shiftValue.value;

      if (!text.trim()) {
        this.showToast("Please enter encrypted text to decrypt", "error");
        return;
      }

      // Show loading state
      this.decryptBtn.disabled = true;
      this.decryptBtn.textContent = "🔓 Decrypting...";

      const decrypted = await cryptoEngine.decrypt(
        text,
        this.currentMethod,
        key,
        shift,
      );

      this.outputText.value = decrypted;
      this.updateOutputInfo(this.getMethodName(), "Decrypted ✓");
      this.showToast("Text decrypted successfully!", "success");
    } catch (error) {
      this.showToast(error.message, "error");
      this.outputText.value = "";
      this.updateOutputInfo("-", "Error");
    } finally {
      this.decryptBtn.disabled = false;
      this.decryptBtn.textContent = "🔓 Decrypt";
    }
  }

  clearAll() {
    this.inputText.value = "";
    this.outputText.value = "";
    this.encryptionKey.value = "";
    this.shiftValue.value = "3";
    this.updateCharCount();
    this.updateOutputInfo("-", "-");
    this.showToast("All fields cleared", "success");
  }

  async copyOutput() {
    const text = this.outputText.value;

    if (!text) {
      this.showToast("Nothing to copy!", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.showToast("Copied to clipboard!", "success");

      // Visual feedback
      this.copyBtn.textContent = "✓ Copied";
      setTimeout(() => {
        this.copyBtn.textContent = "📋 Copy";
      }, 2000);
    } catch (error) {
      // Fallback for older browsers
      this.outputText.select();
      document.execCommand("copy");
      this.showToast("Copied to clipboard!", "success");
    }
  }

  toggleKeyVisibility() {
    const type = this.encryptionKey.type === "password" ? "text" : "password";
    this.encryptionKey.type = type;
    this.toggleKeyBtn.textContent = type === "password" ? "👁️" : "🙈";
  }

  updateCharCount() {
    const count = this.inputText.value.length;
    this.charCount.textContent = `${count} character${count !== 1 ? "s" : ""}`;
  }

  updateOutputInfo(method, status) {
    this.outputMethod.textContent = method;
    this.outputStatus.textContent = status;
  }

  getMethodName() {
    const names = {
      aes: "AES-256",
      caesar: "Caesar Cipher",
      base64: "Base64",
      xor: "XOR Cipher",
    };
    return names[this.currentMethod] || this.currentMethod;
  }

  showToast(message, type = "success") {
    this.toast.textContent = message;
    this.toast.className = `toast ${type}`;
    this.toast.classList.add("show");

    setTimeout(() => {
      this.toast.classList.remove("show");
    }, 3000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new EncryptionApp();

  // Initialize password generator
  const passwordGeneratorUI = new PasswordGeneratorUI(app);

  // Add keyboard shortcut info
  console.log(
    "%c🔐 Text Encryptor V3.1",
    "font-size: 20px; font-weight: bold; color: #6366f1;",
  );
  console.log("Keyboard Shortcuts:");
  console.log("  Ctrl/Cmd + E : Encrypt");
  console.log("  Ctrl/Cmd + D : Decrypt");
  console.log("  ESC : Close password generator");
});
