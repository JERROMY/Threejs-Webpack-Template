//Shader
import * as THREE from 'three'

import BasicVS from './components/three-main/shaders/basic/basicColor.vert'
import BasicFS from './components/three-main/shaders/basic/basicColor.frag'

import ColorVS from './components/three-main/shaders/basic/color.vert'
import ColorFS from './components/three-main/shaders/basic/color.frag'

import BasicLineVS from './components/three-main/shaders/basic/basicLine.vert'
import BasicLineFS from './components/three-main/shaders/basic/basicLine.frag'

import TestTex from './images/test.jpg'

import SceneDataPath from './data/main.json'

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

    ColorVS = ColorVS;
    ColorFS = ColorFS;

    TexturePath = TestTex

    SceneDataPath = SceneDataPath

    

    BasicUniform = {
        time:{
            value: 1.0
        },
        texture:{
            value: null
        }
    }

    ColorUniform = {
        time:{
            value: 1.0
        },
        mainColor:{
            value: new THREE.Vector3(0, 1, 0)
        }
    }

    ColorMaterial = new THREE.RawShaderMaterial( {
    
        uniforms: this.ColorUniform,
        vertexShader: ColorVS,
        fragmentShader: ColorFS,

        //blending: THREE.AdditiveBlending,
        side:THREE.DoubleSide,
        // depthTest: false,
        transparent: true,
        depthWrite: false,
        // vertexColors: true

    } )

    BasicMaterial = new THREE.RawShaderMaterial( {
    
        uniforms: this.BasicUniform,
        vertexShader: BasicLineVS,
        fragmentShader: BasicLineFS,

        //blending: THREE.AdditiveBlending,
        side:THREE.DoubleSide,
        // depthTest: false,
        transparent: true,
        depthWrite: false,
        // vertexColors: true

    } )
    

    constructor(){

        console.log( this.SceneDataPath )

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;