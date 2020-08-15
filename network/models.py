from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ForeignKey(User)
    following = models.ForeignKey
    posts = models.ForeignKey(Post, on_delete=models.CASCADE)


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=400, blank=False)
    time = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    replies = models.ForeignKey(User, on_delete=models.CASCADE)
