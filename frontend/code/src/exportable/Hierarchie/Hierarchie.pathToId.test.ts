const fs = require('fs');
import { Tree } from "./Tree";
import { Hierarchie } from "./Hierarchie";

it('DataTree get', () => {

    const ref: Tree<{ name: string }>[] = JSON.parse(fs.readFileSync('./src/exportable/Hierarchie/tests-assets/ref2.json'));
    const tree = new Hierarchie<{ name: string }>(ref, { name: "John Do" })

    const result = tree.pathToId("21");

    const expected = ["1", "3"];


    expect(result).toStrictEqual(expected);


});