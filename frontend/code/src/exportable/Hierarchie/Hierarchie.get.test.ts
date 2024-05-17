const fs = require('fs');
import { Tree } from "./Tree";
import { Hierarchie } from "./Hierarchie";

it('DataTree get', () => {

    const ref: Tree<{ name: string }>[] = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref1.json'));

    const tree = new Hierarchie<{ name: string }>(ref, { name: "John Doe" })
    tree.tree = ref;

    const result = tree.get("2");

    const expected = {
        "name": "leaf11"
    }

    expect(result).toStrictEqual(expected);


});