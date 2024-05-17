const fs = require('fs');
import { Tree, TreeDerivativeMethod, treeDerive } from "./Tree";

it('DataTree get', () => {

    interface T {
        value: number
    }

    const ref: Tree<{ value: number }> =
        JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref2.tree.json'));

    const derivative: TreeDerivativeMethod<T> =
        (ancestor: T, n: number, depth: number) => ([...Array(n).keys()].map((k) => {
            // console.log(ancestor);
            return ({
                value: k * ancestor.value / n
            })
        }
        ));

    const result = treeDerive(ref, derivative)
    const expected =
    {
        "id": "1",
        "data": {
            "value": 3000
        },
        "children": [
            {
                "id": "2",
                "data": {
                    "value": 0
                },
                "children": []
            },
            {
                "id": "3",
                "data": {
                    "value": 1500
                },
                "children": [
                    {
                        "id": "20",
                        "data": {
                            "value": 0
                        },
                        "children": []
                    },
                    {
                        "id": "21",
                        "data": {
                            "value": 500
                        },
                        "children": []
                    },
                    {
                        "id": "22",
                        "data": {
                            "value": 1000
                        },
                        "children": []
                    }
                ]

            }
        ]
    }
    expect(result).toStrictEqual(expected);
});