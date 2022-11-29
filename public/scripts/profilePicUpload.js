window.onload = function() {
    let baseCropping = $('#cropped-image').croppie({
        enableExif: true,
        viewport: { width: 100, height: 100 },
        boundary: { width: 300, height: 300 },
        showZoomer: false,
        enableResize: true,
        enableOrientation: true,
        mouseWheelZoom: 'ctrl'
    })

    $('#profilePicFile').on('change', function(e) {
        let reader = new FileReader();
        reader.onload = function (event) {
            baseCropping.croppie('bind', {
                url: event.target.result
            }).then(() => {
                $('.cr-slider').attr({
                    'min': 0.5000,
                    'max': 1.5000
                })
                console.log('jQuery bind complete')
            })
        }
        reader.readAsDataURL(this.files[0])
        $('#crop-modal').modal('show')
    })

    $('#cancel-cropping').on('click', function () {
        $('#crop-modal').modal('hide')
        $('#profilePicFile').value = '';
    })

    $('#upload-image').on('click', function () {
        baseCropping.croppie('result', 'blob').then((blob) => {
            let formData = new FormData()
            let file = document.getElementById('profilePicFile').files[0]
            let name = generateFileName(file.name)
            formData.append('profilePic', blob, name)

            let headers = new Headers()
            headers.append('Accept', 'application/json')
            // headers.append('Content-Type', 'application/json')

            let req = new Request('/uploads/profile-pic', {
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData
            })
            return fetch(req)
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('removeProfilePic').style.display = 'block'
            document.getElementById('profile-pic').src = data.profilePic
            document.getElementById('profilePicForm').reset()

            $('#crop-modal').modal('hide')
        })
    })

    function generateFileName(name) {
        let types = /(.jpeg|.jpg|.png|.gif)/
        return name.replace(types, '.png')
    }

    $('#removeProfilePic').on('click', function () {
        let req = new Request('/uploads/profile-pic', {
            method: 'DELETE',
            mode: 'cors'
        })

        fetch(req)
            .then(res => res.json())
            .then(data => {
                document.getElementById('removeProfilePic').style.display = 'none'
                document.getElementById('profile-pic').src = data.profilePic
                document.getElementById('profilePicForm').reset()
            })
            .catch(e => {
                console.log(e)
                alert('Server Error Occurred!')
            })

    })
}



//**Vanilla JavaScript */

// window.onload = function() {
//     let el = documet.getElementById('cropped-image')
//     let baseCropping = new Croppie(el, {
//         viewport: {
//             width: 200,
//             height: 200
//         },
//         boundary: {
//             width: 300,
//             height: 300
//         },
//         showZoomer: true
//     })

//     function readableFile(file) {
//         let reader = new FileReader();
//         reader.onload = function (event) {
//             baseCropping.bind({
//                 url: event.target.result
//             }).then(() => {
//                 document.getElementsByClassName('cr-slider').attr({
//                     'min': 0.5000,
//                     'max': 1.5000
//                 })
//             })
//         }
//         reader.readAsDataURL(file)
//     }

//     documet.getElementById('profilePicFile').addEventListener('change', function(e) {
//         if(this.files[0]) {
//             readableFile(this.files[0])
//             document.getElementById('crop-modal').modal('show')
//         }
//     })

//     document.getElementById('cancel-cropping').addEventListener('click', function () {
//         document.getElementById('crop-modal').modal('hide')
//         setTimeout(() => {
//             baseCropping.destroy()
//         }, 1000)
//     })
// }

//** Others trial */

// window.onload = function() {
//     var el = document.getElementById('cropped-image');
//     var baseCropping = new Croppie(el, {
//         viewport: { width: 100, height: 100 },
//         boundary: { width: 300, height: 300 },
//         showZoomer: false,
//         enableResize: true,
//         enableOrientation: true,
//         mouseWheelZoom: 'ctrl'
//     });
//     documet.getElementById('profilePicFile').addEventListener('change', function(e) {
//         let reader = new FileReader();
//         reader.onload = function (event) {
//             baseCropping.bind({
//                 url: event.target.result,
//             }).then(() => {
//                 document.getElementsByClassName('cr-slider').attr({
//                     'min': 0.5000,
//                     'max': 1.5000
//                 })
//             })
//         }
//         reader.readAsDataURL(this.files[0])
//         document.getElementById('crop-modal').modal('show')
//     })
//     //on button click
//     baseCropping.result('blob').then(function(blob) {
//         // do something with cropped blob
//     });

//     document.getElementById('cancel-cropping').addEventListener('click', function () {
//         document.getElementById('crop-modal').modal('hide')
//         setTimeout(() => {
//             baseCropping.destroy()
//         }, 1000)
//     })
// }

/** Second Other Trial */

// window.onload = function() {
//     let baseCropping = $('#cropped-image').croppie({
//         viewport: {
//             width: 200,
//             height: 200
//         },
//         boundary: {
//             width: 300,
//             height: 300
//         },
//         showZoomer: true
//     })

//     function readableFile(file) {
//         let reader = new FileReader();
//         reader.onload = function (event) {
//             baseCropping.croppie('bind', {
//                 url: event.target.result
//             }).then(() => {
//                 $('.cr-slider').attr({
//                     'min': 0.5000,
//                     'max': 1.5000
//                 })
//             })
//         }
//         reader.readAsDataURL(file)
//     }

//     $('#profilePicFile').on('change', function(e) {
//         if(this.file[0]) {
//             readableFile(this.file[0])
//             $('#crop-modal').modal({
//                 backdrop: 'static',
//                 keyboard: false
//             })
//         }
//     })

//     $('#cancel-cropping').on('click', function () {
//         $('#crop-modal').modal('hide')
//         setTimeout(() => {
//             baseCropping.croppie('destroy')
//         }, 1000)
//     })
// }