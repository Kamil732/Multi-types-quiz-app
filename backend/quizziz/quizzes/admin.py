from django.contrib import admin

from .models import (
    Quiz,
    QuizFeedback,
    QuizPunctation,
    Question,
    Category,
    PsychologyResults,
    Answer
)


class QuizPunctationAdmin(admin.ModelAdmin):
    model = QuizPunctation
    readonly_fields = ('id', 'slug',)


class PsychologyResultsAdmin(admin.ModelAdmin):
    model = QuizPunctation
    readonly_fields = ('id', 'slug',)


admin.site.register(Quiz)
admin.site.register(QuizFeedback)
admin.site.register(QuizPunctation, QuizPunctationAdmin)
admin.site.register(PsychologyResults, PsychologyResultsAdmin)
admin.site.register(Category)


admin.site.register(Question)

admin.site.register(Answer)
