const fs = require('fs');
import { Tree, treeFlatten } from "./Tree";

it('DataTree get', () => {

    interface T {
        value: number
    }

    const ref: Array<Tree<T>> = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref2.json'));

    const result = treeFlatten<T>(ref)

    const expected =
        [
            {
                "id": "1",
                "data": {
                    "value": 3000
                }
            },
            {
                "id": "2",
                "data": {
                    "value": 100
                },
            },
            {
                "id": "3",
                "data": {
                    "value": -1
                },
            },
            {
                "id": "20",
                "data": {
                    "value": 100
                },
            },
            {
                "id": "21",
                "data": {
                    "value": 100
                },
            },
            {
                "id": "22",
                "data": {
                    "value": 100
                },
            },
            {
                "id": "4",
                "data": {
                    "value": 0
                },
            },
            {
                "id": "5",
                "data": {
                    "value": 2000
                }
            },
            {
                "id": "6",
                "data": {
                    "value": 20
                }
            }
        ];

    expect(result).toStrictEqual(expected);
});