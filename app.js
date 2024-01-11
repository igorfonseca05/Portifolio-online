


// Manipulação do Dom

const removeScrollEvent = () => {
    window.removeEventListener('scroll', makeRequest)
}

const createCardsProject = (gitHubProject) => {

    // console.log(gitHubProject)

    const portifolioContainer = document.querySelector('[data-js="portfolioContainer"]')

    // console.log(gitHubProject.name, gitHubProject.description, gitHubProject.language,
    //     gitHubProject.svn_url, gitHubProject.homepage)


    const elCardWrapper = document.createElement("div")
    elCardWrapper.setAttribute('class', 'projectsContainer col-lg-3 col-md-4 card-wrapper')

    const elCard = document.createElement('div')
    elCard.setAttribute('class', 'card mt-4')

    const elCardBody = document.createElement('div')
    elCardBody.setAttribute('class', 'card-body text-center cardProject')

    const elCardTitle = document.createElement("h6")
    elCardTitle.setAttribute('class', 'card-title')
    elCardTitle.innerText = gitHubProject.name

    const elCardText = document.createElement('p')
    elCardText.setAttribute('class', 'language card-text text-secondary')
    elCardText.innerText = gitHubProject.language

    const elIconsContainer = document.createElement('div')
    elIconsContainer.setAttribute('class', 'icons')

    const infosLinks = [
        { link: gitHubProject.homepage, title: 'Site', classIcon: 'fas fa-external-link-alt' },
        { link: gitHubProject.svn_url, title: 'GitHub Repository', classIcon: 'fab fa-github' }
    ]


    infosLinks.forEach(info => {
        const elProjectLink = document.createElement('a')
        const icon = document.createElement('i')

        if (info.link) {
            elProjectLink.setAttribute('href', `${info.link}`)
            icon.setAttribute('class', `${info.classIcon}`)
        }

        elProjectLink.setAttribute('target', '_blanck')
        elProjectLink.setAttribute('title', `${info.title}`)

        elProjectLink.append(icon)
        elIconsContainer.appendChild(elProjectLink)

    })

    // Botão Collapse
    const elCollapseContainer = document.createElement('p')

    const elLinkCollapse = document.createElement('a')
    elLinkCollapse.setAttribute('href', `#${gitHubProject.id}`)
    elLinkCollapse.setAttribute('type', 'button')
    elLinkCollapse.setAttribute('class', 'collapseButton btn btn-primary')
    elLinkCollapse.setAttribute('data-bs-toggle', 'collapse')

    const iconCollapse = document.createElement('span')
    iconCollapse.setAttribute('class', 'material-symbols-outlined')
    iconCollapse.innerText = 'expand_more'


    const divCollapse = document.createElement('div')
    divCollapse.setAttribute('class', 'collapse')
    divCollapse.setAttribute('id', `${gitHubProject.id}`)

    const divInternalText = document.createElement('div')
    divInternalText.setAttribute('class', 'card card-body')
    divInternalText.innerText = gitHubProject.description


    elLinkCollapse.appendChild(iconCollapse)
    divCollapse.appendChild(divInternalText)
    elCollapseContainer.append(elLinkCollapse, divCollapse)


    // Creating final element
    elCardWrapper.appendChild(elCard)
    elCard.appendChild(elCardBody)
    elCardBody.append(elCardTitle, elCardText, elIconsContainer, elCollapseContainer)

    portifolioContainer.insertAdjacentElement('afterbegin', elCardWrapper)

}

function showErrorOnScreen(alertContainer, divAlert) {
    alertContainer.insertAdjacentElement('afterbegin', divAlert);
}


const waitErrorAndRemoveDiv = alertContainer => {
    setTimeout(() => alertContainer.classList.add('removeAlertContainer'), 5500)
}

const removeLoader = () => document.querySelector('.loader').style.display = 'none'

const removingErrorElement = (divAlert, alertContainer, type) => {
    setTimeout(() => {
        divAlert.setAttribute('class', `alert alert-${type} hideAlert`)
        removeLoader()
    }, 4500)

    waitErrorAndRemoveDiv(alertContainer)
}

const createElNotitication = (type, message) => {
    const alertContainer = document.querySelector('[data-js="errorContainer"]')

    alertContainer.classList.remove('removeAlertContainer')


    const divAlert = document.createElement('div')
    divAlert.setAttribute('role', 'alert')
    divAlert.setAttribute('class', `alert alert-${type} moveAlert`)
    divAlert.innerText = message;

    removingErrorElement(divAlert, alertContainer, type)
    showErrorOnScreen(alertContainer, divAlert)

}

const showLoader = () => document.querySelector('.loader').style.display = 'block'

const show_Projects_If_Promise_Error = () => {
    showLoader()

    const getLocalDatas = () => fetch('dados.json')
        .then(async (res) => {
            const errorRequest = res.status === 404;

            if (errorRequest) throw new Error('Impossivel obter dados')

            removeLoader()
            return await res.json()

        })
        .catch(error => {
            createElNotitication("danger", error.message)
        })

    const handlePromise = async () => {
        const localDatas = await getLocalDatas()
        localDatas.forEach(data => {
            createCardsProject(data)
        })
    }

    handlePromise()
}

const getDataGitHub = () => {
    showLoader()
    const resultRequest = fetch('http://api.github.com/users/igorfonseca05/repos')
        .then(async (res) => {
            const errorRequest = res.status === 404;

            const msgError =
                'Falha na requisição dos dados da API, \n veja alguns projetos disponiveis Offline'

            if (errorRequest) throw new Error(msgError)

            removeLoader()
            return await res.json()

        })
        .catch(error => {
            show_Projects_If_Promise_Error()
            createElNotitication('danger', error.message)
        })

    return resultRequest
}

const handleDatasGithub = async () => {
    const datas = await getDataGitHub()
    datas.forEach(data => {
        createCardsProject(data)
    })

}

const sendButtonAnimation = () => {
    const button = document.querySelector('.sendButton')
    console.log(button)

}

sendButtonAnimation()


const SendEmail = () => {
    window.onload = function () {
        const form = document.getElementById('form')


        form.addEventListener('submit', function (event) {
            event.preventDefault();

            emailjs.sendForm('contact_service', 'contact_form', "form")
                .then(function () {
                    console.log('enviado')
                    createElNotitication('success', 'Email enviado')
                    event.target.reset()
                }, function (error) {
                    createElNotitication('danger', 'Falha ao enviar email, tente outras formas de contato')
                });
    
           });
    }
 
}

SendEmail()
handleDatasGithub()



const makeRequest = () => {
    const portifolioContainer = document.querySelector('[data-js="portfolioContainer"]')
    const minimamHeight = portifolioContainer.getClientRects()[0].top

    if (minimamHeight <= 490) {
        // console.log('o')
        handleDatasGithub()
        removeScrollEvent()
    }
}

// window.addEventListener('scroll', makeRequest)


