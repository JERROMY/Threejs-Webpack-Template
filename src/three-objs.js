
import * as THREE from 'three'

export class Aim extends THREE.Group {

    constructor( aimObj ) {
        
        super()
        this.aimObj = aimObj.clone()
        this.add( this.aimObj )
        

    }


}

export class TargetHelper extends THREE.Group {

    constructor( color ) {
        
        super()
        this.aimTarget = new THREE.AxesHelper( 20 )
        this.aimTarget.visible = true
        this.add( this.aimTarget )

        
        this.aimCubeGeo = new THREE.BoxGeometry( 10, 10, 10 )
        this.aimCubeMat = new THREE.MeshBasicMaterial( { color: color } )
        this.aimCube = new THREE.Mesh( this.aimCubeGeo, this.aimCubeMat )
        this.add( this.aimCube )
        

    }


}

export class TargetFollowHelper extends THREE.Group {

    constructor( color, color2 ) {
        
        super()

        this.distCameraFromTarget = 0.1

        this.aimTarget = new THREE.AxesHelper( 10 )
        this.aimTarget.visible = true
        this.add( this.aimTarget )

        this.aimCubeGeo = new THREE.BoxGeometry( 5, 5, 5 )
        this.aimCubeMat = new THREE.MeshBasicMaterial( { color: color } )
        this.aimCube = new THREE.Mesh( this.aimCubeGeo, this.aimCubeMat )
        this.add( this.aimCube )

        this.followGeo = new THREE.BoxGeometry( 5, 5, 5 )
        this.followMat = new THREE.MeshBasicMaterial( { color: color2 } )
        this.followCube = new THREE.Mesh( this.followGeo, this.followMat )
        this.add( this.followCube )
        this.followCube.position.set( 0, 0, -this.distCameraFromTarget )
        
        
        

    }


}

export class SceneMgr extends THREE.Group {


    constructor( scenePath, onProcess, onFinish) {
        
        super()
        this.debugAlpha = 0
        this.scenePath = scenePath

        this.followHelper = new TargetFollowHelper( 0xff00ff, 0x0000ff )
        this.followHelper.position.set( 0, 0, 0 )
        this.add( this.followHelper )

        this.targetHelper = new TargetHelper( 0xff0000 )
        this.targetHelper.position.set( 0, 1000, 0 )
        this.add( this.targetHelper )

        this.aimHelper = new TargetHelper( 0x00ff00 )
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
        this.floorObjs = []
        this.selectObjs = []

        this.resourcesObj = null
        this.aim = null
        this.aimDist = 1
        this.centerObj = null

    }

    startLoad(){
        const self = this;
        // load a resource
        this.loader.load(
        // resource URL
            self.scenePath,
            // called when resource is loaded
            function ( object ) {

                console.log( object )

                self.resourcesObj = object.getObjectByName("resources")
                console.log( self.resourcesObj )

                self.selectObjs = object.getObjectByName( "selected" ).children;
                
                console.log( self.selectObjs )

                
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
        this.aim.position.y = 1000
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

    hitSel( intersect ){

        const targetObj = this.targetHelper
        const startObj = this.startObj

        const hitObjName = intersect.object.name
        const nameArr = hitObjName.split( '_' )
        const preStr = nameArr[ 0 ]
        const idStr = nameArr[ 1 ]
        const id = parseInt( idStr )
        console.log( id )
        const hitPt = this.pts[ id ].position

        targetObj.position.set( hitPt.x, startObj.position.y, hitPt.z )
        


    }

    updatePin( intersect, hitType ){
        if( this.aim != null ){

            const targetObj = this.targetHelper
            const startObj = this.startObj

            //const hitObjName = intersect.object.name

            const p = intersect.point
            //const n = intersect.face.normal.clone()


            targetObj.position.set( p.x, startObj.position.y, p.z )
            this.aim.position.set( p.x, p.y+this.aimDist, p.z )
            if( hitType == "Move" ){
                
                this.aim.visible = false
                //console.log( hitObjName )
            }else if( hitType == "Down" ){

                this.aim.visible = true
            
            }else{

            }  
            

        }
        
    }


}