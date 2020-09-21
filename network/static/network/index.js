document.addEventListener('DOMContentLoaded', function() {

    // Load all posts
    allPosts();
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
    fetch('/feed/all')
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            console.log(posts.length);
            console.log(posts[5].author);
            for (const postsKey in posts) {
                console.log(posts[postsKey].content)
            }
        })
}

function userPosts(user) {

}

function morePosts(group) {
}

// Posting
function makePost() {
    const content = document.querySelector('#post-box').value;
    fetch('/post/', {
        headers: {'X-CSRFToken': csrftoken},
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
