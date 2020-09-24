from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", blank=True, related_name='followers',
                                       symmetrical=False)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'following': len(self.following.all()),
        }


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    content = models.CharField(max_length=400, blank=False)
    time = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, related_name='fans')

    def serialize(self):
        return {
            'id': self.id,
            'author': f'{self.author}',
            'time': self.time.strftime("%b %-d %Y, %-I:%M %p"),
            'content': self.content,
            'likes': len(self.likes.all()),
        }
