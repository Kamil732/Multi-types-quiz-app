from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.template.defaultfilters import slugify
from django.templatetags.static import static


class AccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email')
        if not username:
            raise ValueError('Users must have an username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=email,
            username=username,
            password=password,
        )
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)
        return user


class Account(AbstractBaseUser, PermissionsMixin):
    DEFAULT_PROFILE_PICTURE = static('DEFAULT_PROFILE_PICTURE.png')

    email = models.EmailField(max_length=80, unique=True)
    username = models.CharField(max_length=20, unique=True)
    picture = models.ImageField(
        upload_to='images/%Y/%m/%d', default=DEFAULT_PROFILE_PICTURE, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    slug = models.SlugField(blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AccountManager()

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not(self.slug):
            self.slug = slugify(self.username[:50])

        if not(self.picture):
            self.picture = self.DEFAULT_PROFILE_PICTURE

        return super(self.__class__, self).save(*args, **kwargs)
