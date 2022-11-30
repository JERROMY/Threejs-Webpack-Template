
import * as THREE from 'three'

import { SceneMgr } from '../../three-objs'
import { Controls } from '../../three-controls-custom'
import gsap from "gsap"


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

    startFOV = 70
    targetFOV = 55

    intersection = {
        intersects: false,
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
    }

    isLoading = false

    initTween
    fovTween

    cubeRenderTarget
    cubeCamera
    cubeMat
    sphere

    mainCamera


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

        console.log("Three JS Ready")
    

        this.camera = new THREE.PerspectiveCamera( this.startFOV, window.innerWidth / window.innerHeight, 0.01, 6000 )
        this.camera.position.z = 1000 //0.35 0 1200
        this.camera.position.x = 0
        this.camera.position.y = 1000
        //this.camera.rotation.y = -Math.PI / 2
        this.camera.lookAt( new THREE.Vector3(0, 0, 0) )


        this.scene = new THREE.Scene()
        this.scene.visible = true
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.add( this.camera )
    

        // this.sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 100, 8 ), this.cubeMat );
        // this.scene.add( this.sphere );
        // this.sphere.position.y = 800

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            powerPreference: "high-performance",
            precision: "highp",
            debug: false,
            logarithmicDepthBuffer: true,
                
        })

        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.renderer.outputEncoding = THREE.sRGBEncoding
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        //this.renderer.toneMappingExposure = 1.0
        this.container.appendChild( this.renderer.domElement )
        
        this.controls = null

        this.sceneMgr = new SceneMgr( this.threeData.SceneDataPath,  this.onSceneProcess.bind( this ), this.onSceneFinsh.bind( this ) )
        this.sceneMgr.startLoad()

        

    }

    addEnvEffect(){

        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 )
        this.cubeRenderTarget.texture.type = THREE.HalfFloatType

        this.cubeCamera = new THREE.CubeCamera( 500, 10000, this.cubeRenderTarget )

        this.cubeMat = new THREE.MeshStandardMaterial( {
            envMap: this.cubeRenderTarget.texture,
            color: 0xffffff,
            roughness: 0.05,
            metalness: 1
        } )

    }

    startMoveFov(){

        if(this.fovTween != null){
            this.fovTween.kill();
        }


        this.fovTween = gsap.to( this.camera, { 
            fov: this.targetFOV,
            delay: 0.1,
            duration: 2.0, 
            ease: "cubic.inout",
            onUpdate: this.moveCameraFovUpdate,
            onComplete: this.moveCameraFovComplete, 
            onUpdateParams: [ this ],
            onCompleteParams: [ this ],
        })
    }

    initCamera(){

        if(this.initTween != null){
            this.initTween.kill();
        }


        this.initTween = gsap.to( this.camera.rotation, {
            x: 0, 
            y: Math.PI/2, 
            z: 0, 
            duration: 2.0, 
            ease: "cubic.inout", 
            onComplete: this.moveCameraComplete, 
            onCompleteParams: [ this ],
        })
    }

    moveCameraComplete( p ){

        p.camera.rotation.y = 0
        p.init()
        p.isLoading = true
        p.threeData.LoadingDiv.hide()
        p.scene.visible = true
        //p.sceneMgr.addCenterEffect( p.cubeMat )
        //p.threeData.CoverDiv.hide()
        
    }

    moveCameraFovComplete( p ){
        p.controls.initEvent()
    }

    moveCameraFovUpdate( p ){
        p.camera.updateProjectionMatrix()
    }


    //Scene Delegate
    onSceneProcess( p ){
        this.threeData.LoadingDiv.text( `${ p } %` )
        //console.log( `P: ${ p }` )
    }

    onSceneFinsh( sceneObj ){

        

        //console.log( this )
        console.log( "Scene Load Finish!" )

        this.scene.add( sceneObj )
    
        this.initEvent()
        this.onWindowResize()
        this.animate()
        
        this.threeData.LoadingDiv.hide()
        this.init()
        this.isLoading = true

        
    }

    //Control Delegate
    onPtMove( intersect ){

        this.sceneMgr.updatePin( intersect, 'Move' )
        
    }

    onPtChoose( intersect, chooseType ){
        
        const hitObjName = intersect.object.name

        switch ( chooseType ) {
            case 'floor':
                
                this.sceneMgr.updatePin( intersect, 'Down' )
                //console.log( hitObjName )

                break;

            case 'obj':

                this.sceneMgr.hitSel( intersect, 'Down' )
                
                break;
        
            default:
                break;
        }


       
        
    }


    init(){

        

        const startObj = this.sceneMgr.startObj
        const aimObj = this.sceneMgr.aimHelper
        const targetObj = this.sceneMgr.targetHelper
        const followObj = this.sceneMgr.followHelper

        this.controls = new Controls( this.camera, this.renderer, this.scene, this.size, this.onPtMove.bind( this ), this.onPtChoose.bind( this ), startObj, aimObj, targetObj, followObj )
        this.controls.rayCasterObjs = this.sceneMgr.floorObjs
        this.controls.rayCasterObjs = this.controls.rayCasterObjs.concat( this.sceneMgr.selectObjs )
        this.controls.initControls()
        

        //this.startMoveFov()
        

        

        console.log( `Start Position: ${ startObj.position.x }  ${ startObj.position.y } ${ startObj.position.z }` )


    }



    //Scene Delegate


    animate(){
        //console.log("animate")
        this.update()
        window.requestAnimationFrame( this.animate.bind( this ) )
    }

    update(){

        


        if( this.isLoading ){
            
            this.controls.update()
            //this.sceneMgr.updateSelect()
            //this.sceneMgr.updateCenter()
            //this.cubeCamera.update( this.renderer, this.scene )

        }


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