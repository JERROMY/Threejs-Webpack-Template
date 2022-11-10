uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float time;
uniform float h;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;


void main()
{   
    
    //vec3 posi = position + ( normalize( vec3( position.x, position.y - h, position.z ) ) * 0.3 );
    //vec3 centerY = vec3( 0, 0, 0 );
    //vec3 posi = position + normal * 0.1;
    
    float scaleNum = 1.03;
    vec3 posi = position * scaleNum;
    float s = h * scaleNum;
    posi.y -= ( s - h ) * 0.5;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(posi, 1.0);
}