//Shader

import BasicVS from './components/three-main/shaders/basic/basicColor.vert'
import BasicFS from './components/three-main/shaders/basic/basicColor.frag'

import BasicLineVS from './components/three-main/shaders/basic/basicLine.vert'
import BasicLineFS from './components/three-main/shaders/basic/basicLine.frag'

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
    

    constructor(){

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;