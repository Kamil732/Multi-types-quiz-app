from django.contrib import admin

from .models import (
    Quiz,
    QuizFeedback,
    Question,
    Category,
    Section,
    Answer
)


class QuestionAdminInline(admin.StackedInline):
    model = Question
    extra = 0


class QuizAdmin(admin.ModelAdmin):
    model = Quiz
    inlines = [QuestionAdminInline]


admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizFeedback)
admin.site.register(Category)
admin.site.register(Section)


admin.site.register(Question)

admin.site.register(Answer)
