from django.contrib import admin

# Register your models here.
from network.models import User, Post


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    fields = ['username', 'first_name', 'email', 'followers', 'following']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['time', 'content', 'author']
    fields = ['author', 'content', 'likes']
