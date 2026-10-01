// -----------------------------------------------------------------------------
// Path: src/features/journey/data/supported-corridors.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Supported Journey Corridors
//
// Initial SisiMove-owned catalogue of long-distance Kenyan travel corridors.
//
// This is presentation/application data, not Journey persistence.
//
// A SupportedCorridor represents a meaningful long-distance origin →
// destination relationship. The route locations are intentionally limited to
// major locations and are NOT an exhaustive list of road waypoints.
//
// Journey-specific pickup/drop-off points remain the responsibility of
// JourneyWaypoint.
//
// -----------------------------------------------------------------------------

import type { SupportedLocation } from "@/foundation/location/types/location.types";
import type { SupportedCorridor } from "../types/journey-corridor.types";

// -----------------------------------------------------------------------------
// Supported Locations
// -----------------------------------------------------------------------------

const NAIROBI: SupportedLocation = {
  key: "NAIROBI",
  name: "Nairobi",
  latitude: -1.286389,
  longitude: 36.817223,
};

const NAKURU: SupportedLocation = {
  key: "NAKURU",
  name: "Nakuru",
  latitude: -0.303099,
  longitude: 36.080025,
};

const KERICHO: SupportedLocation = {
  key: "KERICHO",
  name: "Kericho",
  latitude: -0.369206,
  longitude: 35.283257,
};

const KISUMU: SupportedLocation = {
  key: "KISUMU",
  name: "Kisumu",
  latitude: -0.10221,
  longitude: 34.76171,
};

const ELDORET: SupportedLocation = {
  key: "ELDORET",
  name: "Eldoret",
  latitude: 0.514277,
  longitude: 35.269779,
};

const MOMBASA: SupportedLocation = {
  key: "MOMBASA",
  name: "Mombasa",
  latitude: -4.043477,
  longitude: 39.668206,
};

const VOI: SupportedLocation = {
  key: "VOI",
  name: "Voi",
  latitude: -3.39605,
  longitude: 38.55609,
};

const MACHAKOS: SupportedLocation = {
  key: "MACHAKOS",
  name: "Machakos",
  latitude: -1.517683,
  longitude: 37.263414,
};

const KITALE: SupportedLocation = {
  key: "KITALE",
  name: "Kitale",
  latitude: 1.01572,
  longitude: 35.00622,
};

const KAKAMEGA: SupportedLocation = {
  key: "KAKAMEGA",
  name: "Kakamega",
  latitude: 0.28273,
  longitude: 34.75186,
};

// -----------------------------------------------------------------------------
// Supported Corridors
// -----------------------------------------------------------------------------

export const SUPPORTED_CORRIDORS: readonly SupportedCorridor[] = [
  // ---------------------------------------------------------------------------
  // Nairobi → Kisumu
  // ---------------------------------------------------------------------------

  {
    key: "NAIROBI_KISUMU",
    name: "Nairobi → Kisumu",

    origin: NAIROBI,
    destination: KISUMU,

    routes: [
      {
        key: "NAIROBI_KISUMU_NAIROBI",
        location: NAIROBI,
        sequence: 1,
      },
      {
        key: "NAIROBI_KISUMU_NAKURU",
        location: NAKURU,
        sequence: 2,
      },
      {
        key: "NAIROBI_KISUMU_KERICHO",
        location: KERICHO,
        sequence: 3,
      },
      {
        key: "NAIROBI_KISUMU_KISUMU",
        location: KISUMU,
        sequence: 4,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Nairobi → Eldoret
  // ---------------------------------------------------------------------------

  {
    key: "NAIROBI_ELDORET",
    name: "Nairobi → Eldoret",

    origin: NAIROBI,
    destination: ELDORET,

    routes: [
      {
        key: "NAIROBI_ELDORET_NAIROBI",
        location: NAIROBI,
        sequence: 1,
      },
      {
        key: "NAIROBI_ELDORET_NAKURU",
        location: NAKURU,
        sequence: 2,
      },
      {
        key: "NAIROBI_ELDORET_ELDORET",
        location: ELDORET,
        sequence: 3,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Nairobi → Mombasa
  // ---------------------------------------------------------------------------

  {
    key: "NAIROBI_MOMBASA",
    name: "Nairobi → Mombasa",

    origin: NAIROBI,
    destination: MOMBASA,

    routes: [
      {
        key: "NAIROBI_MOMBASA_NAIROBI",
        location: NAIROBI,
        sequence: 1,
      },
      {
        key: "NAIROBI_MOMBASA_MACHAKOS",
        location: MACHAKOS,
        sequence: 2,
      },
      {
        key: "NAIROBI_MOMBASA_VOI",
        location: VOI,
        sequence: 3,
      },
      {
        key: "NAIROBI_MOMBASA_MOMBASA",
        location: MOMBASA,
        sequence: 4,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Nairobi → Nakuru
  // ---------------------------------------------------------------------------

  {
    key: "NAIROBI_NAKURU",
    name: "Nairobi → Nakuru",

    origin: NAIROBI,
    destination: NAKURU,

    routes: [
      {
        key: "NAIROBI_NAKURU_NAIROBI",
        location: NAIROBI,
        sequence: 1,
      },
      {
        key: "NAIROBI_NAKURU_NAKURU",
        location: NAKURU,
        sequence: 2,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Nairobi → Kitale
  // ---------------------------------------------------------------------------

  {
    key: "NAIROBI_KITALE",
    name: "Nairobi → Kitale",

    origin: NAIROBI,
    destination: KITALE,

    routes: [
      {
        key: "NAIROBI_KITALE_NAIROBI",
        location: NAIROBI,
        sequence: 1,
      },
      {
        key: "NAIROBI_KITALE_NAKURU",
        location: NAKURU,
        sequence: 2,
      },
      {
        key: "NAIROBI_KITALE_ELDORET",
        location: ELDORET,
        sequence: 3,
      },
      {
        key: "NAIROBI_KITALE_KITALE",
        location: KITALE,
        sequence: 4,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Nairobi → Kakamega
  // ---------------------------------------------------------------------------

  {
    key: "NAIROBI_KAKAMEGA",
    name: "Nairobi → Kakamega",

    origin: NAIROBI,
    destination: KAKAMEGA,

    routes: [
      {
        key: "NAIROBI_KAKAMEGA_NAIROBI",
        location: NAIROBI,
        sequence: 1,
      },
      {
        key: "NAIROBI_KAKAMEGA_NAKURU",
        location: NAKURU,
        sequence: 2,
      },
      {
        key: "NAIROBI_KAKAMEGA_ELDORET",
        location: ELDORET,
        sequence: 3,
      },
      {
        key: "NAIROBI_KAKAMEGA_KAKAMEGA",
        location: KAKAMEGA,
        sequence: 4,
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

export default SUPPORTED_CORRIDORS;