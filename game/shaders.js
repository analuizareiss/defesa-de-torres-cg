export const vertexShaderSource = `#version 300 es
in vec2 a_position;

uniform mat3 u_matrix;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform vec4 u_color;
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;
