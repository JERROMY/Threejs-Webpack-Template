
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
        h: 0
    }


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

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
        

        this.amL = new THREE.AmbientLight(0xffffff)

        this.camera = new THREE.OrthographicCamera(
            -1, // left
             1, // right
             1, // top
            -1, // bottom
            -1, // near,
             1, // far
        );

        //this.plane = new THREE.PlaneBufferGeometry(2, 2)
        

        this.scene = new THREE.Scene()
        this.scene.add( this.amL )

        this.dirGeo = new THREE.BoxGeometry(1, 1, 1)
        this.dirMat = this.shaderMat
        this.dirCube = new THREE.Mesh(this.dirGeo, this.dirMat)
        this.scene.add(this.dirCube)
        this.dirCube.position.set(0, 0, 0)
        this.dirCube.visible = true

        this.axistHelper = new THREE.AxesHelper( 5 )
        this.dirCube.add( this.axistHelper )



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

        //console.log( this )
        //console.log( this.camera )
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    
        this.renderer.setSize( window.innerWidth, window.innerHeight )
    
    }


    

}

export default ThreeMain