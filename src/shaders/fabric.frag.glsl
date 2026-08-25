// src/shaders/fabric.frag.glsl
// Fragment shader — PBR fabric material with sheen, weave pattern and colourway
uniform sampler2D uAlbedoMap;
uniform sampler2D uNormalMap;
uniform sampler2D uRoughnessMap;
uniform sampler2D uSheenMap;
uniform vec3  uBaseColour;
uniform float uSheenStrength;
uniform float uTime;
uniform float uScrollProgress;
uniform float uOpacity;
uniform int   uLightPreset; // 0=daylight, 1=indoor, 2=warm

varying vec2  vUv;
varying vec3  vNormal;
varying vec3  vPosition;
varying float vElevation;

// Simple PBR sheen model (Charlie distribution approximation)
float CharlieSheen(float roughness, float NdotH) {
  float r = roughness;
  float sin2h = max(1.0 - NdotH * NdotH, 0.0078125);
  float cos2h = NdotH * NdotH;
  return (2.0 + 1.0 / r) * pow(sin2h, 0.5 / r) / (2.0 * 3.14159);
}

vec3 getLightDir() {
  // Daylight — high overhead sun angle
  if (uLightPreset == 0) return normalize(vec3(0.3, 1.0, 0.5));
  // Indoor — diffuse soft box from front-left
  if (uLightPreset == 1) return normalize(vec3(-0.4, 0.6, 0.8));
  // Warm tungsten — low-angle golden
  return normalize(vec3(0.6, 0.4, 0.3));
}

vec3 getLightColour() {
  if (uLightPreset == 0) return vec3(1.0, 0.98, 0.92);   // daylight white
  if (uLightPreset == 1) return vec3(0.85, 0.87, 1.0);   // indoor cool
  return vec3(1.0, 0.80, 0.55);                           // warm tungsten
}

void main() {
  // Sample maps
  vec4 albedo    = texture2D(uAlbedoMap, vUv) * vec4(uBaseColour, 1.0);
  vec3 normalMap = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
  float rough    = texture2D(uRoughnessMap, vUv).r;
  float sheen    = texture2D(uSheenMap, vUv).r * uSheenStrength;

  // Normal perturbation
  vec3 N = normalize(vNormal + normalMap * 0.6);
  vec3 L = getLightDir();
  vec3 V = normalize(cameraPosition - vPosition);
  vec3 H = normalize(L + V);

  float NdotL = max(dot(N, L), 0.0);
  float NdotH = max(dot(N, H), 0.0);
  float NdotV = max(dot(N, V), 0.0);

  // Diffuse
  vec3 diffuse = albedo.rgb * NdotL * getLightColour();

  // Ambient
  vec3 ambient = albedo.rgb * 0.25;

  // Sheen (fabric microfibre glint)
  float sheenD = CharlieSheen(rough, NdotH);
  vec3 sheenColor = getLightColour() * sheen * sheenD * NdotL;

  // Subtle weave highlight — cross-hatch pattern
  float weaveU = abs(sin(vUv.x * 200.0)) * 0.03;
  float weaveV = abs(sin(vUv.y * 200.0)) * 0.03;
  vec3 weaveHighlight = vec3(weaveU + weaveV) * getLightColour() * NdotL;

  // Edge darkening (fabric depth illusion)
  float edgeDark = 1.0 - pow(1.0 - NdotV, 2.5) * 0.4;

  vec3 finalColour = (diffuse + ambient + sheenColor + weaveHighlight) * edgeDark;

  // Reveal fade driven by scroll
  float alpha = uOpacity * smoothstep(0.0, 0.1, uScrollProgress);

  gl_FragColor = vec4(finalColour, alpha);
}
