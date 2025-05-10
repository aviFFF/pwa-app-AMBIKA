"use client";

// Register the service worker
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Register next-pwa service worker
    navigator.serviceWorker.register("/sw.js");
  });

  // Polyfill for jsPDF if needed
  if (!window.HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(window.HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback: (blob: Blob | null) => void, type?: string, quality?: any): void {
        const dataURL = this.toDataURL(type, quality);
        const binStr = atob(dataURL.split(',')[1]);
        const len = binStr.length;
        const arr = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        
        callback(new Blob([arr], { type: type || 'image/png' }));
      }
    });
  }
} 