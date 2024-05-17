const fs = require('fs');
import { Tree, treeReduce } from "./Tree";

it('Tree map', () => {

    const ref: Tree<{ value: number }> = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref2.tree.json'));

    interface T {
        value: number
    }

    const reducer = (curr: T, prev: T) => ({ value: curr.value + prev.value });

    const result = treeReduce(ref, reducer, { value: 0 })

    const expected =
    {
        "id": "1",
        "data": {
            "value": 400
        },
        "children": [
            {
                "id": "2",
                "data": {
                    "value": 100
                },
                "children": []
            },
            {
                "id": "3",
                "data": {
                    "value": 300
                },
                "children": [
                    {
                        "id": "20",
                        "data": {
                            "value": 100
                        },
                        "children": []
                    },
                    {
                        "id": "21",
                        "data": {
                            "value": 100
                        },
                        "children": []
                    },
                    {
                        "id": "22",
                        "data": {
                            "value": 100
                        },
                        "children": []
                    }
                ]

            }
        ]
    }

    expect(result).toStrictEqual(expected);
});