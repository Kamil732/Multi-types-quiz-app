from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from math import ceil
# import urllib


class QuizListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

    # def get_previous_link(self):
    #     previous_link = urllib.parse.urlparse(super(self.__class__, self).get_previous_link())
    #     previous_page = int(previous_link.query.split('=')[1]) if previous_link.query else None

    #     return previous_page

    # def get_next_link(self):
    #     next_link = urllib.parse.urlparse(super(self.__class__, self).get_next_link())
    #     next_page = int(next_link.query.split('=')[1]) if next_link.query else None

    #     return next_page

    def get_page_count(self):
        return ceil(self.page.paginator.count/10)

    # def get_previous_link(self):
    #     if not(self.page.has_previous()):
    #         return None

    #     return self.page.previous_page_number()

    # def get_next_link(self):
    #     if not(self.page.has_next()):
    #         return None

    #     return self.page.next_page_number()

    def get_paginated_response(self, data):
        return Response({
            # 'nextPage': self.get_next_link(),
            # 'previousPage': self.get_previous_link(),
            'pageCount': self.get_page_count(),
            'results': data
        })
