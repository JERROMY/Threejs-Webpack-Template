//Shader
import * as THREE from 'three'

import BasicVS from './components/three-main/shaders/basic/basicColor.vert'
import BasicFS from './components/three-main/shaders/basic/basicColor.frag'

import nx from './images/nx.png'
import ny from './images/ny.png'
import nz from './images/nz.png'
import px from './images/px.png'
import py from './images/py.png'
import pz from './images/pz.png'



import SceneDataPath from './data/main_scene.json'

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

    SceneDataPath = SceneDataPath
    LoadingDiv

    SceneBg = {
        'nx': nx,
        'ny': ny,
        'nz': nz,
        'px': px,
        'py': py,
        'pz': pz
    }
    

    constructor(){

        console.log( this.SceneDataPath )

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;