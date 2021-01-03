from rest_framework.permissions import BasePermission, SAFE_METHODS


class CreateIsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        if not(request.method in SAFE_METHODS):
            return request.user.is_authenticated
        return True


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        if not(request.method in SAFE_METHODS):
            author_slug = view.kwargs.get('author_slug')
            slug = view.kwargs.get('slug')

            try:
                quiz = Quiz.objects.get(author__slug=author_slug, slug=slug)
            except:
                return False

            return quiz.author == request.user
        return True
