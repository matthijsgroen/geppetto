// vim: ts=2:sw=2

precision mediump float;

uniform vec2 uImageSize;
uniform vec4 uBorderColor;
uniform float uBorderWidth;
uniform vec2 uDropShadowOffset;
uniform float uDropShadowBlur;

varying vec2 vPosition;

void main(void) {
  vec2 halfSize = uImageSize * 0.5;
  
  // Calculate distance from the border rectangle edge
  vec2 distFromEdge = abs(vPosition) - halfSize;
  
  // Distance to the border edge (positive = outside, negative = inside)
  float distToBorder = max(distFromEdge.x, distFromEdge.y);
  
  // Calculate border line (1.0 on the line, 0.0 elsewhere)
  float borderLine = smoothstep(uBorderWidth, 0.0, abs(distToBorder));
  
  // Calculate drop shadow position
  vec2 shadowPos = vPosition - uDropShadowOffset;
  vec2 shadowDistFromEdge = abs(shadowPos) - halfSize;
  float distToShadowBorder = max(shadowDistFromEdge.x, shadowDistFromEdge.y);
  
  // Shadow is visible just outside the border
  float shadow = smoothstep(0.0, uDropShadowBlur, -distToShadowBorder) * 
                 smoothstep(-uDropShadowBlur, 0.0, distToShadowBorder);
  shadow *= 0.3; // Shadow opacity
  
  // Combine border and shadow
  float alpha = max(shadow, borderLine);
  
  // Discard fully transparent pixels to avoid affecting composition
  if (alpha < 0.01) {
    discard;
  }
  
  vec4 color = vec4(0.0);
  color = mix(color, vec4(0.0, 0.0, 0.0, shadow), shadow);
  color = mix(color, uBorderColor, borderLine);
  
  gl_FragColor = color;
}
