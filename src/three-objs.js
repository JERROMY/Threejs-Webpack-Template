
import * as THREE from 'three'
import { Utils } from './utils'
import gsap from "gsap"

export class Aim extends THREE.Group {

    constructor( aimObj ) {
        
        super()
        this.aimObj = aimObj.clone()
        this.add( this.aimObj )
        

    }


}

export class TargetHelper extends THREE.Group {

    constructor( color, isHideFollow ) {

        
        super()

        this.distCameraFromTarget = 80
        this.distCameraFromTarget2 = this.distCameraFromTarget/2
        this.aimTarget = new THREE.AxesHelper( 20 )
        this.aimTarget.visible = true
        this.add( this.aimTarget )
        this.isStartMove = false
        this.lookPosi = new THREE.Vector3()
        this.goPosi = new THREE.Vector3()

        
        this.aimCubeGeo = new THREE.BoxGeometry( 3, 3, 3 )
        this.aimCubeMat = new THREE.MeshBasicMaterial( { color: color } )
        this.aimCube = new THREE.Mesh( this.aimCubeGeo, this.aimCubeMat )
        this.add( this.aimCube )

        this.followGeo = new THREE.BoxGeometry( 5, 5, 5 )
        this.followMat = new THREE.MeshBasicMaterial( { color: 0xff00ff } )
        this.followCube = new THREE.Mesh( this.followGeo, this.followMat )
        this.add( this.followCube )
        this.followCube.visible = isHideFollow
        this.followCube.position.set( 0, 0, -this.distCameraFromTarget )

        this.followGeo2 = new THREE.BoxGeometry( 5, 5, 5 )
        this.followMat2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
        this.followCube2 = new THREE.Mesh( this.followGeo2, this.followMat2 )
        this.add( this.followCube2 )
        this.followCube2.position.set( 0, 0, -this.distCameraFromTarget2 )
        

    }


}

export class TargetFollowHelper extends THREE.Group {

    constructor( color ) {
        
        super()
        
        this.distCameraFromTarget = 0.01
        //this.distCameraFromTarget2 = 40
        this.aimTarget = new THREE.AxesHelper( 10 )
        this.aimTarget.visible = true
        this.add( this.aimTarget )

        this.aimCubeGeo = new THREE.BoxGeometry( 3, 3, 3 )
        this.aimCubeMat = new THREE.MeshBasicMaterial( { color: color } )
        this.aimCube = new THREE.Mesh( this.aimCubeGeo, this.aimCubeMat )
        this.add( this.aimCube )

        this.followGeo = new THREE.BoxGeometry( 5, 5, 5 )
        this.followMat = new THREE.MeshBasicMaterial( { color: 0xff00ff } )
        this.followCube = new THREE.Mesh( this.followGeo, this.followMat )
        this.add( this.followCube )
        this.followCube.position.set( 0, 0, this.distCameraFromTarget )

        // this.followGeo2 = new THREE.BoxGeometry( 5, 5, 5 )
        // this.followMat2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
        // this.followCube2 = new THREE.Mesh( this.followGeo2, this.followMat2 )
        // this.add( this.followCube2 )
        // this.followCube2.position.set( 0, 0, this.distCameraFromTarget2 )
        

    }


}

export class SceneMgr extends THREE.Group {


    constructor( scenePath, onProcess, onFinish) {
        
        super()
        this.debugAlpha = 0
        this.scenePath = scenePath

        this.followHelper = new TargetFollowHelper( 0xff00ff )
        this.followHelper.position.set( 0, 0, 0 )
        this.add( this.followHelper )

        this.targetHelper = new TargetHelper( 0xff0000, true )
        this.targetHelper.position.set( 0, 1000, 0 )
        this.add( this.targetHelper )

        this.aimHelper = new TargetHelper( 0x00ff00, false )
        this.aimHelper.position.set( 0, 500, 0 )
        this.add( this.aimHelper )

        this.followHelper.visible = this.aimHelper.visible = this.targetHelper.visible = false
        
        this.loader = new THREE.ObjectLoader()
        this.totalSize = 102858737
        this.delegate = {
            onProcess: onProcess,
            onFinish: onFinish,
        }

        this.startObj = null
        this.pts = []
        this.lookAtObjs = []
        this.floorObjs = []
        this.selectObjs = []
        this.moveToPosi = null


        this.resourcesObj = null
        this.aim = null
        this.aimDist = 1
        this.centerObj = null
        this.isMobile = Utils.checkMobile()
        this.follow_tween = null
        this.followWorldPosi = new THREE.Vector3()
        
        this.lookPosi2 = new THREE.Vector3()

        this.hitMode = ''
        this.tempHit = -1
        this.objID = -1

        this.hitPosi = new THREE.Vector3()

    }

    startLoad(){
        const self = this;
        // load a resource
        this.loader.load(
        // resource URL
            self.scenePath,
            // called when resource is loaded
            function ( object ) {

                //console.log( object )

                self.resourcesObj = object.getObjectByName("resources")
                console.log( self.resourcesObj )

                self.selectObjs = object.getObjectByName( "selected" ).children
                self.lookAtObjs = object.getObjectByName( "ip_stand" ).children
                self.lookAtObjs = self.lookAtObjs.concat ( object.getObjectByName( "product" ).children )

                //console.log( self.lookAtObjs )                
                //console.log( self.selectObjs )

                
                self.add( object )
                self.initScene( object )
                self.delegate.onFinish( self )
                
                //self.scene.add( object )
                //self.initEvent()
                //self.onWindowResize()
                //self.animate()
                

            },
            // called when loading is in progresses
            function ( xhr ) {

                const percent = Math.floor( ( xhr.loaded / self.totalSize ) * 100  )
                self.delegate.onProcess( percent )
                
                //console.log( percent )
                //console.log( xhr )
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                //console.log( 'An error happened' );

            }
        )


    }

    initScene( sceneObj ){

        const self = this
        console.log( "========== Scene ======== " )

        this.aimObj = this.resourcesObj.getObjectByName("pin")
        this.aim = new Aim( this.aimObj )
        this.add( this.aim )
        //this.aim.position.y = 1000
        //console.log( this.aimObj )



        sceneObj.traverse( function( obj ){
            //console.log( obj.type )
            if( obj.type === "Mesh" ){

                if( obj.material.map != null ){
                    if( obj.name != 'pin' || obj.name != 'center' ){
                        obj.material.map.encoding = THREE.sRGBEncoding
                    }

                    if( obj.name == 'center' ){
                        self.centerObj = obj
                    }
                    
                }

                if( obj.name.indexOf( 'floor' ) != -1 ){
                    obj.material.opacity = self.debugAlpha
                    self.floorObjs.push( obj )
                    //console.log( obj )
                }

                if( obj.name.indexOf( 'PT' ) != -1 ){
                    obj.material.transparent = true
                    obj.material.opacity = self.debugAlpha

                    if( obj.name == 'PT0' ){
                        self.startObj = obj;
                        self.startObj.position.set( self.startObj.position.x, 400, self.startObj.position.z )
                        console.log( self.startObj )
                    }else{
                        self.pts.push( obj )
                        
                    }

                }
                //obj.material.map.encoding = THREE.sRGBEncoding;
                //console.log( obj.material.map );
            }
        });

    }

    updateSelect(){
        const selObjsNum = this.selectObjs.length
        if( selObjsNum > 0 ){

            for( let i = 0 ; i < selObjsNum ; i++ ){
                const selObj = this.selectObjs[ i ]
                selObj.rotation.y += 0.02
            }

        }
        
    }
    updateCenter(){
        if( this.centerObj != null ){
            this.centerObj.rotation.y += 0.01
        }
    }

    addCenterEffect( mat ){
        this.centerObj.material = mat.clone()
        console.log( this.centerObj )
    }

    hitSel( intersect, controlStatus ){

        //console.log("hit")

        this.hitMode = 'obj'

        const targetObj = this.targetHelper
        const startObj = this.startObj
        const followObj = this.followHelper

        this.aim.visible = false

        const hitObjName = intersect.object.name
        const nameArr = hitObjName.split( '_' )
        const preStr = nameArr[ 0 ]
        const idStr = nameArr[ 1 ]
        this.objID = parseInt( idStr )

        //console.log( id )

        const lookPosi = new THREE.Vector3( this.lookAtObjs[ this.objID ].position.x, startObj.position.y, this.lookAtObjs[ this.objID ].position.z )
        


        if(this.objID > 9){
            this.objID = 10
        }

        
        const hitPt = this.pts[ this.objID ].position
        this.hitPosi = new THREE.Vector3( hitPt.x, startObj.position.y, hitPt.z )
        targetObj.position.set( this.hitPosi.x, this.hitPosi.y, this.hitPosi.z )

        
        //targetObj.goPosi = hitPosi
        targetObj.lookAt( lookPosi )
        
        targetObj.followCube.getWorldPosition( this.followWorldPosi )
        targetObj.lookPosi = this.hitPosi

        //targetObj.followCube2.getWorldPosition( this.lookPosi2 )
        //targetObj.goPosi = this.lookPosi2
        
        if( this.objID != this.tempHit ){

            

            this.tempHit = this.objID
            console.log( "Not Same: " + this.objID + " " + this.tempHit )
            
            
        }else{


            console.log( "Same: " + this.objID + " " + this.tempHit )
        }

        //this.tempHit = this.objID
        this.startMoveFollow()
        
        


    }

    hidePin(){
        //console.log( "hide PT" )
        this.aim.visible = false
    }

    updatePin( intersect, hitType, controlStatus ){
        if( this.aim != null ){

            const targetObj = this.targetHelper
            const startObj = this.startObj
            const followObj = this.followHelper
            const hitObjName = intersect.object.name

            const p = intersect.point
            //const n = intersect.face.normal.clone()

            const d = followObj.position.distanceTo( new THREE.Vector3( p.x, startObj.position.y, p.z ) )

            //console.log( d )

            //if( d <= 400 ){

                

            //}else{
                //this.aim.visible = false
            //}


            this.aim.visible = true

            //const hitPosi = new THREE.Vector3( p.x, startObj.position.y, p.z )
            //targetObj.goPosi = hitPosi
            targetObj.position.set( p.x, startObj.position.y, p.z )
            targetObj.followCube.getWorldPosition( this.followWorldPosi )

            

            this.aim.position.set( p.x, p.y+this.aimDist, p.z )

            if( hitType == "Move" ){
                if( hitObjName.indexOf( 'floor' ) != -1 ){
                    if( controlStatus ){
                        this.aim.visible = false
                    }else{
                        if( this.isMobile ){
                            this.aim.visible = false
                        }else{
                            this.aim.visible = true
                        }
                    }
                }else{
                    this.aim.visible = false
                }
                

                
                
                //console.log( hitObjName )
            }else if( hitType == "Down" ){
                
                this.aim.visible = true
                this.hitMode = 'floor'
                this.startMoveFollow()
                
            
            }else{

            }

            
            

        }
        
    }

    startMoveFollow(){


        const targetObj = this.targetHelper
        //const startObj = this.startObj
        const followObj = this.followHelper
        const aimObj = this.aimHelper

        if(this.follow_tween != null){
            this.follow_tween.kill()
        }

        this.follow_tween = gsap.to( aimObj.position, {

            x: this.followWorldPosi.x, 
            y: this.followWorldPosi.y, 
            z: this.followWorldPosi.z, 
            duration: 1.2, 
            ease: "sine.inOut", 
            onComplete: this.followObjMoveFinish, 
            onCompleteParams: [ this ], 
            onUpdate: this.followObjMoveUpdate, 
            onUpdateParams: [ this ]
        
        })
        

    }

    followObjMoveFinish( self ){

        self.targetHelper.isStartMove = false
        self.followHelper.position.set( self.aimHelper.position.x, self.aimHelper.position.y, self.aimHelper.position.z )
        


        //self.ptIsDown = false
        //self.isDragging = false
        //self.ptIsMove = false
    }

    followObjMoveUpdate( self ){

        self.followHelper.position.set( self.aimHelper.position.x, self.aimHelper.position.y, self.aimHelper.position.z )

        //self.followHelper.lookAt( self.targetHelper.goPosi )
        if( self.hitMode == 'obj' ){
            
            //self.targetHelper.lookPosi = self.lookPosi2
        }
        

    }


}