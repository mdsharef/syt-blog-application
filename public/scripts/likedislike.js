window.onload = function() {
    let likeBtn = document.getElementById('likeBtn')
    let dislikeBtn = document.getElementById('dislikeBtn')

    likeBtn.addEventListener('click', function(e) {
        let postId = likeBtn.dataset.post

        reqLikeDislike('likes', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? 'Liked' : 'Like'
                likeText = likeText + `( ${data.totalLikes} )`
                let dislikeText = `Dislike ( ${data.totalDislikes} )`

                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e.message)
                alert(e.message)
            })
    })
    
    dislikeBtn.addEventListener('click', function(e) {
        let postId = dislikeBtn.dataset.post

        reqLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
                dislikeText = dislikeText + `( ${data.totalDislikes} )`
                let likeText = `Like ( ${data.totalLikes} )`

                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e.message)
                alert(e.message)
            })
    })

    function reqLikeDislike(type, postId) {
        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }

    
}