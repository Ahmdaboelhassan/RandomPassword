// PWA Installation and Service Worker Registration
class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.init();
  }

  init() {
    // Register service worker
    this.registerServiceWorker();

    // Handle install prompt
    this.setupInstallPrompt();
    // Check if already installed
    this.checkIfInstalled();

    // Listen for app installed event
    this.listenForAppInstalled();
  }

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        // Detect the base path - same logic as sw.js
        const getBasePath = () => {
          const pathname = window.location.pathname;
          // Check if running on GitHub Pages (has /Encrypto/ in path)
          if (pathname.includes("/Encrypto/")) {
            return "/Encrypto/";
          }
          const lastSlashIndex = pathname.lastIndexOf("/");
          return pathname.substring(0, lastSlashIndex + 1);
        };

        const basePath = getBasePath();
        const swPath = basePath + "sw.js";

        const registration = await navigator.serviceWorker.register(swPath, {
          scope: basePath,
        });

        console.log("✅ Service Worker registered:", registration.scope);

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("🔄 Service Worker update found");

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available
              this.showUpdateNotification();
            }
          });
        });

        // Listen for controller change
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          console.log("🔄 Service Worker controller changed - reloading page");
          window.location.reload();
        });
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    } else {
      console.log("⚠️ Service Workers not supported");
    }
  }

  setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("💾 Install prompt available");

      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Save the event for later use
      this.deferredPrompt = e;

      // Show install button
      if (this.installButton) {
        this.installButton.style.display = "flex";
      }
    });
  }

  createInstallButton() {
    // Check if button already exists
    if (document.getElementById("pwaInstallButton")) return;

    // Create install button
    this.installButton = document.createElement("button");
    this.installButton.id = "pwaInstallButton";
    this.installButton.className = "pwa-install-btn";
    this.installButton.innerHTML = "📱 Install App";
    this.installButton.style.display = "none";

    // Add click handler
    this.installButton.addEventListener("click", () => {
      this.showInstallPrompt();
    });

    // Append to body
    document.body.appendChild(this.installButton);
  }

  async showInstallPrompt() {
    if (!this.deferredPrompt) {
      console.log("⚠️ Install prompt not available");
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for user response
    const {outcome} = await this.deferredPrompt.userChoice;
    console.log(`👤 User response: ${outcome}`);

    if (outcome === "accepted") {
      console.log("✅ User accepted install");
      this.showToast("App is being installed...", "success");
    } else {
      console.log("❌ User dismissed install");
    }

    // Clear the prompt
    this.deferredPrompt = null;

    // Hide install button
    if (this.installButton) {
      this.installButton.style.display = "none";
    }
  }

  checkIfInstalled() {
    // Check if running as installed PWA
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      console.log("✅ Running as installed PWA");
      this.hideInstallButton();
    }
  }

  listenForAppInstalled() {
    window.addEventListener("appinstalled", () => {
      console.log("✅ App installed successfully");
      this.showToast("App installed! You can now use it offline.", "success");
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = "none";
    }
  }

  showUpdateNotification() {
    const updateBanner = document.createElement("div");
    updateBanner.className = "update-banner";
    updateBanner.innerHTML = `
            <div class="update-content">
                <span>🔄 New version available!</span>
                <button id="updateButton">Update Now</button>
                <button id="dismissUpdate">Later</button>
            </div>
        `;
    document.body.appendChild(updateBanner);

    // Update button click
    document.getElementById("updateButton").addEventListener("click", () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({type: "SKIP_WAITING"});
      }
      updateBanner.remove();
    });

    // Dismiss button click
    document.getElementById("dismissUpdate").addEventListener("click", () => {
      updateBanner.remove();
    });
  }

  showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.className = `toast ${type} show`;
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  }

  // Method to clear cache (useful for development)
  async clearCache() {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({type: "CLEAR_CACHE"});
      console.log("🗑️ Cache clear requested");
      this.showToast("Cache cleared", "success");
    }
  }
}

// Initialize PWA installer when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.pwaInstaller = new PWAInstaller();
  });
} else {
  window.pwaInstaller = new PWAInstaller();
}

// Expose clear cache method to console for development
window.clearPWACache = () => {
  if (window.pwaInstaller) {
    window.pwaInstaller.clearCache();
  }
};
