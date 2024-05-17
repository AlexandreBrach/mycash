const fs = require('fs');
import { Tree, treeMap, treeReduce } from "./Tree";

it('DataTree get', () => {

    interface T {
        name: string
    }

    interface T2 {
        uppercase: string
    }

    const ref: Array<Tree<T>> = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref1.json'));

    const method = (curr: T): T2 => ({ uppercase: curr.name.toUpperCase() });

    const result = treeMap<T, T2>(ref, method);

    const expected =
        [
            {
                "id": "1",
                "data": {
                    "uppercase": "BRANCH1"
                },
                "children": [
                    {
                        "id": "2",
                        "data": {
                            "uppercase": "LEAF11"
                        },
                        "children": []
                    },
                    {
                        "id": "3",
                        "data": {
                            "uppercase": "LEAF12"
                        },
                        "children": []
                    }
                ]
            },
            {
                "id": "4",
                "data": {
                    "uppercase": "BRANCH2"
                },
                "children": [
                    {
                        "id": "5",
                        "data": {
                            "uppercase": "LEAF21"
                        },
                        "children": []
                    },
                    {
                        "id": "6",
                        "data": {
                            "uppercase": "LEAF22"
                        },
                        "children": []
                    }
                ]
            }
        ];

    expect(result).toStrictEqual(expected);
});