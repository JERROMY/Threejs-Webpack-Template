//Shader
import * as THREE from 'three'

import BasicVS from './components/three-main/shaders/basic/basicColor.vert'
import BasicFS from './components/three-main/shaders/basic/basicColor.frag'

import BasicLineVS from './components/three-main/shaders/basic/basicLine.vert'
import BasicLineFS from './components/three-main/shaders/basic/basicLine.frag'

import TestTex from './images/test.jpg'

//console.log( "Image URL: " + TestTex )

/*

// const BasicVS = require('./components/three-main/shaders/basic/basicColor.vert')
// const BasicFS = require('./components/three-main/shaders/basic/basicColor.frag')


*/

//console.log(BasicVS)
//console.log(BasicFS)


class ThreeData {

    BasicVS = BasicVS
    BasicFS = BasicFS

    BasicLineVS = BasicLineVS
    BasicLineFS = BasicLineFS

    BasicUniform = {
        time:{
            value: 1.0
        },
        texture:{
            value: null
        }
    }

    BasicMaterial = new THREE.RawShaderMaterial( {
    
        uniforms: this.BasicUniform,
        vertexShader: BasicLineVS,
        fragmentShader: BasicLineFS,

        //blending: THREE.AdditiveBlending,
        side:THREE.DoubleSide,
        // depthTest: false,
        // transparent: true,
        vertexColors: true

    } )
    

    constructor(){

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;