
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Camera, AlertTriangle } from 'lucide-react';

interface ScannerModalProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScan }) => {
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Initialize scanner
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
          },
          (decodedText) => {
             // On Success
             // Stop scanning immediately to prevent duplicate reads
             html5QrCode.stop().then(() => {
                onScan(decodedText);
             }).catch(err => console.error("Failed to stop scanner", err));
          },
          (errorMessage) => {
            // parse error, ignore for UI cleanliness
          }
        );
      } catch (err) {
        console.error("Error starting scanner", err);
        setError("Could not start camera. Please ensure permissions are granted.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current.clear();
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-white">
           <Camera className="text-emerald-500 animate-pulse" />
           <span className="font-bold text-lg">Scan Cage Card</span>
        </div>
        <button 
            onClick={onClose} 
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors"
        >
            <X size={24} />
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
         <div id="reader" className="w-full h-full max-h-[80vh] overflow-hidden"></div>
         
         {/* Overlay Guide */}
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-emerald-500/50 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1 rounded-br-xl"></div>
                
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-500/30 animate-[pulse_2s_infinite]"></div>
            </div>
         </div>
      </div>

      {/* Footer / Error */}
      <div className="p-8 text-center bg-neutral-900 text-white pb-12">
         {error ? (
            <div className="flex flex-col items-center gap-2 text-rose-500">
                <AlertTriangle size={32} />
                <p>{error}</p>
                <button onClick={onClose} className="mt-4 px-6 py-2 bg-white/10 rounded-full text-sm">Close</button>
            </div>
         ) : (
             <p className="text-slate-400 text-sm">Align the QR code within the frame to scan.</p>
         )}
      </div>
    </div>
  );
};
