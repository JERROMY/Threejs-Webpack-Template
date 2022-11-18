

const THREE = window.MINDAR.IMAGE.THREE



class ThreeMain {

    //camera
    scene
    renderer
    container = document.getElementById( 'container-3d' )


    dirGeo

    size = {
        w: 0,
        h: 0
    }

    


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

        console.log( this.threeData.TestARCardMind )
        console.log( this.threeData.TestARCardImg )

        console.log("Three JS Ready")

        this.shaderMat = new THREE.RawShaderMaterial( {
    
            //uniforms: this.uniforms,
            vertexShader: this.threeData.BasicVS,
            fragmentShader: this.threeData.BasicFS,
    
            //blending: THREE.AdditiveBlending,
            side:THREE.DoubleSide,
            // depthTest: false,
            // transparent: true,
            vertexColors: true
    
        } )
        

        this.mindarThree = new window.MINDAR.IMAGE.MindARThree({

            container: this.container,
            imageTargetSrc: this.threeData.TestARCardMind,
            filterMinCF: 2,
            filterBeta: 10000,
            missTolerance: 5,
            warmupTolerance: 5,
        
        });

        this.scene = this.mindarThree.scene
        this.camera = this.mindarThree.camera
        this.renderer = this.mindarThree.renderer

        //console.log("TEST ====== ")
        //console.log(this.mindarThree.renderer)

        this.anchor = this.mindarThree.addAnchor( 0 )
        this.geometry = new THREE.PlaneGeometry( 1, 0.55 )
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, transparent: true, opacity: 0.5 } )
        this.plane = new THREE.Mesh( this.geometry, this.material )
        this.anchor.group.add( this.plane )
        
        this.initEvent()
        //this.onWindowResize()
        //this.animate()

    }

    async startAR(){
        await this.mindarThree.start()
        this.onWindowResize()
        this.animate()
    }

    stopAR(){
        this.mindarThree.stop()
	    this.mindarThree.renderer.setAnimationLoop(null)
    }

    animate(){
        //console.log("animate")
        this.update()
        window.requestAnimationFrame( this.animate.bind( this ) )
    }

    update(){
        this.renderer.render( this.scene, this.camera )
    }

    initEvent(){
        window.addEventListener( 'resize', this.onWindowResize.bind( this ) )
    }

    onWindowResize() {


        this.size.w = window.innerWidth
        this.size.h = window.innerHeight

        console.log( this.size.w + ' ' + this.size.h )

        this.size.asp = this.size.w / this.size.h
        this.camera.aspect = this.size.asp
        this.camera.updateProjectionMatrix()
        

        this.renderer.setSize( this.size.w, this.size.h )
    
    }


    

}

export default ThreeMain