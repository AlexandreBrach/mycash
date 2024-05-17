const fs = require('fs');

import { _generatePath } from "./Hierarchie";

it('Tree generate arborescence', () => {


    interface T {
        value: number
    }
    const reducer = (curr: T, prev: T) => ({ value: curr.value + prev.value });
    const defaultValue = { value: 0 };

    const result = _generatePath(["10", "20", "666"], { value: 1664 }, { value: 0 })

    const expected =
    {
        "id": "10",
        "data": {
            "value": 0
        },
        "children": [
            {
                "id": "20",
                "data": {
                    "value": 0
                },
                "children": [
                    {
                        "id": "666",
                        "data": {
                            "value": 1664
                        },
                        "children": []
                    }]
            }]
    }

    expect(result).toStrictEqual(expected);
});