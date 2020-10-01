// Declare the working feed as a global variable
let feed = 'all';

document.addEventListener('DOMContentLoaded', function () {

    // Load all posts
    postView();
    loadPosts(feed);

    // Feed listeners
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

    // Post listener
    document.querySelector('#submit-post').addEventListener('click', (response) => {
        response.preventDefault();
        makePost(feed)
    })

    // Profile listener
    document.querySelector('#username').addEventListener('click', () => {
        loadProfile(username);
    })

})

// Feed loading
function postView() {
    document.querySelector('.profile-view').hidden = true;
    document.querySelector('#post-area').hidden = false;
    document.querySelector('.post-view').style.display = 'grid';
}

function loadPosts(feed, page = 1) {
    document.querySelector(".post-view").innerHTML = '<hr>';
    fetch(`/feed/${feed}/${page}`)
        .then(response => response.json())
        .then(response => {
            const postPack = response['posts'];
            for (const i in postPack) {
                renderPost(postPack[i])
            }

            // Create page nav area
            const pNav = document.createElement("div");
            pNav.className = 'page-area'
            document.querySelector('.post-view').append(pNav);

            //Previous page button
            if (page > 1) {
                const prevButton = document.createElement("button");
                prevButton.className = 'page-button';
                prevButton.innerHTML = 'Previous';
                prevButton.addEventListener("click", () => {
                    loadPosts(feed, page - 1)
                })
                document.querySelector('.page-area').append(prevButton);
            }

            // Next page button
            if (response['next']) {
                const nextButton = document.createElement("button");
                nextButton.className = 'page-button';
                nextButton.innerHTML = 'Next';
                nextButton.addEventListener("click", () => {
                    loadPosts(feed, page + 1)
                })
                document.querySelector('.page-area').append(nextButton);
            }
        })
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

    // Post div
    const postArea = document.createElement("div");
    postArea.className = 'post'
    postArea.id = id;

    // Post components
    const author = document.createElement("a")
    author.innerHTML = post.author;
    author.className = 'username'
    author.href = '#id';
    author.addEventListener('click', () => {
        loadProfile(post.author);
    })
    const time = document.createElement("p");
    time.className = 'timestamp';
    time.innerHTML = post.time;
    const content = document.createElement("p");
    content.className = 'content';
    content.innerHTML = post.content;
    const likes = document.createElement("p");
    likes.className = 'likes';
    likes.innerHTML = `${post.likes} ${post.likes === 1 ? 'like' : 'likes'}`;

    // Like button
    const likeButton = document.createElement("button");
    likeButton.value = id;
    likeButton.className = post['likers'].includes(username) ? 'like-button active' : 'like-button';
    likeButton.innerHTML = post['likers'].includes(username) ? ' 💔 unlike' : ' ❣ like';
    likeButton.addEventListener("click", () => {
        likePost(id);
    })

    // Edit button
    const editButton = document.createElement("button");
    editButton.value = id;
    editButton.className = 'edit-button';
    editButton.innerHTML = 'edit';
    editButton.addEventListener("click", () => {
        editPost(id);
    })

    //Separate posts with a hr
    const rule = document.createElement("hr")

    // Render post to dom, adding edit button only to the current user's posts
    postArea.append(author, time, content, likes, likeButton);
    if (post.author === username) {
        postArea.append(editButton);
    }

    //TODO: Move this to the load feed function so that new posts can be prepended
    // to the post view w/o refreshing whole view and edited posts can be modified in place.
    // The new return would be the postArea.

    document.querySelector('.post-view').append(postArea);
    document.querySelector('.post-view').append(rule);

}

// PUT requests
function editPost(id) {
    // Check to see if other edit-boxes are open
    if (document.querySelector('#edit-box')) {
        alert('only one post is editable at a time')
        return;
    }

    // Get original post contents
    const post = document.getElementById(`${id}`)
    let content = post.children[2];

    // Create editable textarea
    const editField = document.createElement("textarea")
    editField.id = 'edit-box';
    editField.innerHTML = content.innerHTML;

    // Edit request
    editField.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            fetch(`/post/edit/${id}`, {
                headers: {'X-CSRFToken': csrftoken},
                method: 'PUT',
                body: JSON.stringify({
                    content: editField.value
                })
            })
                .then(res => {
                    if (!res.ok) {
                        alert('invalid message');
                        return;
                    }
                    content.innerHTML = `${editField.value}`;
                    post.replaceChild(content, editField);

                })
        }
    })

    // Convert post to textarea
    post.replaceChild(editField, post.children[2])
}

function likePost(id) {
    const post = document.getElementById(`${id}`);
    let lButton = post.children[4];
    fetch(`/post/like/${id}`, {
        headers: {'X-CSRFToken': csrftoken},
        method: 'PUT',
    })
        .then(res => {
            if (!res.ok) {
                alert('cannot like this post');
                return;
            }
            if (lButton.className.includes('active')) {
                lButton.innerHTML = '❣ like';
                lButton.className = 'like-button'
            } else {
                lButton.innerHTML = '💔 unlike';
                lButton.className = 'like-button active';
            }

        })
}

function followProfile(user) {
    fetch(`/profile/follow/${user}`, {
        headers: {'X-CSRFToken': csrftoken},
        method: 'PUT',
    })
        .then(res => {
            if (!res.ok) {
                alert('cannot follow user');
                return;
            }
            loadProfile(user);
        })
}

// Profiling
function loadProfile(user) {
    feed = user;
    document.querySelector('.post-view').innerHTML = '';
    document.querySelector('.profile-view').hidden = false;
    document.querySelector('#post-area').hidden = true;

    loadPosts(feed);

    let profileName = document.querySelector('#profile-username').innerHTML = user;


    fetch(`/profile/${user}`)
        .then(response => response.json())
        .then(profile => {
            document.querySelector('#follower-count').innerHTML = profile.followers.length;
            document.querySelector('#following-count').innerHTML = profile.following.length;
            // Create follow button, get rid of old one

            let fButton = document.createElement("button");
            fButton.id = 'follow-button';
            fButton.innerHTML = profile.followers.includes(username) ? '🚶‍♀️Unfollow' : '🚶‍♀️Follow';
            fButton.addEventListener('click', () => {
                followProfile(user);
            })

            if (!document.getElementById('follow-button')) {
                document.querySelector('.profile-view').append(fButton);
            } else {
                document.getElementById('follow-button').remove();
                document.querySelector('.profile-view').append(fButton);
            }

            document.querySelector('#follow-button').disabled = profileName === username;


        })

}

