export function getDistanceInMeters(
  pos1: [number, number],
  pos2: [number, number]
): number {
  const R = 6371e3; // Earth's radius in meters
  const lat1 = (pos1[0] * Math.PI) / 180;
  const lat2 = (pos2[0] * Math.PI) / 180;
  const deltaLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
  const deltaLon = ((pos2[1] - pos1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
