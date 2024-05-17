const fs = require('fs');
import { Tree, TreeDerivativeMethod, treeDerive } from "../exportable/Hierarchie/Tree";
import { camaieuDerivative } from "./categories";

it('tree to options', () => {

    const categories: Array<Tree<{ color: string }>> =
        JSON.parse(fs.readFileSync('./src/helpers/tests-assets/categories-colors.json'));

    const result = categories.map((t) => treeDerive<{ color: string }>(t, camaieuDerivative));

    const expected = [
        {
            "id": "28",
            "data": {
                "color": "#FF0000"
            },
            "children": []
        },
        {
            "id": "42",
            "data": {
                "color": "#ff005b"
            },
            "children": [
                {
                    "id": "26",
                    "data": {
                        "color": "#D52A67"
                    },
                    "children": []
                },
                {
                    "id": "30",
                    "data": {
                        "color": "#AA5573"
                    },
                    "children": []
                }
            ]
        },
        {
            "id": "43",
            "data": {
                "color": "#36ff00"
            },
            "children": [
                {
                    "id": "19",
                    "data": {
                        "color": "#45E619"
                    },
                    "children": []
                },
                {
                    "id": "20",
                    "data": {
                        "color": "#53CC33"
                    },
                    "children": []
                },
                {
                    "id": "22",
                    "data": {
                        "color": "#62B34D"
                    },
                    "children": []
                },
                {
                    "id": "23",
                    "data": {
                        "color": "#719966"
                    },
                    "children": []
                }
            ]
        },
        {
            "id": "45",
            "data": {
                "color": "#00ff6e"
            },
            "children": [
                {
                    "id": "46",
                    "data": {
                        "color": "#2AD574"
                    },
                    "children": [
                        {
                            "id": "16",
                            "data": {
                                "color": "#71E3A2"
                            },
                            "children": []
                        },
                        {
                            "id": "17",
                            "data": {
                                "color": "#B8F1D1"
                            },
                            "children": []
                        }
                    ]
                },
                {
                    "id": "47",
                    "data": {
                        "color": "#55AA7A"
                    },
                    "children": [
                        {
                            "id": "15",
                            "data": {
                                "color": "#8EC6A6"
                            },
                            "children": []
                        },
                        {
                            "id": "18",
                            "data": {
                                "color": "#C6E3D3"
                            },
                            "children": []
                        }
                    ]
                }
            ]
        }
    ];

    expect(result).toStrictEqual(expected);
});