
const portifolioContainer = document.querySelector('[data-js="portfolioContainer"]')


const typingEffect = () => {
    const typing = document.querySelector('[data-js="typing"]')

    const message = ["Web Developer"]

    let messageIndex = 0;
    let currentMessage = '';
    let changingIndex = 0;
    let Fullmensage = ''

    const type = () => {

        const lastItemMessageArray = messageIndex === message.length

        if (lastItemMessageArray) {
            messageIndex = 0
        }

        currentMessage = message[messageIndex];
        Fullmensage = currentMessage.slice(0, changingIndex++)

        typing.innerHTML = Fullmensage;

        const finishTypeMessage = currentMessage.length === Fullmensage.length

        if (finishTypeMessage) {
            messageIndex++
            changingIndex = 0;
        }
    }

    timer = setInterval(type, 200)
}

const createButtonMobileVersion = () => {
    const button = document.createElement('a')
    button.setAttribute('class', 'btn btn-primary my-2 PortButton')
    button.setAttribute('target', 'blank')
    button.setAttribute('href', 'https://github.com/igorfonseca05?tab=repositories')
    button.innerText = 'Ver mais'
    portifolioContainer.insertAdjacentElement('afterend', button)
}

const removeScrollEvent = () => {
    window.removeEventListener('scroll', makeRequest)
}

const createCardsProject = (gitHubProject) => {

    // console.log(gitHubProject)

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
    divAlert.setAttribute('id', `notification-${type}`)
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
        createButtonMobileVersion()
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
        // console.log(data.name, data.id, data.description, data.language,
        //     data.svn_url, data.homepage)
        createCardsProject(data)
    })
}

const makeRequest = () => {
    if (window.innerWidth <= 420) {
        show_Projects_If_Promise_Error('mobile')
        return
    }

    handleDatasGithub()
}

const SendEmail = () => {
    window.onload = function () {
        const form = document.getElementById('form')

        const sendButtonAnimation = () => {
            const button = [...document.querySelector('.sendButton').children]

            button.forEach(child => {
                if (child.classList.contains('addOpacity')) {
                    child.classList.toggle('removeOpacity')
                    return
                }
                child.classList.toggle('removeOpacity')
            })
        }

        const removingSubmitEvent = () => {
            form.removeEventListener('submit', sendform)
        }

        function sendform(event) {
            event.preventDefault();

            removingSubmitEvent()

            sendButtonAnimation()
            createElNotitication('success', 'Email enviado com sucesso')

            emailjs.sendForm('contact_service', 'contact_form', "form")
                .then(function () {
                    console.log('enviado')
                    sendButtonAnimation()
                    event.target.reset()
                    form.addEventListener('submit', sendform)
                }, function (error) {
                    createElNotitication('danger', 'Falha ao enviar email, tente outras formas de contato')
                });
        }
        form.addEventListener('submit', sendform)
    }
}


// const darkAndLightMode = () => {
//     const iconMode = document.querySelector('.iconMoonAndSun')

//     iconMode.addEventListener('click', (e) => {
//         iconMode.children[0].classList.toggle('hide')
//         iconMode.children[1].classList.toggle('hide')

//         const h2 = document.querySelectorAll('h2')
//         const skillsCards = document.querySelectorAll('skillsCards')
//         const sections = document.querySelectorAll('[data-js="section"]')


//         console.log(h2)

//         document.querySelectorAll('.cardProject').forEach((item, index) => {
//             console.log(index)

//             if(h2.length <= index) {
//                 console.log(h2[index])
//             }


//             item.classList.toggle('elementsTitle')
//         })
//     })
// }

typingEffect()
window.addEventListener('load', makeRequest)
SendEmail()
// darkAndLightMode()
