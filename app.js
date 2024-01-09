// Inicializando o serviço de E-mail
window.onload = function() {
    const form = document.getElementById('contact-form')

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        emailjs.sendForm('contact_service', 'contact_form', this)
            .then(function() {
                console.log('SUCCESS!');
            }, function(error) {
                console.log('FAILED...', error);
            });
    });
}

// Manipulação do Dom

const removeScrollEvent = () => {
    window.removeEventListener('scroll', makeRequest)
}

const createCardProject = (gitHubProject) => {

    // console.log(gitHubProject.name, gitHubProject.description, gitHubProject.language,
    //     gitHubProject.svn_url, gitHubProject.homepage)

    const elCardWrapper = document.createElement("div")
    elCardWrapper.setAttribute('class', 'projectsContainer col-lg-3 col-md-4 card-wrapper')

    const elCard = document.createElement('div')
    elCard.setAttribute('class', 'card mt-4')
    
    const elCardBody = document.createElement('div')
    elCardBody.setAttribute('class', 'card-body text-center')

    const elCardTitle =  document.createElement("h6")
    elCardTitle.setAttribute('class', 'card-title')
    elCardTitle.innerText = ''

    const elCardText  = document.createElement('p')
    elCardText.setAttribute('class', 'card-text text-secondary')
    elCardText.innerText = 'language'
    
    const elIconsContainer = document.createElement('div')
    elIconsContainer.setAttribute('class', 'icons')
    
    const infosLinks = [
        {link: 'link site' , title: 'Project Link', classIcon: 'fas fa-external-link-alt' },
        {link: 'link git' , title: 'GitHub Repository', classIcon: 'fab fa-github' }
    ]

   infosLinks.forEach(info => {

        const elProjectLink = document.createElement('a')
        elProjectLink.setAttribute('href',`${info.link}`)
        elProjectLink.setAttribute('target', '_blanck')
        elProjectLink.setAttribute('title', `${info.title}`)

        const icon = document.createElement('i')
        icon.setAttribute('class', `${info.classIcon}`)

        elProjectLink.append(icon)
        
        elIconsContainer.appendChild(elProjectLink)
    })
    
    // Botão Collapse
    const elCollapseContainer  = document.createElement('p')

    const elLinkCollapse = document.createElement('a')
    elLinkCollapse.setAttribute('href', '#collapse')
    elLinkCollapse.setAttribute('type', 'button')
    elLinkCollapse.setAttribute('class', 'collapseButton btn btn-primary')
    elLinkCollapse.setAttribute('data-bs-toggle', 'collapse')

    const iconCollapse = document.createElement('span')
    iconCollapse.setAttribute('class', 'material-symbols-outlined')
    iconCollapse.innerText = 'expand_more'

    
    const divCollapse = document.createElement('div')
    divCollapse.setAttribute('class', 'collapse')
    divCollapse.setAttribute('id', 'collapse')

    const divInternalText = document.createElement('div')
    divInternalText.setAttribute('class', 'card card-body')
    divInternalText.innerText = 'Descrição projeto'
    

    elLinkCollapse.appendChild(iconCollapse)

    divCollapse.appendChild(divInternalText)

    elCollapseContainer.append(elLinkCollapse, divCollapse)


    // Creating final element
   elCardWrapper.appendChild(elCard)
   elCard.appendChild(elCardBody)
   elCardBody.append(elCardTitle, elCardText, elIconsContainer, elCollapseContainer)

   return elCardWrapper


    
}

// console.log(createCardProject())


function showErrorOnScreen(errorContainer, divError) {
    errorContainer.insertAdjacentElement('afterbegin', divError);
}

const removingErrorElement = (divError) => {
    setTimeout(() => {
        divError.setAttribute('class', 'alert alert-danger hideAlert')
    }, 4000)
}

const createElementError = message => {
    const errorContainer = document.querySelector('[data-js="errorContainer"]')

    const divError = document.createElement('div')
    divError.setAttribute('role', 'alert')
    divError.setAttribute('class', 'alert alert-danger moveAlert')
    divError.innerText = message;

    removingErrorElement(divError)
    showErrorOnScreen(errorContainer, divError)
    
}

const getDataGitHub = () => {
     return fetch('http://api.github.com/users/igorfonseca05/repos')
        .then(async(res) => {

            if(res.status === 404) {
                throw new Error('Falha na requisição dos dados da API')
            }
           return await res.json()

        })
        .catch(error => {
            createElementError(error.message)
        })
}

const handleDatasGithub = async() => {
    const datas = await getDataGitHub()

    console.log(datas[0])

    // datas.forEach(data => {
    //     createCardProject(data)
    // })
}

const makeRequest = () => {
    const portifolioContainer = document.querySelector('[data-js="portfolioContainer"]')
    const minimamHeight = portifolioContainer.getClientRects()[0].top
    
    if(minimamHeight <= 490) {
        console.log('o')
        // handleDatasGithub()
        removeScrollEvent()
    }
}

window.addEventListener('scroll', makeRequest)


