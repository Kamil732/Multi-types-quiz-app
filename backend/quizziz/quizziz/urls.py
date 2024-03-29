from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.urls import path, re_path, include

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path(
        'api/',
        include([
            path('', include('quizzes.api.urls')),
            path('csrf_cookie/', views.getCSRFToken, name='set-csrf-cookie'),
            path('accounts/', include('accounts.api.urls')),
        ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html'))
]
