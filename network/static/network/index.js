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
            console.log('post submitted');
            loadPosts(feed);
        })
        .catch(error => {
            console.error('stop trying to make fetch happen', error);
        })
    ;
    document.querySelector('#post-box').value = '';
}

function renderPost(post) {
    const postArea = document.createElement("div");
    postArea.className = 'post'

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
    const rule = document.createElement("hr")

    postArea.append(author, time, content, likes);
    document.querySelector('.post-view').append(postArea);
    document.querySelector('.post-view').append(rule);

}

function editPost(post) {}

function likePost(post) {}

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
