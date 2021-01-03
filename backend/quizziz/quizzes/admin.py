from django.contrib import admin

from .models import (
    Quiz,
    Question,
    Category,
    Section,
    PsychologyAnswer,
    PreferentialAnswer,
    PsychologyResults,
    UniversalAnswer,
)


class QuestionAdminInline(admin.StackedInline):
    model = Question
    extra = 0


class QuizAdmin(admin.ModelAdmin):
    model = Quiz
    inlines = [QuestionAdminInline]


admin.site.register(Quiz, QuizAdmin)
admin.site.register(Category)
admin.site.register(Section)


admin.site.register(Question)

admin.site.register(PsychologyAnswer)
admin.site.register(PsychologyResults)

admin.site.register(PreferentialAnswer)
admin.site.register(UniversalAnswer)
