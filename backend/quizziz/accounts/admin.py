from django.contrib import admin

from .models import Account
from quizzes.models import Quiz


class QuizzesInlineAdmin(admin.StackedInline):
    model = Quiz
    extra = 0


class AccountAdmin(admin.ModelAdmin):
    model = Account
    inlines = [QuizzesInlineAdmin]


admin.site.register(Account, AccountAdmin)
