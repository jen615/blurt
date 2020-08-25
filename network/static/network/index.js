document.addEventListener('DOMContentLoaded', function() {


    // Make a post
    document.querySelector('#submit-post').addEventListener('click', (response) => {
        response.preventDefault();
        makePost()
    })



})

// Feed loading
function followingPosts() {
    //TODO
}

function allPosts() {
    //TODO
}

function userPosts(user) {

}

function morePosts(group) {
}

// Posting
function makePost() {
    const content = document.querySelector('#post-box').value;
    fetch('/post/', {
        method: 'POST',
        body: JSON.stringify({
            content: content
        })
    })
        .then(() => {
            console.log('post submitted')
        })
}

function editPost(post) {

}

function likePost(post) {

}

// Profiling
function loadProfile(user) {
    userPosts(user)

}

function followProfile(user) {

}
