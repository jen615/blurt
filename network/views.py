import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def get_followers(user):
    user = User.objects.get(username=user)
    followers = User.objects.filter(following=user.id)
    return {'followers': f'{len(followers)}'}


def profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    if request.method != "GET":
        return JsonResponse({"error": "must be a GET request"}, status=400)

    response = user.serialize()
    response.update(get_followers(username))

    return JsonResponse(response, safe=False)


@login_required
def make_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    user = request.user
    if not user:
        return JsonResponse({'error': 'user must be logged in'})
    data = json.loads(request.body)
    print(request.user)
    print(data)
    content = data['content']

    post = Post(
        author=user,
        content=content
    )

    try:
        post.full_clean()
    except ValueError as e:
        return JsonResponse({'message': 'invalid post'}, status=418)

    post.save()

    return JsonResponse({'message': 'Post successful'}, status=201)


@login_required
def edit_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if post.author != request.user:
        return JsonResponse({'error': 'you are not authorized to edit this post'})

    if request.method == "PUT":
        data = json.loads(request.body)
        print(data)
        if data.get("content") != post.content:
            post.content = data["content"]
            post.save()
            return JsonResponse({'message': 'Edit successful'}, status=201)

    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@login_required
def load_posts(request, feed):
    user = User.objects.get(username=request.user)
    if feed == 'all':
        posts = Post.objects.all()
    elif feed == 'following':
        posts = Post.objects.filter(
            author__in=user.following.all()
        )
    else:
        posts = Post.objects.filter(
            author=User.objects.get(username=feed)
        )

    # Return posts in reverse order
    posts = posts.order_by('-time').all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


@login_required
def like_post(request, post_id):
    user = User.objects.get(username=request.user)
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "PUT":
        if user not in post.likes.all():
            post.likes.add(user)
        else:
            post.likes.remove(user)

    post.save()
    return JsonResponse({'message': 'like successful'}, status=200)
