
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("post/", views.make_post, name="post"),
    path("post/<int:post_id>", views.edit_post, name='edit'),
    path("profile/<int:user_id>", views.profile, name='profile'),
    path("feed/<str:feed>", views.load_posts, name='feed'),
]
