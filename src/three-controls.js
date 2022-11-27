import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Utils } from './utils'
import gsap from "gsap"

export class Controls {

    rayCaster = new THREE.Raycaster()
    rayCasterObjs = []

    pointer = new THREE.Vector2()
    distCameraFromTarget = 0.01

    ptIsDown = false
    ptIsUp = false


   

    isStartMoveCamera = false
    isDebug = false


    camera_tween
    follower_tween
    time = { t:0 };

    constructor( camera, renderer, scene, size, onPtMove, onPtChoose, startObj, aimObj, targetObj, followObj ) {
        
        this.size = size
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.startObj = startObj
        this.targetObj = targetObj
        this.followObj = followObj
        this.aimObj = aimObj

        this.lookAtObj = null

        this.delegate = {
            onPtMove: onPtMove,
            onPtChoose: onPtChoose,
        }
        
        this.centerPosi = new THREE.Vector3(0, 0, 0)
        this.followPosi = new THREE.Vector3()

    }

    initControls(){

        this.centerPosi.set( 0, this.startObj.position.y, 0 )
        this.aimObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z - this.distCameraFromTarget )
        this.followObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z - this.distCameraFromTarget )
        this.followObj.lookAt( this.centerPosi )
        
        this.followObj.followCube.getWorldPosition( this.followPosi )

        if( !this.isDebug ){
            this.camera.position.set( this.followPosi.x, this.followPosi.y, this.followPosi.z )
            this.initOrbit()
        }
       
        


    }

    initOrbit(){
        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.target = this.followObj.position
        this.controls.minDistance = this.followObj.distCameraFromTarget
        this.controls.maxDistance = this.followObj.distCameraFromTarget
        // //controls.enablePan = true;
        this.controls.saveState()
        this.controls.reset()
    }

    update(){

        if( this.controls != null ){
            this.controls.update();
        }

        if( this.isStartMoveCamera ){

            // if( !this.isDebug ){
                
            //     const startRotation = this.camera.quaternion.clone()
            //     this.camera.lookAt( this.lookAtObj.position )
            //     const endRotation = this.camera.quaternion.clone()
            //     this.camera.applyQuaternion(startRotation)
            //     this.camera.quaternion.slerpQuaternions(startRotation, endRotation, 0.3);
            // } else {
            //     this.aimObj.position.set( this.followPosi.x, this.followPosi.y, this.followPosi.z )
            //     const startRotation = this.aimObj.quaternion.clone()
            //     this.aimObj.lookAt( this.lookAtObj.position )
            //     const endRotation = this.aimObj.quaternion.clone()
            //     this.aimObj.applyQuaternion(startRotation)
            //     this.aimObj.quaternion.slerpQuaternions(startRotation, endRotation, 0.3);
            // }



        }

        //console.log( "Move!" )

    }

    startLookAtCamera(){

        this.time = { t:0 };

        if(this.camera_tween != null){
            this.camera_tween.kill();
        }

        const startRotation = this.camera.quaternion.clone()
        this.camera.lookAt( this.lookAtObj.position )
        const endRotation = this.camera.quaternion.clone()
        this.camera.applyQuaternion(startRotation)
        
        this.camera_tween = gsap.to( this.time, {
            duration: 3,
            t:1,
            ease: "cubic.inout",
            onCompleteParams:[startRotation, endRotation, this.time, this],
            onComplete: this.onLookAtComplete,
            onUpdateParams:[startRotation, endRotation, this.time, this],
            onUpdate: this.onLookAtUpdate,
        });

    }

    startMoveCamera(){

        if(this.follower_tween != null){
            this.follower_tween.kill();
        }

        this.follower_tween = gsap.to( this.followObj.position, {
            x: this.targetObj.position.x, 
            y: this.targetObj.position.y, 
            z: this.targetObj.position.z, 
            duration: 3, 
            ease: "cubic.inout", 
            onComplete: this.followObjMoveFinish, 
            onCompleteParams: [ this.followObj, this.targetObj, this.camera, this ], 
            onUpdate: this.followObjMoveUpdate, 
            onUpdateParams: [ this.followObj, this.targetObj, this.camera, this ]
        })

    }

    onLookAtComplete(st, end, t, p){

    }
    

    onLookAtUpdate(st, end, t, p){
        //console.log( t )
        p.camera.quaternion.slerpQuaternions(st, end, t.t);
    }

    followObjMoveFinish(f, t, c, p){
        p.isStartMoveCamera = false
        p.initOrbit()
        //console.log( 'Move Finish' )
    }

    followObjMoveUpdate(f, t, c, p){

        f.lookAt( p.lookAtObj.position )
        f.followCube.getWorldPosition( p.followPosi )
        c.position.set( p.followPosi.x, p.followPosi.y, p.followPosi.z )
        //c.lookAt( f.position )

        //console.log( followPosi )
        

    }


    initEvent(){

        //console.log( this.rayCasterObjs )

        let isMobile = Utils.checkMobile()
        let ele = document.getElementsByTagName( 'canvas' )[0];

        if( isMobile ){
            ele.addEventListener( 'touchmove', this.onTouchMove.bind( this ) );
            ele.addEventListener( 'touchstart', this.onTouchDown.bind( this ) );
            ele.addEventListener( 'touchend', this.onTouchUp.bind( this ) );
        }else {
            ele.addEventListener( 'pointermove', this.onPointerMove.bind( this ) );
            ele.addEventListener( 'pointerdown', this.onPointerDown.bind( this ) );
            ele.addEventListener( 'pointerup', this.onPointerUp.bind( this ) );
        }
    }

    removeControl(){
        if(this.controls != null){
            this.controls.dispose();
            this.controls = null;
        }
    }

    rayCastTouch( event ){
        this.pointer.set( ( event.changedTouches[0].clientX / this.size.w ) * 2 - 1, - ( event.changedTouches[0].clientY / this.size.h ) * 2 + 1 )
        this.rayCaster.setFromCamera( this.pointer, this.camera )
    }

    rayCastPointer( event ){
        this.pointer.set( ( event.clientX / this.size.w ) * 2 - 1, - ( event.clientY / this.size.h ) * 2 + 1 )
        this.rayCaster.setFromCamera( this.pointer, this.camera )
    }

    checkHit( hitType ){
        const intersects = this.rayCaster.intersectObjects( this.rayCasterObjs );
        if ( intersects.length > 0 ) {

            const intersect = intersects[ 0 ]
            const hitObj = intersect.object
            const hitObjName = hitObj.name
            

            if( !this.isStartMoveCamera ){


                if( hitObjName.indexOf( 'floor' ) != -1 ){

                    if(hitType == 'Move' ){
                        this.delegate.onPtMove( intersect )
                    }else if( hitType == 'Down' ){
    
    
                        console.log( hitObjName )
    
                        this.delegate.onPtChoose( intersect, 'floor' )
                        //this.clock = new THREE.Clock()
                        this.v = this.ov

                        this.lookAtObj = this.targetObj

                        this.isStartMoveCamera = true
                        //this.controls.enabled = false
                        this.removeControl()
                        this.startMoveCamera()
                        this.startLookAtCamera()
                    }

                }else if( hitObjName.indexOf( "s" ) != -1 ){

                    if(hitType == 'Move' ){
                    }else if( hitType == 'Down' ){
    
    
                        
                        this.delegate.onPtChoose( intersect, 'obj' )
                        //this.clock = new THREE.Clock()
                        this.v = this.ov


                        this.lookAtObj = hitObj
                        //console.log( this.lookAtObj )

                        this.isStartMoveCamera = true
                        // //this.controls.enabled = false
                        this.removeControl()
                        this.startMoveCamera()
                        this.startLookAtCamera()
    
                        
                    }

                }
                

            }
            
            
            

            //console.log( "Move Cursor!" )
        
        
        }
    }

   
    onTouchMove( event ) {

        this.rayCastTouch( event )
        this.ptMove()
        
    }

    onPointerMove( event ) {

        
        this.rayCastPointer( event )
        this.ptMove()
    
        
    }

    onTouchDown( event ) {

        this.ptDown()

    }
    
    onPointerDown( event ) {
        
        this.ptDown()
        
    }

    onTouchUp( event ) {

        this.rayCastTouch( event )
        this.ptUp()
    
    }
    
    onPointerUp( event ) {
        
        this.rayCastPointer( event )
        this.ptUp()
    
    }

    ptMove(){

        this.ptIsMove = true
        this.ptIsDown = false
        this.checkHit( 'Move' )
        

    }

    ptDown(){
        
        this.ptIsDown = true
        this.ptIsMove = false
        //console.log(" PT Down ")

    }

    ptUp(){

        this.ptIsDown = false
        if( !this.ptIsMove ){
            console.log( 'Hit' )
            this.checkHit( "Down" )
        }

    }

    


}