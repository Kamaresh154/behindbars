"use client";
// src/components/experience/FabricMesh.tsx
// The primary 3D fabric plane — uses custom GLSL shaders for cloth simulation,
// PBR materials (albedo, normal, roughness, sheen) and colourway switching.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  PlaneGeometry, ShaderMaterial, DoubleSide,
  DataTexture, RGBAFormat, UnsignedByteType,
} from "three";
import type { ShaderMaterial as ShaderMaterialType, Texture } from "three";
import type { Mesh } from "three";
import { useSceneStore } from "@/stores/useSceneStore";

// ── Inline GLSL shaders (defined below) ────────────────────────────────────
const vertShader = `
uniform float uTime;
uniform float uWindStrength;
uniform float uWindFrequency;
uniform float uScrollProgress;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vElevation;

// Simplex noise helpers (inline for portability)
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+2.*C.xxx;
  vec3 x3=x0-0.5;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  vec4 x=2.*fract(p*vec4(1./41.))-1.;
  vec4 h=abs(x)-0.5;
  vec4 ox=floor(x+0.5);
  vec4 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g0=vec3(a0.xy,h.x);
  vec3 g1=vec3(a0.zw,h.y);
  vec3 g2=vec3(a0.xy+vec2(a0.z,h.z),h.z); // simplified
  vec3 g3=vec3(a0.zw+vec2(a0.w,h.w),h.w);
  return 130.*dot(m*m,vec4(dot(g0,x0),dot(g1,x1),dot(g2,x2),dot(g3,x3)));
}

void main(){
  vUv=uv; vNormal=normal;
  vec3 pos=position;
  float drape=snoise(vec3(pos.x*2.,pos.z*2.,uTime*.3))*uWindStrength;
  float ripple=sin(pos.x*uWindFrequency+uTime*1.5)*cos(pos.z*uWindFrequency*.7+uTime*1.2)*.015;
  float gravity=1.-uv.y;
  pos.y+=drape*gravity*.08;
  pos.z+=ripple*gravity;
  pos.x+=ripple*gravity*.5;
  float unfurl=smoothstep(0.,0.6,uScrollProgress);
  pos.z+=(1.-unfurl)*(1.-uv.y)*.6;
  vElevation=drape;
  vPosition=(modelMatrix*vec4(pos,1.)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}
`;

const fragShader = `
uniform sampler2D uAlbedoMap;
uniform sampler2D uNormalMap;
uniform sampler2D uRoughnessMap;
uniform sampler2D uSheenMap;
uniform vec3  uBaseColour;
uniform float uSheenStrength;
uniform float uOpacity;
uniform int   uLightPreset;
varying vec2  vUv;
varying vec3  vNormal;
varying vec3  vPosition;
varying float vElevation;

float CharlieSheen(float roughness,float NdotH){
  float sin2h=max(1.-NdotH*NdotH,.0078);
  return(2.+1./roughness)*pow(sin2h,.5/roughness)/(2.*3.14159);
}

vec3 getLightDir(){
  if(uLightPreset==0) return normalize(vec3(.3,1.,.5));
  if(uLightPreset==1) return normalize(vec3(-.4,.6,.8));
  return normalize(vec3(.6,.4,.3));
}
vec3 getLightColour(){
  if(uLightPreset==0) return vec3(1.,.98,.92);
  if(uLightPreset==1) return vec3(.85,.87,1.);
  return vec3(1.,.80,.55);
}

void main(){
  vec4 albedo=texture2D(uAlbedoMap,vUv)*vec4(uBaseColour,1.);
  float rough=texture2D(uRoughnessMap,vUv).r;
  float sheen=texture2D(uSheenMap,vUv).r*uSheenStrength;
  vec3 N=normalize(vNormal);
  vec3 L=getLightDir();
  vec3 V=normalize(cameraPosition-vPosition);
  vec3 H=normalize(L+V);
  float NdotL=max(dot(N,L),0.);
  float NdotH=max(dot(N,H),0.);
  float NdotV=max(dot(N,V),0.);
  vec3 diffuse=albedo.rgb*NdotL*getLightColour();
  vec3 ambient=albedo.rgb*.25;
  float sheenD=CharlieSheen(rough,NdotH);
  vec3 sheenColor=getLightColour()*sheen*sheenD*NdotL;
  float weaveU=abs(sin(vUv.x*200.))*.03;
  float weaveV=abs(sin(vUv.y*200.))*.03;
  vec3 weaveHighlight=vec3(weaveU+weaveV)*getLightColour()*NdotL;
  float edgeDark=1.-pow(1.-NdotV,2.5)*.4;
  vec3 finalColour=(diffuse+ambient+sheenColor+weaveHighlight)*edgeDark;
  float alpha=uOpacity;
  gl_FragColor=vec4(finalColour,alpha);
}
`;

interface FabricMeshProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  scrollProgress: number;
  colourHex?: string;
  lightPreset?: 0 | 1 | 2;
}

export function FabricMesh({
  position = [0, 0, 0],
  scale = [2, 3, 1],
  scrollProgress,
  colourHex = "#c9a84c",
  lightPreset = 0,
}: FabricMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef  = useRef<ShaderMaterialType>(null);

  // ── Programmatic 1×1 placeholder textures ──────────────────────────────
  // Avoids 404 crashes when real PBR textures haven't been added yet.
  // Replace with real TextureLoader calls once you drop files into
  // public/textures/fabric/ (albedo.jpg, normal.jpg, roughness.jpg, sheen.jpg)
  const { albedo, normalMap, roughness, sheenMap } = useMemo(() => {
    const make1x1 = (r: number, g: number, b: number, a = 255): Texture => {
      const data = new Uint8Array([r, g, b, a]);
      const tex  = new DataTexture(data, 1, 1, RGBAFormat, UnsignedByteType);
      tex.needsUpdate = true;
      return tex as unknown as Texture;
    };
    return {
      albedo:    make1x1(255, 255, 255), // white — tinted by uBaseColour
      normalMap: make1x1(128, 128, 255), // flat normal
      roughness: make1x1(180, 180, 180), // medium rough
      sheenMap:  make1x1(220, 220, 220), // light sheen
    };
  }, []);

  // Parse colour hex to RGB vec3
  const baseColour = useMemo(() => {
    const hex = colourHex.replace("#", "");
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }, [colourHex]);

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uWindStrength:   { value: 0.15 },
    uWindFrequency:  { value: 4.0 },
    uScrollProgress: { value: 0 },
    uAlbedoMap:      { value: albedo },
    uNormalMap:      { value: normalMap },
    uRoughnessMap:   { value: roughness },
    uSheenMap:       { value: sheenMap },
    uBaseColour:     { value: baseColour },
    uSheenStrength:  { value: 0.8 },
    uOpacity:        { value: 0 },
    uLightPreset:    { value: lightPreset },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uScrollProgress.value = scrollProgress;
    // Fade in
    matRef.current.uniforms.uOpacity.value +=
      (1 - matRef.current.uniforms.uOpacity.value) * 0.03;
    // Update light preset
    matRef.current.uniforms.uLightPreset.value = lightPreset;
    // Update colour
    matRef.current.uniforms.uBaseColour.value = baseColour;
  });

  // High-segment plane for smooth cloth simulation
  const geometry = useMemo(
    () => new PlaneGeometry(1, 1, 64, 96),
    []
  );

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
}
