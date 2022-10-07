precision mediump float;
#define PI 3.14159265359

varying vec2 vUvs;



float Linear( vec2 uv ){

    return smoothstep( 0.02, 0.0, abs( uv.y - uv.x ) );

}

float Linear21( vec2 uv, float st ){

    return smoothstep( st - 0.02, st, uv.y ) - smoothstep( st, st + 0.02, uv.y );

}

float Linear22( vec2 uv, float st ){

    return smoothstep( st, st + 0.02, uv.y );

}

float Linear23( vec2 uv, float st ){

    return smoothstep( st - 0.02, st, uv.y );

}

float Linear3( vec2 uv, float xNum ){

    return smoothstep( 0.02, 0.0, abs( uv.y - xNum ) );

}

// void main()
// {

//     vec3 color = vec3( 0.0 );

//     vec3 bgColor = vec3( vUvs.x );
//     float line = Linear( vUvs );
//     vec3 lineColor = vec3( 0.0, 1.0, 0.0 );

//     color = vec3( 1.0 - line ) * bgColor + ( vec3( line ) * lineColor );
//     color = vec3( 1.0 - line ) * bgColor; // Let Middle Line Pure Black

//     //color = bgColor;

//     //color = vec3( line ) * lineColor;

    
//     gl_FragColor = vec4(color, 1.0);
// }

// void main()
// {

//     vec3 color = vec3( 0.0 );
//     float pNum = pow( vUvs.x, 5.0 );
//     vec3 bgColor  = vec3( pNum );

//     vec3 lineColor = vec3( 0.0, 1.0, 0.0 );


//     float line = Linear3( vUvs, pNum );
//     //color = vec3( line ) * lineColor;

//     color = vec3( 1.0 - line ) * bgColor + ( vec3( line ) * lineColor );

    
//     gl_FragColor = vec4(color, 1.0);


// }

void main()
{
    


    vec3 color = vec3( 0.0 );
    float pNum = pow( vUvs.x, 5.0 );
    pNum = step(0.5, vUvs.x);
    pNum = smoothstep( 0.2, 0.8, vUvs.x );
    pNum = smoothstep(0.2, 0.5, vUvs.x) - smoothstep(0.5, 0.8, vUvs.x);

    float line = Linear22( vUvs, pNum );
    float line2 = Linear23( vUvs, pNum );

    color = vec3( line2 - line );


    gl_FragColor = vec4(color, 1.0);


}