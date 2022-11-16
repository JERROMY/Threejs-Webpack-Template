//Shader

import Basic_VS from './components/three-main/shaders/basic/basicColor.vert'
import Basic_FS from './components/three-main/shaders/basic/basicColor.frag'

import TestARCard_Mind from './data/TestARCard.mind'
import TestARCard_Img from './data/TestARCard.png'

// console.log( TestARCard_Mind )
// console.log( TestARCard_Img )

/*

// const BasicVS = require('./components/three-main/shaders/basic/basicColor.vert')
// const BasicFS = require('./components/three-main/shaders/basic/basicColor.frag')


*/

//console.log(BasicVS)
//console.log(BasicFS)


class ThreeData {

    BasicVS = Basic_VS
    BasicFS = Basic_FS

    TestARCardMind = TestARCard_Mind
    TestARCardImg = TestARCard_Img
    

    constructor(){

        //console.log(this.BasicVS);
        //console.log(this.BasicFS);

    }


}

export default ThreeData;