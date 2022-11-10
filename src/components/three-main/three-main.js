
import * as THREE from 'three'
import { Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CubeGroup } from '../../three-objs'


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

        const texturePath = this.threeData.TexturePath
        const texture = new THREE.TextureLoader().load( texturePath );

        this.shaderMat = this.threeData.BasicMaterial.clone()
        this.shaderMat.uniforms.texture.value = texture

        this.colorMat = this.threeData.ColorMaterial.clone()

        //parMat.uniforms.pointTexture.value = parTex;

        

        this.amL = new THREE.AmbientLight(0xffffff)

        // this.camera = new THREE.OrthographicCamera(
        //     -1, // left
        //      1, // right
        //      1, // top
        //     -1, // bottom
        //     -1, // near,
        //      1, // far
        // );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 40000 )
        this.camera.position.z = 5 //0.35 0 1200
        this.camera.position.x = 0
        this.camera.position.y = 10
        this.camera.lookAt( new THREE.Vector3(0, 0, 0) )


        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0xAAAAAA );
        this.scene.add( this.amL )





        //this.cubeGroup = new CubeGroup( this.shaderMat, this.colorMat, new Vector3(1.0 , 1.0, 0.0) );
        //this.scene.add( this.cubeGroup )


        //=======================================


        

        //this.axistHelper = new THREE.AxesHelper( 5 )
        //this.dirCube.add( this.axistHelper )


        this.planeGeo = new THREE.PlaneGeometry(2, 2)
        this.planeMesh = new THREE.Mesh( this.planeGeo, this.dirMat )
        this.scene.add( this.planeMesh )
        this.planeMesh.rotation.x = -Math.PI / 2
        this.planeMesh.visible = false



        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        //this.renderer.outputEncoding = THREE.sRGBEncoding
        this.container.appendChild( this.renderer.domElement )

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        // this.initEvent()
        // this.onWindowResize()
        // this.animate()

        this.startLoadScene();

        

    }

    startLoadScene(){

        const loader = new THREE.ObjectLoader();
        const self = this;
        // load a resource
        loader.load(
            // resource URL
            this.threeData.SceneDataPath,
            // called when resource is loaded
            function ( object ) {

                console.log( object );
                object.children[0].visible = false;
                const horseObj = object.children[1];
                const horseObj_clone = object.children[1].clone();
                //horseObj_clone.position.x = 0.5;

                const horseMat = horseObj.material.clone();
                
                const horseShaderMat = self.threeData.TextureMaterial.clone();
                horseShaderMat.uniforms.diffuseMap.value = horseMat.map;

                const horseColorShaderMat = self.threeData.ColorMaterial2.clone();

                let vec = new THREE.Vector3()
                const boundingBox = new THREE.Box3().setFromObject( horseObj )
                boundingBox.getSize( vec )

                let H = vec.y;
                horseColorShaderMat.uniforms.h.value = H;
                
                // const size = boundingBox.getSize()
                // console.log( vec );

                horseObj.material = horseColorShaderMat;

                console.log( horseMat.map );
                self.scene.add( object );
                self.scene.add( horseObj_clone );


                self.initEvent()
                self.onWindowResize()
                self.animate()
                

            },
            // called when loading is in progresses
            function ( xhr ) {

                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                //console.log( 'An error happened' );

            }
        );

        

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