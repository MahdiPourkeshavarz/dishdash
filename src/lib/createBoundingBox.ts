import * as L from "leaflet";

export function createBoundingBox(
  center: L.LatLng,
  sizeInMeters: number
): L.LatLngBounds {
  const earthRadius = 6378137;
  const radiusInMeters = sizeInMeters / 2;

  const latRadian = (radiusInMeters / earthRadius) * (180 / Math.PI);

  const lngRadian =
    (radiusInMeters / (earthRadius * Math.cos(center.lat * (Math.PI / 180)))) *
    (180 / Math.PI);

  const southWest = L.latLng(center.lat - latRadian, center.lng - lngRadian);
  const northEast = L.latLng(center.lat + latRadian, center.lng + lngRadian);

  return L.latLngBounds(southWest, northEast);
}
