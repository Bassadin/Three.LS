export const data = `
uniform vec3 color;
uniform float time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }


void main() {
    gl_FragColor = vec4( 0.5 * sin(time * 70.0) + 0.5, color.y, color.z, 1);
}

`;
