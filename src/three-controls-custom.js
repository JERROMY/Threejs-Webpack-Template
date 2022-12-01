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

        this.cameraFromFollowDist = 10

        this.isMobile = Utils.checkMobile()
        this.isDragging = false

        gsap.registerPlugin()

    }

    update(){

        //this.followObj.lookAt( this.targetObj.position )

        this.lon += (this.targetLon - this.lon) * 0.05
		this.lat += (this.targetLat - this.lat) * 0.05

        this.lat = Math.max( - 30, Math.min( 30, this.lat ) )
        this.phi = THREE.MathUtils.degToRad( 90 - this.lat )
		this.theta = THREE.MathUtils.degToRad( this.lon )


        const targetPosiX = this.tempTargetPosi.x + ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.cos( this.theta ) )
        const targetPosiY = this.tempTargetPosi.y + ( this.cameraFromFollowDist * Math.cos( this.phi ) )
        const targetPosiZ = this.tempTargetPosi.z + ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.sin( this.theta ) )

        //const targetVec = new THREE.Vector3( targetPosiX, targetPosiY, targetPosiZ )

        //this.camera.position.lerp( targetVec, 0.1 )
        //this.camera.position.set( targetPosiX, targetPosiY, targetPosiZ )
            

        this.camera.position.x = targetPosiX
		this.camera.position.y = targetPosiY
		this.camera.position.z = targetPosiZ

        //const d = this.followObj.position.distanceTo( targetVec )
        

        const startRotation = this.camera.quaternion.clone()
        const lookAtVec = new THREE.Vector3( this.lookAtObjPosi.x, this.lookAtObjPosi.y + this.offsetY, this.lookAtObjPosi.z  )
        this.camera.lookAt( lookAtVec )
        const endRotation = this.camera.quaternion.clone()
        this.camera.applyQuaternion(startRotation)
        this.camera.quaternion.slerpQuaternions( startRotation, endRotation, 0.05 )
        
        
        
        


    }

    

    initControls(){

        this.centerPosi.set( 0, this.startObj.position.y, 0 )
        this.aimObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.followObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.tempTargetPosi = this.followObj.position
        this.lookAtObjPosi = this.followObj.position
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
                    
                    this.offsetY = 0
                    this.tempTargetPosi = this.followObj.position
                    this.lookAtObjPosi = this.followObj.position

                    

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

                    console.log(" Click ID: " + id)


                    this.clickMode = 'obj'

                    //this.offsetY = 50
                    

                    //console.log( this.lookAtObjs );


                    this.tempTargetPosi = this.followObj.position
                    //this.lookAtObjPosi = this.lookAtObjs[ id ].position
                    this.lookAtObj = this.followObj
                    
                    //this.startMoveFollow()
                    this.delegate.onPtChoose( intersect, 'obj' )
                    

                    
                }

            }

            
            
            

        }else{
            
            //console.log( "========" )
            //console.log( hitType )

            if( hitType == "Down" ){

                //console.log( "========" )
                //console.log( hitType )

                if( this.clickMode == 'obj' ){
                    //this.tempTargetPosi = this.followObj.position
                    //this.lookAtObjPosi = this.followObj.position
                }
            }

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

        //this.ptIsMove = true
        //this.ptIsDown = false

        if( this.ptIsDown ){


            this.targetLon = ( this.onPointerDownPointerX - event.clientX ) * 0.15 + this.onPointerDownLon
            this.targetLat = ( this.onPointerDownPointerY - event.clientY ) * 0.15 + this.onPointerDownLat

            
            
            const offset2D = new THREE.Vector2( this.targetLon, this.targetLat )
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

        console.log( this.ptIsMove )


        if( !this.ptIsMove ){
            console.log( 'Hit' )
            this.checkHit( "Down" )
        }

        this.ptIsDown = false
        this.isDragging = false
        //this.ptIsMove = false

    }

    


}