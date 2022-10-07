precision mediump float;

varying vec2 vUvs;

void main()
{

    vec3 color = vec3( 0.0 );

    float value1 = vUvs.x;
    float value2 = smoothstep( 0.0, 1.0, vUvs.x );

    vec3 red = vec3( 1.0, 0.0, 0.0 );
    vec3 blue = vec3( 0.0, 0.0, 1.0 );
    vec3 white = vec3( 1.0, 1.0, 1.0 );

    //vec3 color = vec3( vUvs.x );
    //color = vec3( step( 0.25, vUvs.x ) );
    //color = mix( red, blue, smoothstep( 0.0, 1.0, vUvs.x ) );
    //color = vec3( smoothstep( 0.0, 1.0, vUvs.x ) );
    //color = vec3( vUvs.x );
    //color = vec3(  )

    float line = abs( vUvs.y - 0.5 );
    line = ( vUvs.y );
    line = vUvs.y - 0.5;
    line = abs( vUvs.y - 0.5 );
    line = smoothstep( 0.0, 1.0, vUvs.y );
    line = mix( 0.0, 0.5, smoothstep( 0.0, 1.0, vUvs.y ) );
    
    //line = ( vUvs.y );

    //line = smoothstep( 0.0, 0.005, abs( vUvs.y - mix( 0.0, 1.0, vUvs.x ) )); //  -0.5 > y > 0.5   0.5 y 0.5


    //line = smoothstep( 0.0, 1.0, vUvs.y );
    //line = mix( 0.0, 1.0, vUvs.y );

    // float line = smoothstep( 0.0, 0.005, abs( vUvs.y - 0.5 ) );
    // float linearLine = smoothstep( 0.0, 0.0075, abs( vUvs.y - mix( 0.5, 1.0, value1 )) );
    // float smoothLine = smoothstep( 0.0, 0.0075, abs( vUvs.y - mix( 0.0, 0.5, value2 )) );

    // if( vUvs.y > 0.5 ){
    //     color = mix( red, blue, vUvs.x );
    // }else{
    //     color = mix( red, blue, smoothstep( 0.0, 1.0, vUvs.x ) );
    // }

    // color = mix( white, color, line );
    // color = mix( white, color, linearLine );
    // color = mix( white, color, smoothLine );
    color = vec3( line );

    //color = vec3( linearLine );
    
    
    gl_FragColor = vec4(color, 1.0);
}