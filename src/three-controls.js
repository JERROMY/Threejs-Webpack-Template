import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Utils } from './utils'

export class Controls {

    rayCaster = new THREE.Raycaster()
    rayCasterObjs = []

    pointer = new THREE.Vector2()
    distCameraFromTarget = 0.01

    ptIsDown = false
    ptIsUp = false


    v = 100
    ov = 100
    a = 2
    f = 0.9


    clock = new THREE.Clock()

   

    isStartMoveCamera = false
    isDebug = false




    constructor( camera, renderer, scene, size, onPtMove, onPtChoose, startObj, aimObj, targetObj, followObj ) {
        
        this.size = size
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.startObj = startObj
        this.targetObj = targetObj
        this.followObj = followObj
        this.aimObj = aimObj
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

            const delta = this.clock.getDelta();
            //console.log( delta )

            let vec = new THREE.Vector3()
            vec.subVectors( this.targetObj.position, this.followObj.position ).normalize().multiplyScalar( this.v*delta )
            

            let addVec = new THREE.Vector3()
            
            
            addVec.addVectors( this.followObj.position, vec )
            this.followObj.position.set( addVec.x, addVec.y, addVec.z )
            this.followObj.lookAt( this.targetObj.position )
            const d = this.targetObj.position.distanceTo( this.followObj.position )

            this.followObj.followCube.getWorldPosition( this.followPosi )
            //console.log( followPosi )


            if( !this.isDebug ){
                this.camera.position.set( this.followPosi.x, this.followPosi.y, this.followPosi.z )
                const startRotation = this.camera.quaternion.clone()
                this.camera.lookAt( this.followObj.position )
                const endRotation = this.camera.quaternion.clone()
                this.camera.applyQuaternion(startRotation)
                this.camera.quaternion.slerpQuaternions(startRotation, endRotation, 0.05);
            } else {
                this.aimObj.position.set( this.followPosi.x, this.followPosi.y, this.followPosi.z )
                const startRotation = this.aimObj.quaternion.clone()
                this.aimObj.lookAt( this.followObj.position )
                const endRotation = this.aimObj.quaternion.clone()
                this.aimObj.applyQuaternion(startRotation)
                this.aimObj.quaternion.slerpQuaternions(startRotation, endRotation, 0.05);
            }

            this.v += this.a
            
            

            if( d < 5 ){

                this.isStartMoveCamera = false
                if( !this.isDebug ){
                    this.initOrbit()
                }
                
                //this.controls.enabled = true
                
                //this.camera.lookAt( this.targetObj.position )
            }else{

                

                

            }



        }

        //console.log( "Move!" )

    }


    initEvent(){

        //console.log( this.rayCasterObjs )

        let isMobile = Utils.checkMobile()
        let ele = document.getElementsByTagName("canvas")[0];

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
            
            if(hitType == "Move" ){
                this.delegate.onPtMove( intersect )
            }else if( hitType == "Down" ){
                this.delegate.onPtChoose( intersect )
                this.clock = new THREE.Clock()
                this.v = this.ov
                this.isStartMoveCamera = true
                //this.controls.enabled = false
                this.removeControl()
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
        this.checkHit( "Move" )

    }

    ptDown(){
        
        this.ptIsDown = true
        this.ptIsMove = false
        //console.log(" PT Down ")

    }

    ptUp(){

        this.ptIsDown = false
        if( !this.ptIsMove ){
            console.log( "Hit" )
            this.checkHit( "Down" )
        }

    }

    


}