document.addEventListener('DOMContentLoaded', function() {

    let feed = 'all';

    // Load all posts
    postView();
    loadPosts(feed);

    document.querySelector('#following-feed').addEventListener('click', () => {
        feed = 'following';
        postView();
        loadPosts(feed)
    })

    document.querySelector('#all-feed').addEventListener('click', () => {
        feed = 'all';
        postView();
        loadPosts(feed)
    })

    // Make a post
    document.querySelector('#submit-post').addEventListener('click', (response) => {
        response.preventDefault();
        makePost(feed)
    })



})

// Feed loading
function postView(){
    document.querySelector('.profile-view').hidden = true;
    document.querySelector('.post-view').style.display = 'block';
}

function loadPosts(feed) {
    document.querySelector(".post-view").innerHTML = '<hr>';
    fetch(`/feed/${feed}`)
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            console.log(posts.length); //TODO add if logic later to truncate to 20 posts
            for (const postsKey in posts) {
                renderPost(posts[postsKey])
            }
        })
}

function morePosts(group) {
}

// Posting
function makePost(feed) {
    const content = document.querySelector('#post-box').value;
    fetch('/post/', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            content: content
        })
    })
        .then(res => {
            if (!res.ok) {
                alert('invalid message');
                return;
            }
            loadPosts(feed);
        })
    document.querySelector('#post-box').value = '';
}

function renderPost(post) {

    const id = post.id;

    const postArea = document.createElement("div");
    postArea.className = 'post'
    postArea.id = id;

    const author = document.createElement("a")
    author.innerHTML = post.author;
    author.className = 'username'
    author.href = '#';
    author.addEventListener('click', () => {
        loadProfile(post.author);
    })
    const time = document.createElement("p");
    time.innerHTML = post.time;
    const content = document.createElement("p");
    content.innerHTML = post.content;
    const likes = document.createElement("p");
    likes.innerHTML =`Likes: ${post.likes}`;


    // Like button
    const likeButton = document.createElement("button");
    likeButton.value = id;
    likeButton.className = 'like-button';
    likeButton.innerHTML = ' ❣ like'
    likeButton.addEventListener("click", () =>{
        likePost(id);
    })

    // Edit button
    const editButton = document.createElement("button");
    editButton.value = id;
    editButton.className = 'edit-button';
    editButton.innerHTML= 'edit';
    editButton.addEventListener("click", () => {
        editPost(id);
    })

    //Separate with a hr
    const rule = document.createElement("hr")

    // Render post to dom, adding edit button only to the current user's posts
    postArea.append(author, time, content, likes, likeButton);
    if (post.author === username) {
        postArea.append(editButton);
    }
    document.querySelector('.post-view').append(postArea);
    document.querySelector('.post-view').append(rule);

}

// PUT requests
function editPost(id) {

}

function likePost(id) {

}

// Profiling
function loadProfile(user) {
    document.querySelector('.post-view').innerHTML= '';
    document.querySelector('.profile-view').hidden = false;
    document.querySelector('#profile-username').innerHTML = user;

    fetch(`/profile/${user}`)
        .then(response => response.json())
        .then(profile => {
            console.log(profile);
            document.querySelector('#follower-count').innerHTML= profile.followers;
            document.querySelector('#following-count').innerHTML= profile.following;
        })

    loadPosts(user)


    console.log(`profile for ${user}`)

}

function followProfile(user) {

}
