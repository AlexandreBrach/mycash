import mptt.utils
from comptes.models import Categorie
from django.db import IntegrityError
from comptes.exceptions import DuplicatedEntry

class CategoryService:
    def get_entire_tree(self):
        """ return the entire tree of category
       """
        qs = Categorie.objects.all()
        response = []
        for categorie in qs:
            response.append({'id': categorie.id, 'name': categorie.name})
        return response

    def get_categories(self):
        '''
        return categories
        '''
        qs = Categorie.objects.all()
        response = []
        for categorie in qs:
            response.append({'id': categorie.id, 'name': categorie.name})
        return response

    def add_category(self, name):

        try:
            category = Categorie.objects.create(name=name)
            category.save()
        except IntegrityError:
            raise DuplicatedEntry("Category already exists")

    def move(self, id, target):
        if target == 0:
            ancestor = None
        else:
            ancestor = Categorie.objects.get(id=target)
        child = Categorie.objects.get(id=id)
        child.move_to(ancestor, position='first-child')

    def rename(self, id, new_name):
        categorie = Categorie.objects.get(id=id)
        categorie.name = new_name
        categorie.save()

    def delete(self, id):
        categorie = Categorie.objects.filter(id=id).delete()

    def update_color(self, id, color):
        categorie = Categorie.objects.get(id=id)
        categorie.color = color
        categorie.save()
