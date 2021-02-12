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

            return author_slug == request.user.slug if request.user.is_authenticated else False
        return True


class IsOwnerEverything(BasePermission):
    def has_permission(self, request, view):
        author_slug = view.kwargs.get('author_slug')

        return author_slug == request.user.slug if request.user.is_authenticated else False
