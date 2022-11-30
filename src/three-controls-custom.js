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

    offsetY = 0
   

    isStartMoveCamera = false
    //isDebug = false


    camera_tween
    follow_tween

    time = { t:0 }
    
    clickMode = ''

    lon = 90
    lat = 0
    phi = 0
    theta = 0

    onPointerDownPointerX = 0
	onPointerDownPointerY = 0
	
    onPointerDownLon = 0
	onPointerDownLat = 0

    tempTargetPosi



    constructor( camera, renderer, scene, size, onPtMove, onPtChoose, onPtHide, startObj, aimObj, targetObj, followObj ) {
        
        
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.size = size


        //Helper Object
        this.startObj = startObj
        this.targetObj = targetObj
        this.followObj = followObj
        this.aimObj = aimObj

        this.lookAtObj = null

        this.delegate = {
            onPtMove: onPtMove,
            onPtHide: onPtHide,
            onPtChoose: onPtChoose,
        }
        
        this.centerPosi = new THREE.Vector3(0, 0, 0)
        this.followPosi = new THREE.Vector3()

        this.cameraFromFollowDist = 40

        this.isMobile = Utils.checkMobile()
        this.isDragging = false

        gsap.registerPlugin()

    }

    update(){

        this.lat = Math.max( - 45, Math.min( 45, this.lat ) )
        this.phi = THREE.MathUtils.degToRad( 90 - this.lat )
		this.theta = THREE.MathUtils.degToRad( this.lon )

        const targetPosiX = this.tempTargetPosi.x + ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.cos( this.theta ) )
        const targetPosiY = this.tempTargetPosi.y + ( this.cameraFromFollowDist * Math.cos( this.phi ) )
        const targetPosiZ = this.tempTargetPosi.z + ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.sin( this.theta ) )

        const targetVec = new THREE.Vector3( targetPosiX, targetPosiY, targetPosiZ )

        this.camera.position.lerp( targetVec, 0.05 )
            

        // this.camera.position.x = targetPosiX
		// this.camera.position.y = targetPosiY
		// this.camera.position.z = targetPosiZ

        const startRotation = this.camera.quaternion.clone()
        const lookAtVec = new THREE.Vector3( this.lookAtObj.position.x, this.lookAtObj.position.y, this.lookAtObj.position.z  )
        this.camera.lookAt( lookAtVec )
        const endRotation = this.camera.quaternion.clone()
        this.camera.applyQuaternion(startRotation)
        this.camera.quaternion.slerpQuaternions( startRotation, endRotation, 0.05 )
        


    }

    startMoveFollow(){
        this.isStartMoveCamera = true

        if(this.follow_tween != null){
            this.follow_tween.kill()
        }

        this.follow_tween = gsap.to( this.followObj.position, {
            x: this.targetObj.position.x, 
            y: this.targetObj.position.y, 
            z: this.targetObj.position.z, 
            duration: 2.0, 
            ease: "cubic.inout", 
            onComplete: this.followObjMoveFinish, 
            onCompleteParams: [ this ], 
            onUpdate: this.followObjMoveUpdate, 
            onUpdateParams: [ this ]
        })
        

    }

    followObjMoveFinish( self ){
        self.isStartMoveCamera = false
        //self.ptIsDown = false
        //self.isDragging = false
        //self.ptIsMove = false
    }

    followObjMoveUpdate( self ){

    }

    initControls(){

        this.centerPosi.set( 0, this.startObj.position.y, 0 )
        this.aimObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.followObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.tempTargetPosi = this.followObj.position
        this.lookAtObj = this.followObj
        this.followObj.lookAt( this.centerPosi )
        


        this.camera.position.set( this.followObj.position.x, this.followObj.position.y, this.followObj.position.z )
        this.camera.lookAt( this.centerPosi )

        this.initEvent()

    }


    initEvent(){

        //console.log( this.rayCasterObjs )

        let ele = document.getElementsByTagName( 'canvas' )[0];

        ele.addEventListener( 'pointermove', this.onPointerMove.bind( this ) )
        ele.addEventListener( 'pointerdown', this.onPointerDown.bind( this ) )
        ele.addEventListener( 'pointerup', this.onPointerUp.bind( this ) )
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

            if( hitObjName.indexOf( 'floor' ) != -1 ){

                if(hitType == 'Move' ){

                    this.delegate.onPtMove( intersect, this.isDragging )
                
                }else if( hitType == 'Down' ){
                    
                    this.clickMode = 'floor'

                    this.tempTargetPosi = this.followObj.position
                    this.lookAtObj = this.followObj

                    this.delegate.onPtChoose( intersect, 'floor', this.isDragging )
                    this.startMoveFollow()
                    
                }

            }
            
            if( hitObjName.indexOf( "s" ) != -1 ){

                if(hitType == 'Move' ){
                }else if( hitType == 'Down' ){


                    this.clickMode = 'obj'
                    this.delegate.onPtChoose( intersect, 'obj' )

                    this.tempTargetPosi = this.followObj.position
                    this.lookAtObj = hitObj
                    
                    this.startMoveFollow()
                    

                    
                }

            }

            
            

            

            if( !this.isStartMoveCamera ){


                
                

            }
            
            

        }else{
            
            this.delegate.onPtHide()
        }
    }

    onPointerMove( event ) {

        //event.preventDefault()
        
        this.rayCastPointer( event )
        this.ptMove( event )
    
        
    }
    
    onPointerDown( event ) {

        this.rayCastPointer( event )

        this.onPointerDownPointerX = event.clientX
		this.onPointerDownPointerY = event.clientY

		this.onPointerDownLon = this.lon;
	    this.onPointerDownLat = this.lat;


        this.ptDown( event )
        
    }
    
    onPointerUp( event ) {
        
        this.rayCastPointer( event )
        this.ptUp( event )
    
    }

    ptMove( event ){

        //console.log( event )

        this.ptIsMove = false
        //this.ptIsDown = false

        if( this.ptIsDown ){

            this.lon = ( this.onPointerDownPointerX - event.clientX ) * 0.2 + this.onPointerDownLon
			this.lat = ( this.onPointerDownPointerY - event.clientY ) * 0.2 + this.onPointerDownLat
            
            const offset2D = new THREE.Vector2( this.lon, this.lat )
            const d = offset2D.length()
            if( d > 30 ){
                this.isDragging = true
                this.ptIsMove = true
            }else{
                this.isDragging = false
                this.ptIsMove = false
            }
        
        }

        this.checkHit( 'Move' )

        //console.log( "Move" )
        
        

    }

    ptDown( event ){
        
        this.ptIsDown = true
        this.ptIsMove = false
        //console.log( 'Down' )
        //console.log(" PT Down ")

        


    }

    ptUp( event ){


        if( !this.ptIsMove ){
            console.log( 'Hit' )
            this.checkHit( "Down" )
        }

        this.ptIsDown = false
        this.isDragging = false
        this.ptIsMove = false

    }

    


}