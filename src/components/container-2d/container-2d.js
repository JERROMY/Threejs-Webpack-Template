import './container-2d.scss'

class Container2D {

    constructor(){
        this.container = document.createElement('div')
    }

    render() {

        
        this.container.id = "container-2d"
        this.container.classList.add( 'container-2d' )
        const body = document.querySelector( 'body' )
        body.appendChild( this.container )

    }

    text( text ){
        this.container.innerHTML = text
    }

    hide(){
        this.container.style.display = "none"
    }
}

export default Container2D