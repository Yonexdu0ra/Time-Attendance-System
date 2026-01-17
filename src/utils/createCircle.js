function createCircle(
  center, // [lng, lat]
  radius = 100,
  points = 64,
) {
  const coords = [];
  const [lng, lat] = center;
  const R = 6378137;

  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);

    const newLng =
      lng + ((dx / R) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
    const newLat = lat + (dy / R) * (180 / Math.PI);

    coords.push([newLng, newLat]);
  }

  coords.push(coords[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

export default createCircle;