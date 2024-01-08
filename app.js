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