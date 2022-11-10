precision mediump float;
#define PI 3.14159265359

uniform sampler2D diffuseMap;
uniform vec3 mainColor;
uniform float time;

varying vec2 vUv;

float rand(float t)
{
    return fract(sin(dot(vec2(t,t) ,vec2(12.9898,78.233))) * 43758.5453);
}



void main()
{
    
    float t = time;

    vec4 diffuseColor = texture2D( diffuseMap,  vUv );

    //vec3 color = vec3( 0.0 );
    vec3 color = diffuseColor.rgb;

    gl_FragColor = vec4(color, 1.0);


}