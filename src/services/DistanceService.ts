const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_KEY;

export const getRouteDistance = async (start: number[], end: number[]): Promise<number | null> => {
  if (!MAPBOX_TOKEN) {
    console.error('Mapbox token not found. Please set NEXT_PUBLIC_MAPBOX_KEY environment variable.');
    return null;
  }

  if (!isValidCoordinates(start) || !isValidCoordinates(end)) {
    console.error('Invalid coordinates provided:', { start, end });
    return null;
  }

  try {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    const response = await fetch(directionsUrl);
    const data = await response.json();

    if (data.code === "NoSegment" || !data.routes || data.routes.length === 0) {
      console.warn('No route found between the points:', { start, end, error: data.message });
      return null;
    }

    // Distance is in meters, convert to kilometers
    return data.routes[0].distance / 1000;
  } catch (error) {
    console.error('Error fetching route distance:', error);
    return null;
  }
};

const isValidCoordinates = (coords: number[]): boolean => {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lng, lat] = coords;
  return (
    typeof lng === 'number' && 
    typeof lat === 'number' && 
    lng >= -180 && lng <= 180 && 
    lat >= -90 && lat <= 90
  );
};