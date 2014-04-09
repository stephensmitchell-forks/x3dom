/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### X3DInfoNode ### */
x3dom.registerNodeType(
    "X3DInfoNode",
    "Core",
    defineClass(x3dom.nodeTypes.X3DChildNode,
        function (ctx) {
            x3dom.nodeTypes.X3DInfoNode.superClass.call(this, ctx);
        }
    )
);