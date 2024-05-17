const fs = require('fs');
import { Tree } from "./Tree";

import { Hierarchie } from "./Hierarchie";

interface T {
    value: number
}

const defaultValue = { value: 0 };

const ref: Tree<{ value: number }>[] = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref2.json'));

it('DataTree insert brand new struct', () => {

    const dataTree = new Hierarchie<T>(ref, defaultValue);

    dataTree.set("20", { value: 50 });
    const result = dataTree.tree;

    const expected = [
        {
            "id": "1",
            "data": {
                "value": 0
            },
            "children": [
                {
                    "id": "3",
                    "data": {
                        "value": 0
                    },
                    "children": [
                        {
                            "id": "20",
                            "data": {
                                "value": 50
                            },
                            "children": []
                        }]
                }]
        }
    ]

    expect(result).toStrictEqual(expected);

});

it('DataTree insert in existing struct', () => {

    const initialState = [
        {
            "id": "1",
            "data": {
                "value": 50
            },
            "children": [
                {
                    "id": "3",
                    "data": {
                        "value": 50
                    },
                    "children": [
                        {
                            "id": "20",
                            "data": {
                                "value": 50
                            },
                            "children": []
                        }]
                }]
        }
    ];

    const dataTree = new Hierarchie<T>(ref, defaultValue);
    dataTree.tree = initialState;
    dataTree.set("2", { value: 150 });
    const result = dataTree.tree;

    const expected = [
        {
            "id": "1",
            "data": {
                "value": 50
            },
            "children": [
                {
                    "id": "3",
                    "data": {
                        "value": 50
                    },
                    "children": [
                        {
                            "id": "20",
                            "data": {
                                "value": 50
                            },
                            "children": []
                        }]
                },
                {
                    "id": "2",
                    "data": {
                        "value": 150
                    },
                    "children": []
                },]
        }
    ]

    expect(result).toStrictEqual(expected);

});