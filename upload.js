
const element = (tag, classes=[], content) =>{
    const node = document.createElement(tag)
    if(classes.length){
        node.classList.add(...classes)
    }
    if(content){
        node.textContent = content
    }
    return node
    
}
function noop(){}

export function upload(selector, options = {}){
    let files =[]
    const onUpload = options.onUpload ?? noop    
    const input = document.querySelector(selector)
    const open = element('button', ['btn'], 'Open')
    const upload = element('button', ['btn', 'primary'], 'Загрузить')
    upload.style.display = 'none'

    const preview = element('div',['preview'])
   
    input.insertAdjacentElement('afterend', preview )

    if (options.multi){
        input.setAttribute('multiple', true)
    }
    if(options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','))
    }
    input.insertAdjacentElement('afterend', upload )
    input.insertAdjacentElement('afterend', open )
    

    const triggerInput = () => input.click()
    open.addEventListener('click', triggerInput)

    const changeHandler = (event) => {
        if(!event.target.files.length){
            return
        }
        preview.innerHTML =""
        upload.style.display = 'inline'
        files = Array.from(event.target.files)
        files.forEach((file) =>{
            if(!file.type.match('image')){
                return
            }
            const reader = new FileReader()
            reader.onload = (ev) => {
                const src= ev.target.result
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview_image">
                    <div class="preview_remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}"/>
                        <div class="preview_info">
                            <b>${file.name}</b> </br>size: ${file.size}
                        </div>
                        
                    </div>

                `)
               
            }
            reader.readAsDataURL(file)
        })
        
    } 
    const removeHandler = (event) => {
        if(!event.target.dataset.name){
            return
        }
        const {name} = event.target.dataset        
        files = files.filter(file => file.name !== name)
        if(!files.length){
            setTimeout(()=>{upload.style.display = 'none'},300)
        }
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview_image')  
        block.classList.add('removing') 
        const trash = () => block.remove()    
        setTimeout(trash, 300)

    }
    const clearPreview = (el) =>{
        el.innerHTML ='<div class="preview_info_progress">22</div>'
    }
    const uploadHandler = () =>{
        preview.querySelectorAll('.preview_remove').forEach( e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview_info')
        previewInfo.forEach(clearPreview)
        onUpload(files)
    }
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler )
    upload.addEventListener('click', uploadHandler)
    

}