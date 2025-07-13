export interface Poi {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    cuisine?: string;
  };
}

export const fetchPois = async (bounds: L.LatLngBounds): Promise<Poi[]> => {
  const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;

  // This is a query written in the Overpass QL language.
  // It looks for nodes tagged as restaurant, cafe, or fast_food within the map's bounding box (bbox).
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food"](${bbox});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch POI data from Overpass API");
  }

  const data = await response.json();
  return data.elements;
};
