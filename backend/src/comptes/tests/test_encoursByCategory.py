from comptes.services.encours import EncoursService, regroup_by_category

from django.test import SimpleTestCase


class MyTestCase(SimpleTestCase):
    def test_regroup(self):
        encours = [
            {
                "categoryId": "1",
                'amount': 500
            },
            {
                "categoryId": "2",
                'amount': 500
            },
            {
                "categoryId": "1",
                'amount': 250
            },
        ]

        expected = [
            {
                "categoryId": "1",
                'amount': 750
            },
            {
                "categoryId": "2",
                'amount': 500
            }
        ]

        result = regroup_by_category(encours)
        self.assertEqual(result, expected)
