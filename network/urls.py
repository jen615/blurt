
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("post/", views.make_post, name="post"),
    path("post/edit/<int:post_id>", views.edit_post, name='edit'),
    path("post/like/<int:post_id>", views.like_post, name='like'),
    path("profile/<str:username>", views.profile, name='profile'),
    path("feed/<str:feed>", views.load_posts, name='feed'),
]
