uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float time;

attribute vec3 position;
attribute vec2 uv;


void main()
{   
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}