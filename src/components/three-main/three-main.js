
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SceneMgr } from '../../three-objs'


class ThreeMain {

    //camera
    scene
    renderer

    container = document.getElementById( 'container-3d' )

    aml

    dirGeo

    controls
    size = {
        w: 0,
        h: 0
    }

    


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

        console.log("Three JS Ready")
    

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 )
        this.camera.position.z = 1000 //0.35 0 1200
        this.camera.position.x = 0
        this.camera.position.y = 1000
        this.camera.lookAt( new THREE.Vector3(0, 0, 0) )


        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0x000000 );
        //this.scene.add( this.amL )


        //this.cubeGroup = new CubeGroup( this.shaderMat, this.colorMat, new Vector3(1.0 , 1.0, 0.0) );
        //this.scene.add( this.cubeGroup )

        //=======================================

        //this.axistHelper = new THREE.AxesHelper( 5 )
        //this.dirCube.add( this.axistHelper )


        this.planeGeo = new THREE.PlaneGeometry(2, 2)
        this.planeMesh = new THREE.Mesh( this.planeGeo, this.dirMat )
        this.scene.add( this.planeMesh )
        this.planeMesh.rotation.x = -Math.PI / 2
        this.planeMesh.visible = false



        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            powerPreference: "high-performance",
            precision: "highp",
            logarithmicDepthBuffer: true,
                
        })

        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.renderer.outputEncoding = THREE.sRGBEncoding
        //this.renderer.outputEncoding = THREE.sRGBEncoding
        this.container.appendChild( this.renderer.domElement )

        //this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        // this.initEvent()
        // this.onWindowResize()
        // this.animate()

        this.sceneMgr = new SceneMgr( this.threeData.SceneDataPath,  this.onSceneProcess.bind( this ), this.onSceneFinsh.bind( this ) )
        this.sceneMgr.startLoad()

        

    }


    //Scene Delegate
    onSceneProcess( p ){
        //console.log( `P: ${ p }` )
    }

    onSceneFinsh( sceneObj ){

        //console.log( this )
        console.log( "Scene Load Finish!" )

        this.scene.add( sceneObj )
    

        this.initEvent()
        this.onWindowResize()
        this.initPosition()
        this.animate()
    }

    initPosition(){

        const startObj = this.sceneMgr.startObj
        this.camera.position.set( startObj.position.x, startObj.position.y, startObj.position.z )
        

        console.log( `Start Position: ${ startObj.position.x }  ${ startObj.position.y } ${ startObj.position.z }` )


    }


    //Scene Delegate


    animate(){
        //console.log("animate")
        this.update()
        window.requestAnimationFrame( this.animate.bind( this ) )
    }

    update(){
        this.renderer.render( this.scene, this.camera )
    }

    initEvent(){
        window.addEventListener( 'resize', this.onWindowResize.bind( this ) )
    }

    onWindowResize() {


        this.size.w = window.innerWidth
        this.size.h = window.innerHeight

        console.log( this.size.w + ' ' + this.size.h )
        //console.log( this )
        //console.log( this.camera )

        this.size.asp = this.size.w / this.size.h
        this.camera.aspect = this.size.asp
        this.camera.updateProjectionMatrix()
        
        
        // const aspectRatio = this.size.w / this.size.h
        // this.camera.left = -1 * aspectRatio
        // this.camera.right = 1 * aspectRatio
        // this.camera.updateProjectionMatrix()




        this.renderer.setSize( this.size.w, this.size.h )
    
    }


    

}

export default ThreeMain