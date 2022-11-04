precision mediump float;
#define PI 3.14159265359


uniform vec3 mainColor;
uniform float time;

float rand(float t)
{
    return fract(sin(dot(vec2(t,t) ,vec2(12.9898,78.233))) * 43758.5453);
}



void main()
{
    
    float t = time;

    //vec3 color = vec3( 0.0 );
    vec3 color = mainColor;

    gl_FragColor = vec4(color, 1.0);


}