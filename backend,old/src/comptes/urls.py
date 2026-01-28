from comptes.views import MainView
from django.urls import path

main_view = MainView()

urlpatterns = [
    path("", main_view.index, name="index"),
    path("get-extraits", main_view.get_extraits, name="get-extraits"),
    path("filter-extraits", main_view.filter_extraits, name="filter-extraits"),
    path("get-categories", main_view.get_categories, name="get-categories"),
    path(
        "get-categories-tree", main_view.get_categories_tree, name="get-categories-tree"
    ),
    path(
        "add-extrait-line/<date_operation>/<montant>/<path:label>",
        main_view.add_extrait_line,
        name="add-extrait-line",
    ),
    path("get-months", main_view.get_months, name="get-months"),
    path("set-category/<int:id_category>", main_view.set_category, name="set-category"),
    path("add-category/<name>", main_view.add_category, name="add-category"),
    path(
        "move-category/<int:id_category>/<int:id_target>",
        main_view.move_category,
        name="move-category",
    ),
    path(
        "rename-category/<int:id>/<str:new_name>",
        main_view.rename_category,
        name="rename-category",
    ),
    path("delete-category/<int:id>", main_view.delete_category, name="rename-category"),
    path("set-date-reference", main_view.set_refdate, name="set-date-reference"),
    path("synthese-category", main_view.synthese_category, name="synthese-category"),
    path(
        "last-insertion-date", main_view.last_insertion_date, name="last-insertion-date"
    ),
    path(
        "delete-last-insertion-date",
        main_view.delete_last_insertion_date,
        name="delete-last-insertion-date",
    ),
    path("upload-extraits", main_view.upload_extraits, name="upload-extraits"),
    path("add-note/<int:id>", main_view.add_note, name="add-note"),
    path("previsions/rules", main_view.previsions_rules, name="previsions-rules"),
    path("previsions/rule", main_view.previsions_rule, name="previsions-rule"),
    path(
        "previsions/rule/<int:id>/delete",
        main_view.previsions_rule_delete,
        name="previsions-rule-delete",
    ),
    path(
        "previsions/echeancier",
        main_view.create_previsions_echeancier,
        name="echeancier",
    ),
    path(
        "previsions/echeancier/<int:id>",
        main_view.previsions_echeancier,
        name="echeancier",
    ),
    path(
        "previsions/echeancier/<int:id>/delete",
        main_view.previsions_echeancier_delete,
        name="echeancier_delete",
    ),
    path(
        "previsions/echeanciers",
        main_view.previsions_echeanciers,
        name="echeanciers",
    ),
    path(
        "previsions/echeances/<str:start>/<str:end>",
        main_view.previsions_echeances,
        name="echeanciers",
    ),
    path(
        "previsions/list",
        main_view.previsions_list,
        name="previsions_list"
    ),
    path(
        "update-category-color/<int:id>/<color>",
        main_view.update_category_color,
        name="update-category-color",
    ),
    path("solde", main_view.get_solde, name="solde"),
    path("encours", main_view.get_encours, name="encours"),
    path("month-summary/<int:year>/<int:month>", main_view.get_month_summary)
]
