from django.test import SimpleTestCase

from comptes.services.encours import add_echeances


class AddEcheanceTestCase(SimpleTestCase):
    def test_add_echeance(self):
        source = [
            {
                "date": "2024-08-01",
                "categoryId": "1",
                'amount': 500
            },
            {
                "date": "2024-08-01",
                "categoryId": "2",
                'amount': 500
            },
            {
                "date": "2024-09-01",
                "categoryId": "1",
                'amount': 250
            },
            {
                "date": "2024-09-01",
                "categoryId": "2",
                'amount': 500
            },
        ]

        dest = [
            {
                "date": "2024-08-01",
                "categoryId": "1",
                'amount': 1000
            },
            {
                "date": "2024-09-01",
                "categoryId": "1",
                'amount': 2000
            },
            {
                "date": "2024-10-01",
                "categoryId": "1",
                'amount': 3000
            }
        ]

        expected = [
            {
                "date": "2024-08-01",
                "categoryId": "1",
                'amount': 1500
            },
            {
                "date": "2024-09-01",
                "categoryId": "1",
                'amount': 2250
            },
            {
                "date": "2024-10-01",
                "categoryId": "1",
                'amount': 3000
            },
            {
                "date": "2024-08-01",
                "categoryId": "2",
                'amount': 500
            },

            {
                "date": "2024-09-01",
                "categoryId": "2",
                'amount': 500
            },

        ]

        result = add_echeances(dest, source)

        self.assertEqual(result, expected)
