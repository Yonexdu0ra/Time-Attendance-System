"use client";

import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function useFingerprint() {
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log(result);
      
      setFingerprint(result.visitorId);
    };

    initFingerprint();
  }, []);

  return fingerprint;
}
