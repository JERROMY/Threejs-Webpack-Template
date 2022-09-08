import Container3D from "./components/container-3d/container-3d"
import ThreeMain from "./components/three-main/three-main"
import './main.scss'


const container3D = new Container3D()
container3D.render()

const threeMain = new ThreeMain()



if (process.env.NODE_ENV === 'production') {
    console.log('Production mode')
}else{
    console.log('Development mode')
}