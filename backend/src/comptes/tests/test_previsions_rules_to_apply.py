import datetime

from django.test import SimpleTestCase

from comptes.models import PrevisionRules
from comptes.services.prevision import date_where_rule_apply


class PrevisionsRuleToApplyTestCase(SimpleTestCase):

    def test_where_rule_apply(self):
        rule = PrevisionRules()
        rule.categorieId = 1
        rule.period = 1
        rule.amount = 280.0
        rule.start = datetime.date(2023, 11, 1)
        rule.end = None

        expected = [
            datetime.date(2023, 11, 1),
            datetime.date(2023, 12, 1),
            datetime.date(2024, 1, 1),
            datetime.date(2024, 2, 1),
            datetime.date(2024, 3, 1),
            datetime.date(2024, 4, 1),
            datetime.date(2024, 5, 1),
            datetime.date(2024, 6, 1),
            datetime.date(2024, 7, 1),
            datetime.date(2024, 8, 1),
            datetime.date(2024, 9, 1),
            datetime.date(2024, 10, 1),
        ]

        result = date_where_rule_apply(rule, datetime.date(2023, 11, 1), datetime.date(2024, 11, 1))
        self.assertEqual(result, expected)

    def test_where_rule_apply_2(self):
        rule = PrevisionRules()
        rule.categorieId = 1
        rule.period = 3
        rule.amount = 280.0
        rule.start = datetime.date(2023, 11, 1)
        rule.end = None

        expected = [
            datetime.date(2023, 11, 1),
            datetime.date(2024, 2, 1),
            datetime.date(2024, 5, 1),
            datetime.date(2024, 8, 1),
            datetime.date(2024, 11, 1),
        ]

        result = date_where_rule_apply(rule, datetime.date(2023, 11, 1), datetime.date(2024, 11, 15))
        self.assertEqual(result, expected)

    def test_where_rule_apply_3(self):
        rule = PrevisionRules()
        rule.categorieId = 1
        rule.period = 4
        rule.amount = 280.0
        rule.start = datetime.date(2023, 10, 1)
        rule.end = None

        expected = [
            datetime.date(2024, 2, 1),
            datetime.date(2024, 6, 1),
            datetime.date(2024, 10, 1),
        ]

        result = date_where_rule_apply(rule, datetime.date(2023, 11, 1), datetime.date(2024, 11, 1))
        self.assertEqual(result, expected)

    def test_where_rule_apply_4(self):
        rule = PrevisionRules()
        rule.categorieId = 1
        rule.period = 12
        rule.amount = -180.0
        rule.start = datetime.date(2024, 10, 1)
        rule.end = None

        expected = [
            datetime.date(2024, 10, 1)
        ]

        result = date_where_rule_apply(rule, datetime.date(2024, 1, 1), datetime.date(2024, 12, 1))
        self.assertEqual(result, expected)

    def test_where_rule_apply_5(self):
        rule = PrevisionRules()
        rule.categorieId = 1
        rule.period = 3
        rule.amount = 280.0
        rule.start = datetime.date(2022, 10, 1)
        rule.end = None

        expected = [
            datetime.date(2024, 1, 1),
            datetime.date(2024, 4, 1),
            datetime.date(2024, 7, 1),
            datetime.date(2024, 10, 1),
        ]

        result = date_where_rule_apply(rule, datetime.date(2023, 11, 1), datetime.date(2024, 11, 1))
        self.assertEqual(result, expected)

    def test_where_rule_apply_6(self):
        rule = PrevisionRules()
        rule.categorieId = 1
        rule.period = 1
        rule.amount = 66.0
        rule.start = datetime.date(2024, 4, 1)
        rule.end = None

        expected = [
            datetime.date(2024, 4, 1),
            datetime.date(2024, 5, 1),
            datetime.date(2024, 6, 1),
            datetime.date(2024, 7, 1),
            datetime.date(2024, 8, 1),
            datetime.date(2024, 9, 1),
            datetime.date(2024, 10, 1),
            datetime.date(2024, 11, 1),
        ]

        result = date_where_rule_apply(rule, datetime.date(2023, 11, 1), datetime.date(2024, 11, 21))
        self.assertEqual(result, expected)
