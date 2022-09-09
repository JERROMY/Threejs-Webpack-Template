
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class ThreeMain {

    //camera
    scene
    renderer

    container = document.getElementById( 'container-3d' )

    aml

    dirGeo

    controls
    size = {
        w: 0,
        h: 0,
        asp: 0,
    }

    


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

        console.log("Three JS Ready")

        const rndTex = new THREE.TextureLoader().load( this.threeData.RndTex )
        rndTex.magFilter = THREE.NearestFilter
        rndTex.minFilter = THREE.NearestFilter;
        rndTex.wrapS = THREE.RepeatWrapping
        rndTex.wrapT = THREE.RepeatWrapping
        this.threeData.BasicShaderUniforms.iResolution.value = new THREE.Vector3(1, 1, 1)
        this.threeData.BasicShaderUniforms.iChannel0.value = rndTex

        this.shaderMat = new THREE.ShaderMaterial( {
    
            uniforms: this.threeData.BasicShaderUniforms,
            vertexShader: this.threeData.BasicVS,
            fragmentShader: this.threeData.BasicFS,
    
            //blending: THREE.AdditiveBlending,
            //side:THREE.DoubleSide,
            // depthTest: false,
            // transparent: true,
            // vertexColors: true
    
        } )

        // this.shaderMat = new THREE.RawShaderMaterial( {
    
        //     uniforms: this.threeData.BasicShaderUniforms,
        //     vertexShader: this.threeData.BasicVS,
        //     fragmentShader: this.threeData.BasicFS,
    
        //     //blending: THREE.AdditiveBlending,
        //     //side:THREE.DoubleSide,
        //     // depthTest: false,
        //     // transparent: true,
        //     // vertexColors: true
    
        // } )
        

        this.amL = new THREE.AmbientLight(0xffffff)

        this.camera = new THREE.OrthographicCamera(
            -1, // left
             1, // right
             1, // top
            -1, // bottom
            -1, // near,
             1, // far
        );

        
        

        this.scene = new THREE.Scene()
        this.scene.add( this.amL )

        this.dirGeo = new THREE.BoxGeometry(1, 1, 1)
        this.dirMat = this.shaderMat
        this.dirCube = new THREE.Mesh(this.dirGeo, this.dirMat)
        this.scene.add(this.dirCube)
        this.dirCube.position.set(0, 0, 0)
        this.dirCube.visible = false

        this.axistHelper = new THREE.AxesHelper( 5 )
        this.dirCube.add( this.axistHelper )


        this.planeGeo = new THREE.PlaneGeometry(2, 2)
        this.planeMesh = new THREE.Mesh( this.planeGeo, this.shaderMat )
        this.scene.add( this.planeMesh )



        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        //this.renderer.outputEncoding = THREE.sRGBEncoding
        this.container.appendChild( this.renderer.domElement )

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        this.initEvent()
        this.onWindowResize()
        this.animate()

    }

    animate( et ){
        //console.log( et )
        this.onUpdateShader( et )
        this.update()
        window.requestAnimationFrame( this.animate.bind( this ) )
    }

    update(){
        this.renderer.render( this.scene, this.camera )
    }

    initEvent(){
        window.addEventListener( 'resize', this.onWindowResize.bind( this ) )
    }

    onUpdateShader( et ) {
        const iTime = et * 0.001
        //console.log( iTime )
        //this.threeData.BasicShaderUniforms.iResolution.value.set(this.size.w, this.size.h)
        this.threeData.BasicShaderUniforms.iTime.value = iTime
    }

    onWindowResize() {


        this.size.w = window.innerWidth
        this.size.h = window.innerHeight

        console.log( this.size.w + ' ' + this.size.h )
        //console.log( this )
        //console.log( this.camera )
        //this.camera.aspect = window.innerWidth / window.innerHeight
        //this.camera.updateProjectionMatrix()
        
        this.size.asp = this.size.w / this.size.h
        this.camera.left = -1 * this.size.asp
        this.camera.right = 1 * this.size.asp
        this.camera.updateProjectionMatrix()




        this.renderer.setSize( this.size.w, this.size.h )
    
    }


    

}

export default ThreeMain