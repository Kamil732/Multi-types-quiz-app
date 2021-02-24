from django.contrib import admin

from .models import (
    Quiz,
    QuizFeedback,
    QuizPunctation,
    Question,
    Category,
    Section,
    PsychologyResults,
    Answer
)


class QuestionAdminInline(admin.StackedInline):
    model = Question
    extra = 0


class QuizAdmin(admin.ModelAdmin):
    model = Quiz
    inlines = [QuestionAdminInline]
    readonly_fields = ('id',)


admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizFeedback)
admin.site.register(QuizPunctation)
admin.site.register(PsychologyResults)
admin.site.register(Category)
admin.site.register(Section)


admin.site.register(Question)

admin.site.register(Answer)
