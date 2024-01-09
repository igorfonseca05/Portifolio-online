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
const showErrorOnScreen = message => {
    const container = document.querySelector('[data-js="container"]')
    const errorContainer = document.querySelector('[data-js="errorContainer"]')

    const divError = document.createElement('div')
    divError.setAttribute('class', 'alert alert-danger moveAlert')

    setTimeout(() => {
        divError.setAttribute('class', 'alert alert-danger hideAlert')
    }, 4000)

    divError.setAttribute('role', 'alert')
    divError.textContent = message;
    
    errorContainer.insertAdjacentElement('afterbegin', divError)
    
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
            showErrorOnScreen(error.message)
        })
}

const handleDatasGithub = async() => {
    const datas = await getDataGitHub()

    console.log(datas)
}

const makeRequest = () => {
    const portifolioContainer = document.querySelector('[data-js="portfolioContainer"]')
    const minimamHeight = portifolioContainer.getClientRects()[0].y

    if(minimamHeight <= 490) {
        // handleDatasGithub()
        removeScrollEvent()
    }
}

const removeScrollEvent = () => {
    window.removeEventListener('scroll', makeRequest)
}

window.addEventListener('scroll', makeRequest)


