"use client";

import { Button } from "@/components/ui/button";
import useFingerprint from "@/hooks/useFingerprint";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
export default function AttendanceButton() {
  const fingerprint = useFingerprint();
  const [qr, setQr] = useState(null);
  const [gps, setGPS] = useState({
    lat: null,
    lng: null,
    code: 0,
    message: "",
  });
  const handleCheckIn = async () => {
    if (!fingerprint) return alert("Đang lấy thiết bị...");

    // const gps = await getCurrentGPS(); // lấy tọa độ

    console.log({
      employeeId: "EMPLOYEE_ID",
      fingerprint,
      qrCode: "QR_CODE_HERE",
      latitude: gps.lat,
      longitude: gps.lng,
      deviceName: navigator.userAgent,
      type: "CHECK_IN",
    });
    setQr("ATTENDANCE_QR_CODE_DATA");
  };
  
  return (
    <>
      {!fingerprint ? (
        <p>Đang lấy thông tin thiết bị...</p>
      ) : (
        <p>{fingerprint}</p>
      )}
      <button onClick={handleCheckIn}>Check In</button>
      {qr && <QRCodeCanvas value={qr} size={256} />}
      {gps.code && <p>GPS Permission: {gps.code} - {gps.message}</p>}
      {gps.code === 200 && (<p>
        Vị trí: Lat {gps.lat}, Lng {gps.lng}
      </p>
      )}
      <Button onClick={() => {
        getCurrentGPS()
          .then((pos) => setGPS(pos))
          .catch((err) => setGPS(err));
      }}>Cấp quyền GPS</Button>
    </>
  );
}

function getCurrentGPS() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject({
      lat: null,
      lng: null,
      code: 4,
      message: "Trình duyệt không hỗ trợ GPS",
    });

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          code: 200,
          message: "Success",
        }),
      (err) => {
        switch (err.code) {
          case 1:
            reject({
              lat: null,
              lng: null,
              code: 1,
              message: "Người dùng chặn quyền GPS",
            });
            break;
          case 2:
            reject({
              lat: null,
              lng: null,
              code: 2,
              message: "Không lấy được vị trí",
            });
            break;
          case 3:
            reject({
              lat: null,
              lng: null,
              code: 3,
              message: "Hết thời gian chờ lấy vị trí",
            });
            break;
          default:
            reject({
              lat: null,
              lng: null,
              code: err.code,
              message: err.message,
            });
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
