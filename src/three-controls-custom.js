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
    follower_tween

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



    constructor( camera, renderer, scene, size, onPtMove, onPtChoose, startObj, aimObj, targetObj, followObj ) {
        
        
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
            onPtChoose: onPtChoose,
        }
        
        this.centerPosi = new THREE.Vector3(0, 0, 0)
        this.followPosi = new THREE.Vector3()

        this.cameraFromFollowDist = 40

    }

    update(){

        this.lat = Math.max( - 85, Math.min( 85, this.lat ) )
        this.phi = THREE.MathUtils.degToRad( 90 - this.lat )
		this.theta = THREE.MathUtils.degToRad( this.lon )

        this.camera.position.x = this.followObj.position.x + ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.cos( this.theta ) )
		this.camera.position.y = this.followObj.position.y + ( this.cameraFromFollowDist * Math.cos( this.phi ) )
		this.camera.position.z = this.followObj.position.z + ( this.cameraFromFollowDist * Math.sin( this.phi ) * Math.sin( this.theta ) )
        this.camera.lookAt( this.followObj.position )


    }

    startMoveCamera(){

        

    }

    initControls(){

        this.centerPosi.set( 0, this.startObj.position.y, 0 )
        this.aimObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.followObj.position.set( this.startObj.position.x, this.startObj.position.y, this.startObj.position.z )
        this.followObj.lookAt( this.centerPosi )


        this.camera.position.set( this.followObj.position.x, this.followObj.position.y, this.followObj.position.z )
        this.camera.lookAt( this.centerPosi )

        this.initEvent()

    }


    initEvent(){

        //console.log( this.rayCasterObjs )

        let isMobile = Utils.checkMobile()
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

                    //this.delegate.onPtMove( intersect )
                
                }else if( hitType == 'Down' ){


                    console.log( hitObjName )
                    
                    this.clickMode = 'floor'
                    //this.delegate.onPtChoose( intersect, 'floor' )
                    
                }

            }else if( hitObjName.indexOf( "s" ) != -1 ){

                if(hitType == 'Move' ){
                }else if( hitType == 'Down' ){


                    this.clickMode = 'obj'
                    //this.delegate.onPtChoose( intersect, 'obj' )
                    

                    
                }

            }
            

            if( !this.isStartMoveCamera ){


                
                

            }
            
            

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

        this.ptIsMove = true
        //this.ptIsDown = false

        if( this.ptIsDown ){
            console.log( "Move" )
            this.lon = ( this.onPointerDownPointerX - event.clientX ) * 0.1 + this.onPointerDownLon
			this.lat = ( this.onPointerDownPointerY - event.clientY ) * 0.1 + this.onPointerDownLat
        }

        //console.log( "Move" )
        //this.checkHit( 'Move' )
        

    }

    ptDown( event ){
        
        this.ptIsDown = true
        this.ptIsMove = false
        //console.log( 'Down' )
        //console.log(" PT Down ")

        


    }

    ptUp( event ){

        this.ptIsDown = false
        if( !this.ptIsMove ){
            //console.log( 'Hit' )
            //this.checkHit( "Down" )
        }

    }

    


}