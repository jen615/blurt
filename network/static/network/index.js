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
                renderPost(posts[postsKey])
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

function renderPost(post) {
    const postArea = document.createElement("div");
    postArea.className = 'post'

    const author = document.createElement("p")
    author.innerHTML = post.author;
    const time = document.createElement("p");
    time.innerHTML = post.time;
    const content = document.createElement("p");
    content.innerHTML = post.content;
    const likes = document.createElement("p");
    likes.innerHTML =`Likes: ${post.likes}`;
    const rule = document.createElement("hr")

    postArea.append(author, time, content, likes);
    document.querySelector('.post-zone').append(postArea)
    document.querySelector('.post-zone').append(rule);

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
