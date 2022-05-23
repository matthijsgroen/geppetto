// vim: ts=2:sw=2

precision mediump float;

varying mediump vec2 vTextureCoord;
varying lowp float vOpacity;
varying lowp float vBrightness;
varying lowp float vSaturation;
varying lowp float vTargetHue;
varying lowp float vTargetSaturation;

uniform sampler2D uSampler;
uniform mediump vec2 uTextureDimensions;

float RGBToL(vec3 color) {
  lowp float fmin = min(min(color.r, color.g), color.b);    //Min. value of RGB
  lowp float fmax = max(max(color.r, color.g), color.b);    //Max. value of RGB

  return (fmax + fmin) / 2.0; // Luminance
}

float HueToRGB(lowp float f1, lowp float f2, lowp float hue) {
  if (hue < 0.0)
      hue += 1.0;
  else if (hue > 1.0)
      hue -= 1.0;
  lowp float res;
  if ((6.0 * hue) < 1.0)
      res = f1 + (f2 - f1) * 6.0 * hue;
  else if ((2.0 * hue) < 1.0)
      res = f2;
  else if ((3.0 * hue) < 2.0)
      res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
      res = f1;
  return res;
}

vec3 HSLToRGB(vec3 hsl) {
  lowp vec3 rgb;

  if (hsl.y == 0.0)
      rgb = vec3(hsl.z); // Luminance
  else {
      lowp float f2;
      if (hsl.z < 0.5)
          f2 = hsl.z * (1.0 + hsl.y);
      else
          f2 = (hsl.z + hsl.y) - (hsl.y * hsl.z);
      float f1 = 2.0 * hsl.z - f2;

      rgb.r = HueToRGB(f1, f2, hsl.x + (1.0/3.0));
      rgb.g = HueToRGB(f1, f2, hsl.x);
      rgb.b = HueToRGB(f1, f2, hsl.x - (1.0/3.0));
  }

  return rgb;
}

void main(void) {
  highp vec2 coord = vTextureCoord.xy / uTextureDimensions;
  mediump vec4 texelColor = texture2D(uSampler, coord);

  vec3 color = texelColor.rgb;

  float luminance = RGBToL(color);
  color = mix(
    mix(
      color,
      HSLToRGB(vec3(vTargetHue, vTargetSaturation, luminance)),
      1.0 - vSaturation
    ) * clamp(vBrightness, 0.0, 1.0), 
    vec3(1., 1., 1.), 
    clamp(vBrightness - 1.0, 0.0, 1.0)
  );

  gl_FragColor = vec4(color * texelColor.a * vOpacity, texelColor.a * vOpacity);
}