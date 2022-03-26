let form = document.getElementById('form')
let handleSubmit = async (e) => {
    e.preventDefault()
    window.open('room/', '_self')
}

form.addEventListener('submit', handleSubmit)