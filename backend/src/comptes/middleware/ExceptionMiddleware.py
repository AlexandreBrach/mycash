from django.http import  JsonResponse
from comptes.exceptions import DuplicatedEntry

class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, DuplicatedEntry):
            return JsonResponse({'response': 'Already exists'},status=409)