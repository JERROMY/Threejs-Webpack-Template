import * as THREE from 'three'

export class CubeGroup extends THREE.Group {


    constructor( mat1, mat2, color ) {
        super()
        this.mat1 = mat1
        this.mat2 = mat2

        this.dirGeo = new THREE.BoxGeometry(1, 1, 1)
        this.dirMat = this.mat1
        this.dirCube = new THREE.Mesh(this.dirGeo, this.dirMat)
        this.dirCube.renderOrder = 1
        

        this.dirGeo2 = new THREE.BoxGeometry(1.1, 1.1, 1.1)
        this.dirMat2 = this.mat2
        this.dirCube2 = new THREE.Mesh(this.dirGeo2, this.dirMat2)
        this.dirCube2.renderOrder = 0
        this.dirCube2.material.uniforms.mainColor.value = color;
                
        this.add(this.dirCube)
        this.add(this.dirCube2)

    }
}