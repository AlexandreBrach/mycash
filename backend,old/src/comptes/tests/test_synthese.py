from comptes.services.synthese import SyntheseService
from django.test import SimpleTestCase
from unittest_data_provider import data_provider


class SyntheseTestCase(SimpleTestCase):
    def setUp(self):
        self.synthese_service = SyntheseService()

    def group_by_category_provider():
        raw = [{
            'name': 'cat1',
            'amount': 500,
            'month_year': '10-2020'
        }, {
            'name': 'cat2',
            'amount': 1500,
            'month_year': '9-2020'
        }, {
            'name': 'cat2',
            'amount': 1200,
            'month_year': '11-2020'
        }]

        expected = {
            'cat1': {
                '11-2020': 0,
                '10-2020': 500,
                '9-2020': 0
            },
            'cat2': {
                '11-2020': 1200,
                '10-2020': 0,
                '9-2020': 1500
            }
        }

        return ((raw, expected),)

    @data_provider(group_by_category_provider)
    def test_group_by_category(self, raw, expected):
        """ synthesis raw results can be grouped by category
        """

        grouped = self.synthese_service.group_by_category(raw)
        self.assertEqual(grouped, expected)

    def group_by_month_provider():
        raw = [{
            'categorie_id': 'cat1',
            'amount': 500,
            'month_year': '10-2020'
        }, {
            'categorie_id': 'cat2',
            'amount': 1500,
            'month_year': '9-2020'
        }, {
            'categorie_id': 'cat2',
            'amount': 1200,
            'month_year': '11-2020'
        }]

        expected = {
            '9-2020': {
                'cat1': 0,
                'cat2': 1500
            },
            '10-2020': {
                'cat1': 500,
                'cat2': 0
            },
            '11-2020': {
                'cat1': 0,
                'cat2': 1200
            }
        }

        return ((raw, expected),)

    @data_provider(group_by_month_provider)
    def test_group_by_month(self, raw, expected):
        """ synthesis raw results can be grouped by category
        """

        grouped = self.synthese_service.group_by_month(raw)
        self.assertEqual(grouped, expected)
