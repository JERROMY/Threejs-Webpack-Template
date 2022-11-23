import * as THREE from 'three'

export class SceneMgr extends THREE.Group {


    constructor( scenePath, onProcess, onFinish) {
        
        super()
        this.debugAlpha = 0
        this.scenePath = scenePath
        this.loader = new THREE.ObjectLoader()
        this.totalSize = 102858737
        this.delegate = {
            onProcess: onProcess,
            onFinish: onFinish,
        }

        this.startObj = null
        this.pts = []

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

                

                self.initScene( object )
                self.delegate.onFinish( object )
                
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
        
        sceneObj.traverse( function( obj ){
            //console.log( obj.type )
            if( obj.type === "Mesh" ){
                if( obj.material.map != null ){
                    obj.material.map.encoding = THREE.sRGBEncoding
                }

                if( obj.name.indexOf( "floor" ) != -1 ){
                    obj.material.opacity = self.debugAlpha
                }

                if( obj.name.indexOf( "PT" ) != -1 ){
                    obj.material.transparent = true
                    obj.material.opacity = self.debugAlpha

                    if( obj.name == "PT0" ){
                        self.startObj = obj;
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


}