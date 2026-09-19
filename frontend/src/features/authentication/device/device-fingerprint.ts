
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authentication Device Fingerprint
// -----------------------------------------------------------------------------
//
// Browser-side device fingerprint used by the authentication boundary.
//
// The fingerprint is sent to the backend during login:
//
//   x-device-fingerprint: <fingerprint>
//
// Important distinction:
//
//   device fingerprint
//       ↓
//   client-generated identifier used to identify the browser/device
//
//   devicePublicId
//       ↓
//   backend-issued Device public identifier returned after successful login
//
// They are NOT the same value.
//
// This module does not:
// - create a backend Device
// - persist an authentication session
// - store tokens
// - store passwords
// - identify the user
// - make network requests
//
// The fingerprint is intentionally generated from stable browser characteristics
// available to the web application. It is not intended to be a cryptographic
// identity or security credential. Backend authentication remains authoritative.
//
// -----------------------------------------------------------------------------

const DEVICE_FINGERPRINT_STORAGE_KEY = 'sisimove.device.fingerprint';

/**
 * Generate a browser-local device fingerprint.
 *
 * A random UUID is persisted in localStorage and reused by subsequent login
 * attempts from the same browser profile.
 *
 * This gives the backend a stable client-generated device identifier without
 * collecting a large set of browser characteristics.
 *
 * The value is intentionally opaque and contains no user information.
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    throw new Error(
      'Device fingerprint can only be generated in a browser environment.',
    );
  }

  const existingFingerprint = window.localStorage.getItem(
    DEVICE_FINGERPRINT_STORAGE_KEY,
  );

  if (existingFingerprint !== null && existingFingerprint.length > 0) {
    return existingFingerprint;
  }

  const fingerprint = createFingerprint();

  window.localStorage.setItem(
    DEVICE_FINGERPRINT_STORAGE_KEY,
    fingerprint,
  );

  return fingerprint;
}

/**
 * Generate the initial browser-local fingerprint.
 *
 * `crypto.randomUUID()` is preferred because it is available in modern
 * browsers and produces an opaque UUID without requiring custom hashing.
 */
function createFingerprint(): string {
  if (
    typeof window !== 'undefined' &&
    typeof window.crypto?.randomUUID === 'function'
  ) {
    return window.crypto.randomUUID();
  }

  /**
   * This fallback exists for environments where randomUUID is unavailable.
   *
   * It is only used to create a client identifier. It is not a security
   * primitive and must never be treated as one.
   */
  return [
    Date.now().toString(36),
    Math.random().toString(36).slice(2),
    Math.random().toString(36).slice(2),
  ].join('-');
}
