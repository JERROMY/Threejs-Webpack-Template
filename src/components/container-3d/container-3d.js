import './container-3d.scss'

class Container3D {

    render( idName, className ) {
        this.container = document.createElement('div')
        this.container.id = idName
        this.container.classList.add( className )
        this.container.width = 400
        this.container.height = 400
        const body = document.querySelector( 'body' )
        body.appendChild( this.container )
    }


}

export default Container3D