import React, { useState } from "react";

/**
 * PhotoUploadWithGeo
 * Opens the device camera, gets geolocation, and calls onAutoUpload with file and coordinates.
 */
export default function PhotoUploadWithGeo({ onAutoUpload }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const inputRef = React.useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Always get geolocation right before photo upload
  const handleButtonClick = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.value = null; // reset
          inputRef.current.click();
        }
      },
      (err) => {
        setIsLoading(false);
        if (err.code === 1) {
          setError("Location permission denied. Please allow location access in your browser settings.");
        } else if (err.code === 2) {
          setError("Location unavailable. Try again outside or check your device settings.");
        } else if (err.code === 3) {
          setError("Location request timed out. Try again.");
        } else {
          setError("Location access is required for geo-tagging.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotoChange = (event) => {
    setError("");
    const file = event.target.files[0];
    if (!file) return;
    if (!coords) {
      setError("Location not available. Please try again.");
      return;
    }
    setIsLoading(true);
    onAutoUpload({
      file,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    setIsLoading(false);
  };

  return (
    <div>
      {isMobile ? (
        <>
          <button type="button" onClick={handleButtonClick} disabled={isLoading} style={{width:'100%'}}>
            {isLoading ? "Getting location..." : "Take Photo (Geo-tagged)"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          {coords && (
            <div style={{ fontSize: '0.9em', color: '#228B22', marginTop: 4 }}>
              Location: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
            </div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      ) : (
        <div style={{ color: '#b45309', background: '#fffbe6', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <strong>Geo-tagged photo capture is only available on mobile devices.</strong>
          <br />
          Please use your phone or tablet to take a geo-tagged photo.
        </div>
      )}
    </div>
  );
}
