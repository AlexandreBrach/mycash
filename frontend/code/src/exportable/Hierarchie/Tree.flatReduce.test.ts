const fs = require('fs');
import { FlatTree, Tree, treeFlatReduce } from "./Tree";

it('Tree map', () => {

    const ref: Tree<{ value: number }> = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref3.tree.json'));
    const flat: FlatTree<{ montant: number }> = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref3.flattree.json'));
    interface T {
        montant: number
    }

    const reducer = (curr: T, prev: T) => ({ montant: curr.montant + prev.montant });

    const result = treeFlatReduce([ref], flat, reducer, { montant: 0 })

    const expected =
        [
            {
                "id": "1",
                "data": {
                    "montant": 300
                }
            },
            {
                "id": "2",
                "data": {
                    "montant": 100
                }
            },
            {
                "id": "3",
                "data": {
                    "montant": 200
                }
            },
            {
                "id": "21",
                "data": {
                    "montant": 100
                }
            },
            {
                "id": "22",
                "data": {
                    "montant": 100
                }
            },
            {
                "id": "202",
                "data": {
                    "montant": 10
                }
            },
            {
                "id": "211",
                "data": {
                    "montant": 30
                }
            },
            {
                "id": "210",
                "data": {
                    "montant": 20
                }
            },
            {
                "id": "121",
                "data": {
                    "montant": 40
                }
            }

        ]
    expect(
        result.sort(
            (a, b) => (parseInt(a.id) - parseInt(b.id))
        ))
        .toStrictEqual(

            expected.sort(
                (a, b) => (parseInt(a.id) - parseInt(b.id)))
        );
});