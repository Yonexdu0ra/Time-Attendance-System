"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function CustomScanner() {
  const scannerRef = useRef(null);
  const id = useId();
  const [cameraId, setCameraId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState("");
  
  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      setDevices(devices);
      if (devices && devices.length)
        setCameraId(devices[devices.length - 1].id);
    });
    return () => {
      if (scannerRef.current) scannerRef.current.stop();
    };
  }, []);

  const startScan = async () => {
    if (!cameraId || scanning) return;
    setScanning(true);
    scannerRef.current = new Html5Qrcode(id);
    await scannerRef.current.start(
      { deviceId: { exact: cameraId } },
      { fps: 20, qrbox: 250 },
      (decoded) => {
        alert("QR: " + decoded);
        stopScan();
      },
      (err) => {}
    );
  };

  const stopScan = async () => {
    setScanning(false);
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-20">
      <div
        className="relative min-h-[480px] min-w-[360px] border rounded-lg overflow-hidden"
        
      >
        <div id={id} className="w-full  mx-auto bg-black relative z-10"></div>

        <button
          onClick={scanning ? stopScan : startScan}
          className={`px-6 py-2 rounded-full text-white absolute bottom-0 left-0 right-0 mx-auto w-max  z-50 ${
            scanning ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {scanning ? "Dừng" : "Bắt đầu quét"}
        </button>
        <button
          className="z-50 absolute bottom-0 left-0"
          onClick={async () => {
            if (!scannerRef.current || devices.length < 2) return;

            const currentIndex = devices.findIndex((d) => d.id === cameraId);
            const nextIndex = (currentIndex + 1) % devices.length;
            const nextCameraId = devices[nextIndex].id;

            // Stop scanner hiện tại
            await scannerRef.current.stop();
            scannerRef.current.clear();

            // Update cameraId
            setCameraId(nextCameraId);

            // Start lại với camera mới
            await scannerRef.current.start(
              { deviceId: { exact: nextCameraId } },
              { fps: 20, qrbox: 250 },
              (decoded) => {
                alert("QR: " + decoded);
                stopScan();
              },
              (err) => {}
            );
          }}
        >
          Đổi camera
        </button>
      </div>
      
    </div>
  );
}
