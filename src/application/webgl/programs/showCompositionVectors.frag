// vim: ts=2:sw=2

precision mediump float;
varying mediump vec4 vColor;
varying mediump vec4 vCircle;
varying mediump vec2 vViewport;

void main(void) {
  vec2 screenPos = ((gl_FragCoord.xy / (vViewport / 2.0)) - 1.0);

  float distX = abs(vCircle.x - screenPos.x) / vCircle.z;
  if (distX > 1.0 || distX < -1.0) discard;
  float distY = abs(vCircle.y - screenPos.y) / vCircle.a;
  if (distY > 1.0 || distY < -1.0) discard;

  vec2 quadPos = vec2(distX, distY);
  float distSquared = dot(quadPos, quadPos);

  if (distSquared > 1.0) discard;

  gl_FragColor = vec4(vColor.rgb * vColor.a, vColor.a);
}