import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Utils } from './utils'
import gsap from "gsap"

export class Controls {

    rayCaster = new THREE.Raycaster()
    rayCasterObjs = []

    pointer = new THREE.Vector2()

    ptIsDown = false
    ptIsUp = false

    offsetY = 0
   

    //isDebug = false


    camera_tween
    

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

    targetLon = 90
    targetLat = 0

    tempTargetPosi
    preTargetPosi
    preLookAtPosi
    lookAtObjPosi
    tPosi = new THREE.Vector3()


    constructor( camera, renderer, scene, size, onPtMove, onPtChoose, onPtHide, startObj, aimObj, targetObj, followObj, loodAtObjs ) {
        
        
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.size = size


        //Helper Object
        this.startObj = startObj
        this.targetObj = targetObj
        this.followObj = followObj
        this.lookAtObjs = loodAtObjs
        this.aimObj = aimObj
        
        this.delegate = {
            onPtMove: onPtMove,
            onPtHide: onPtHide,
            onPtChoose: onPtChoose,
        }
        
        this.centerPosi = new THREE.Vector3(0, 0, 0)
        this.followPosi = new THREE.Vector3()

        this.cameraFromFollowDist = this.followObj.distCameraFromTarget

        this.isMobile = Utils.checkMobile()
        this.isDragging = false
       

        gsap.registerPlugin()

    }

    update(){

        //this.followObj.lookAt( this.targetObj.goPosi )

        this.lon += (this.targetLon - this.lon) * 0.05
		this.lat += (this.targetLat - this.lat) * 0.05

        this.lat = Math.max( - 30, Math.min( 30, this.lat ) )
        this.phi = THREE.MathUtils.degToRad( 90 - this.lat )
		this.theta = THREE.MathUtils.degToRad( this.lon )

        const targetPosiX = ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.cos( this.theta ) )
        const targetPosiY = ( this.cameraFromFollowDist * Math.cos( this.phi ) )
        const targetPosiZ = ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.sin( this.theta ) )

        //const targetVec = new THREE.Vector3( targetPosiX, targetPosiY, targetPosiZ )

        //this.camera.position.lerp( targetVec, 0.1 )
        //this.camera.position.set( targetPosiX, targetPosiY, targetPosiZ )
        
        this.followObj.followCube.position.x = targetPosiX
		this.followObj.followCube.position.y = targetPosiY
		this.followObj.followCube.position.z = targetPosiZ

        
        this.followObj.followCube.getWorldPosition( this.tPosi )

        //this.camera.position.x = targetPosiX
		//this.camera.position.y = targetPosiY
		//this.camera.position.z = targetPosiZ

        this.camera.position.set( this.tPosi.x, this.tPosi.y, this.tPosi.z )

        //const d = this.followObj.position.distanceTo( targetVec )
        

        const startRotation = this.camera.quaternion.clone()
        const lookAtVec = new THREE.Vector3( this.targetObj.lookPosi.x, this.targetObj.lookPosi.y + this.offsetY, this.targetObj.lookPosi.z  )
        this.camera.lookAt( lookAtVec )
        const endRotation = this.camera.quaternion.clone()
        this.camera.applyQuaternion(startRotation)
        this.camera.quaternion.slerpQuaternions( startRotation, endRotation, 0.05 )
        
        
        
        


    }

    

    initControls(){
        const offsetStartY = 30
        this.startObj.position.set( this.startObj.position.x, this.startObj.position.y - offsetStartY, this.startObj.position.z )
        this.centerPosi.set( 0, this.startObj.position.y, 0 )
        this.aimObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.followObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.tempTargetPosi = this.followObj.position
        this.targetObj.goPosi = this.followObj.position
        this.targetObj.lookPosi = this.followObj.position
        //this.followObj.lookAt( this.targetObj.goPosi )
        


        this.camera.position.set( this.followObj.position.x, this.followObj.position.y, this.followObj.position.z )
        this.camera.lookAt( new THREE.Vector3( this.centerPosi.x, this.centerPosi.y, this.centerPosi.z ) )

        this.initEvent()

    }


    initEvent(){

        //console.log( this.rayCasterObjs )
        console.log("init event")

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

                    if( this.clickMode != "obj" ){
                        this.delegate.onPtMove( intersect, this.isDragging )
                    }

                    
                
                }else if( hitType == 'Down' ){
                    
                    this.clickMode = 'floor'
                    
                    this.offsetY = 0
                    this.tempTargetPosi = this.followObj.position
                    this.targetObj.goPosi = this.followObj.position
                    this.targetObj.lookPosi = this.followObj.position


                    this.targetObj.isStartMove = false
                    this.delegate.onPtChoose( intersect, 'floor', this.isDragging )
                    //this.startMoveFollow()
                    
                }

            }
            
            if( hitObjName.indexOf( "s" ) != -1 ){

                if(hitType == 'Move' ){
                }else if( hitType == 'Down' ){

                    const nameArr = hitObjName.split( '_' )
                    const preStr = nameArr[ 0 ]
                    const idStr = nameArr[ 1 ]
                    let id = parseInt( idStr )

                    //console.log(" Click ID: " + id)


                    this.clickMode = 'obj'
                    this.ptIsDown = false
                    this.isDragging = false
                    this.ptIsMove = false

                    //this.offsetY = 50
                    

                    //console.log( this.lookAtObjs );


                    //console.log( this.targetLon )
                    //console.log( this.targetLat )


                    this.tempTargetPosi = this.followObj.position
                    //this.lookAtObjPosi = this.followObj.position


                    //console.log( "hit 2" )


                    
                    //this.startMoveFollow()
                    this.targetObj.isStartMove = true
                    this.delegate.onPtChoose( intersect, 'obj' )
                    
                    

                    
                }

            }

            
            
            

        }else{
            
            //console.log( "========" )
            //console.log( hitType )

            if( hitType == "Down" ){

                //console.log( "========" )
                //console.log( hitType )

                
            }

            this.delegate.onPtHide()
        }
    }

    onPointerMove( event ) {

       // event.preventDefault()


        if( this.targetObj.isStartMove ){

            return

        }
        
        this.rayCastPointer( event )
            this.ptMove( event )
        
    
        
    }
    
    onPointerDown( event ) {


        if( this.targetObj.isStartMove ){

            return

        }

        this.rayCastPointer( event )

        this.onPointerDownPointerX = event.clientX
		this.onPointerDownPointerY = event.clientY

		this.onPointerDownLon = this.lon;
	    this.onPointerDownLat = this.lat;


        this.ptDown( event )
        
    }
    
    onPointerUp( event ) {

        if( this.targetObj.isStartMove ){

            return

        }
        
        this.rayCastPointer( event )
        this.ptUp( event )
    
    }

    ptMove( event ){

        //console.log( event )

        this.ptIsMove = true
        //this.ptIsDown = false

        if( this.ptIsDown ){


           //console.log( 'Drag' )

            if( this.clickMode == 'obj' ){
                //this.tempTargetPosi = this.followObj.position
                this.clickMode = ''
                this.offsetY = 0
                this.targetObj.lookPosi = this.followObj.position
            }


            this.targetLon = ( this.onPointerDownPointerX - event.clientX ) * 0.2 + this.onPointerDownLon
            this.targetLat = ( this.onPointerDownPointerY - event.clientY ) * 0.2 + this.onPointerDownLat

            
            const offset2D = new THREE.Vector2( this.targetLon, this.targetLat )
            const d = offset2D.length()
            if( d > 10 ){
                this.isDragging = true
                this.ptIsMove = true
            }else{
                this.isDragging = false
                this.ptIsMove = false
            }
        
        }

        // if( !this.clickMode != 'obj' ){

        //     this.checkHit( 'Move' )
        // }

        this.checkHit( 'Move' )
        

        //console.log( "Move" )
        
        

    }

    ptDown( event ){
        
        this.ptIsDown = true
        this.ptIsMove = false
        
        //console.log(" PT Down ")

        


    }

    ptUp( event ){

        //console.log( this.ptIsMove )


        if( !this.ptIsMove ){
            //console.log( 'Hit' )
            this.checkHit( "Down" )
        }

        this.ptIsDown = false
        this.isDragging = false
        //this.ptIsMove = false

    }

    


}