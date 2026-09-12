export function circleIntersect(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const radiusSum = a.radius + b.radius;
  return dx * dx + dy * dy <= radiusSum * radiusSum;
}

export function circleContainsPoint(circle, px, py) {
  const dx = circle.x - px;
  const dy = circle.y - py;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}
