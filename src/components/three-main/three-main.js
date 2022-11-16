

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
            filterMinCF: 1,
            filterBeta: 10000,
            missTolerance: 0,
            warmupTolerance: 0,
        });

        this.scene = this.mindarThree.scene;
        this.camera = this.mindarThree.camera;
        this.renderer = this.mindarThree.render;
        
        this.initEvent()
        //this.onWindowResize()
        //this.animate()

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
        //console.log( this )
        //console.log( this.camera )

        this.size.asp = this.size.w / this.size.h
        this.camera.aspect = this.size.asp
        this.camera.updateProjectionMatrix()
        
        // const aspectRatio = this.size.w / this.size.h
        // this.camera.left = -1 * aspectRatio
        // this.camera.right = 1 * aspectRatio
        // this.camera.updateProjectionMatrix()




        this.renderer.setSize( this.size.w, this.size.h )
    
    }


    

}

export default ThreeMain