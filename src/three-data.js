//Shader
import * as THREE from 'three'

import BasicVS from './components/three-main/shaders/basic/basicColor.vert'
import BasicFS from './components/three-main/shaders/basic/basicColor.frag'

import ColorVS from './components/three-main/shaders/basic/color.vert'
import ColorFS from './components/three-main/shaders/basic/color.frag'

import BasicLineVS from './components/three-main/shaders/basic/basicLine.vert'
import BasicLineFS from './components/three-main/shaders/basic/basicLine.frag'

import TextureColorVS from './components/three-main/shaders/basic/textureColor.vert'
import TextureColorFS from './components/three-main/shaders/basic/textureColor.frag'

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

    TextureColorVS = TextureColorVS;
    TextureColorFS = TextureColorFS;

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

    ColorUniform2 = {
        time:{
            value: 1.0
        },
        h:{
            value: 0
        },
        mainColor:{
            value: new THREE.Vector3(1, 0, 0)
        }
    }

    TextureUniform = {
        time:{
            value: 1.0
        },
        mainColor:{
            value: new THREE.Vector3(0, 1, 0)
        },
        diffuseMap:{
            value: null
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

    ColorMaterial2 = new THREE.RawShaderMaterial( {
    
        uniforms: this.ColorUniform2,
        vertexShader: ColorVS,
        fragmentShader: ColorFS,

        //blending: THREE.AdditiveBlending,
        side:THREE.BackSide,
        // depthTest: false,
        transparent: true,
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

    TextureMaterial = new THREE.RawShaderMaterial( {
    
        uniforms: this.TextureUniform,
        vertexShader: TextureColorVS,
        fragmentShader: TextureColorFS,

        //blending: THREE.AdditiveBlending,
        side:THREE.BackSide,
        // depthTest: false,
        transparent: true,
        // depthWrite: false,
        // vertexColors: true

    } )
    

    constructor(){

        console.log( this.SceneDataPath )

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;