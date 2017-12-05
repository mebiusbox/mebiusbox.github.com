uniform vec3 lightDir;
uniform vec3 lightColor;
varying vec3 vPosition;
varying vec3 vNormal;
void main() {
  vec3 P = -vPosition;
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vPosition);
  
  float dotNL = max(dot(N,lightDir),0.0);
  vec3 diffuse = dotNL * lightColor;
  gl_FragColor = vec4(diffuse, 1.0);
}