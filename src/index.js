import './main.scss'
import Container3D from "./components/container-3d/container-3d"


import $ from 'jquery'
import ThreeData from "./three-data"
import ThreeMain from "./components/three-main/three-main"


const container3D = new Container3D()
container3D.render()


const threeData = new ThreeData()
const threeMain = new ThreeMain(threeData)

initEvent()

function initEvent(){

    $( '#start-button' ).on( "click", clickStart )
      
    $( '#stop-button' ).on( "click", clickStop )


}

function clickStart(){
    //alert( 'Start' )
    threeMain.startAR()
}

function clickStop(){
    //alert( 'Stop' )
    threeMain.stopAR()
}


if (process.env.NODE_ENV === 'production') {
    console.log('Production mode')
}else{
    console.log('Development mode')
}