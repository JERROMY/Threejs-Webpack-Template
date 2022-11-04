
import Container3D from "./components/container-3d/container-3d"
import Container2D from "./components/container-2d/container-2d"
import ThreeData from "./three-data"
import ThreeMain from "./components/three-main/three-main"
import './main.scss'

const container3D = new Container3D()
container3D.render()

// const container2D = new Container2D()
// container2D.render()

const threeData = new ThreeData()
const threeMain = new ThreeMain(threeData)


if (process.env.NODE_ENV === 'production') {
    console.log('Production mode')
}else{
    console.log('Development mode')
}