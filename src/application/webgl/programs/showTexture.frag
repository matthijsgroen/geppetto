
precision mediump float;

varying mediump vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform mediump vec2 uTextureDimensions;
uniform mediump vec3 backgroundColor;

void main(void) {
  highp vec2 coord = vTextureCoord.xy / uTextureDimensions;
  mediump vec4 texelColor = texture2D(uSampler, coord);

  int xRow = int(mod(gl_FragCoord.x / 20.0, 2.0));
  int yRow = int(mod(gl_FragCoord.y / 20.0, 2.0));
  vec3 baseColor = backgroundColor;
  if (xRow == 1 && yRow == 1 || xRow == 0 && yRow == 0) {
    baseColor *= 0.9;
  }

  lowp vec4 backColor = vec4(baseColor, 1.0);

  gl_FragColor = backColor * (1.0-texelColor.a) + vec4(texelColor.rgb * texelColor.a, texelColor.a);
}