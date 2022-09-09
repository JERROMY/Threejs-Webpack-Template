//Shader
import BasicVS from './components/three-main/shaders/basic/basicColor.vert'
import BasicFS from './components/three-main/shaders/basic/basicColor.frag'

import RndImg from './images/rnd.png'

/*

// const BasicVS = require('./components/three-main/shaders/basic/basicColor.vert')
// const BasicFS = require('./components/three-main/shaders/basic/basicColor.frag')


*/

//console.log(BasicVS)
//console.log(BasicFS)


class ThreeData {

    BasicVS = BasicVS
    BasicFS = BasicFS

    RndTex = RndImg

    BasicShaderUniforms = {
        iChannel0: { value: null },
        iTime: { value: 0 },
        iResolution:  { value: null },
    }

    
    

    constructor(){

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;