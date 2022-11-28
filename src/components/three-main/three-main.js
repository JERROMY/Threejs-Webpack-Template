
import * as THREE from 'three'

import { SceneMgr } from '../../three-objs'
import { Controls } from '../../three-controls'
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

    intersection = {
        intersects: false,
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
    }

    isLoading = false

    initTween

   


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

        console.log("Three JS Ready")
    

        this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.01, 6000 )
        this.camera.position.z = 0 //0.35 0 1200
        this.camera.position.x = 0
        this.camera.position.y = 5000
        this.camera.rotation.y = -Math.PI / 2
        this.camera.lookAt( new THREE.Vector3(0, 10000, 0) )


        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0x000000 );
        //this.scene.add( this.amL )


        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            powerPreference: "high-performance",
            precision: "highp",
            logarithmicDepthBuffer: true,
                
        })

        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.container.appendChild( this.renderer.domElement )
        
        this.controls = null

        this.sceneMgr = new SceneMgr( this.threeData.SceneDataPath,  this.onSceneProcess.bind( this ), this.onSceneFinsh.bind( this ) )
        this.sceneMgr.startLoad()

        

    }

    initCamera(){

        if(this.initTween != null){
            this.initTween.kill();
        }


        this.initTween = gsap.to( this.camera.rotation, {
            x: 0, 
            y: Math.PI/2, 
            z: 0, 
            duration: 1.0, 
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
        this.initCamera()
        

        // this.init()
        
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
        this.controls.initEvent()
        

        

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
            this.sceneMgr.updateSelect()
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