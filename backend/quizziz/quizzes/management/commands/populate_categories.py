from django.core.management.base import BaseCommand

from quizzes.models import Category

CATEGORY = (
    ('general_knowledge', 'General knowledge'),
    ('celebrities', 'Celebrities'),
    ('for_kids', 'For kids'),
    ('movies', 'Movies'),
    ('geography', 'Geography'),
    ('history', 'History'),
    ('literature', 'Literature'),
    ('people', 'People'),
    ('music', 'Music'),
    ('science', 'Science'),
    ('policy', 'Policy'),
    ('nature', 'Nature'),
    ('psychology', 'Psychology'),
    ('religion', 'Religion'),
    ('entertainment', 'Entertainment'),
    ('sport', 'Sport'),
    ('technology', 'Technology'),
    ('television', 'Television'),
    ('funny', 'Funny'),
    ('puzzles', 'Puzzles'),
    ('health_and_beauty', 'Health and beauty'),
    ('animals', 'Animals'),
)


class Command(BaseCommand):
    help = 'Populate database with categories'

    def _create_tags(self):
        for category in CATEGORY:
            Category.objects.get_or_create(name=category[0], display_name=category[1])

    def handle(self, *args, **options):
        print('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=')
        print('Wait\n')
        try:
            self._create_tags()
        finally:
            print('complete!')
            print(
                '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=')
