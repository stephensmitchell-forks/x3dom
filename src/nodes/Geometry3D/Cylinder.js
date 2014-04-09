/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### Cylinder ### */
x3dom.registerNodeType(
    "Cylinder",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DSpatialGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Cylinder.superClass.call(this, ctx);

            this.addField_SFFloat(ctx, 'radius', 1.0);
            this.addField_SFFloat(ctx, 'height', 2.0);
            this.addField_SFBool(ctx, 'bottom', true);
            this.addField_SFBool(ctx, 'top', true);
            this.addField_SFFloat(ctx, 'subdivision', 32);
            this.addField_SFBool(ctx, 'side', true);

            var sides = this._vf.subdivision;

            var geoCacheID = 'Cylinder_'+this._vf.radius+'_'+this._vf.height+'_'+this._vf.bottom+'_'+this._vf.top+'_'+
                this._vf.side+'_'+this._vf.subdivision;

            if( this._vf.useGeoCache && x3dom.geoCache[geoCacheID] !== undefined )
            {
                //x3dom.debug.logInfo("Using Cylinder from Cache");
                this._mesh = x3dom.geoCache[geoCacheID];
            }
            else
            {
                var radius = this._vf.radius;
                var height = this._vf.height / 2;

                var beta, x, z;
                var delta = 2.0 * Math.PI / sides;
                var j, k;

                if (this._vf.side)
                {
                    for (j=0, k=0; j<=sides; j++)
                    {
                        beta = j * delta;
                        x = Math.sin(beta);
                        z = -Math.cos(beta);

                        this._mesh._positions[0].push(x * radius, -height, z * radius);
                        this._mesh._normals[0].push(x, 0, z);
                        this._mesh._texCoords[0].push(1.0 - j / sides, 0);

                        this._mesh._positions[0].push(x * radius, height, z * radius);
                        this._mesh._normals[0].push(x, 0, z);
                        this._mesh._texCoords[0].push(1.0 - j / sides, 1);

                        if (j > 0)
                        {
                            this._mesh._indices[0].push(k    );
                            this._mesh._indices[0].push(k + 1);
                            this._mesh._indices[0].push(k + 2);

                            this._mesh._indices[0].push(k + 2);
                            this._mesh._indices[0].push(k + 1);
                            this._mesh._indices[0].push(k + 3);

                            k += 2;
                        }
                    }
                }

                if (radius > 0)
                {
                    var h, base = this._mesh._positions[0].length / 3;

                    if (this._vf.top)
                    {
                        for (j=sides-1; j>=0; j--)
                        {
                            beta = j * delta;
                            x = radius * Math.sin(beta);
                            z = -radius * Math.cos(beta);

                            this._mesh._positions[0].push(x, height, z);
                            this._mesh._normals[0].push(0, 1, 0);
                            this._mesh._texCoords[0].push(x / radius / 2 + 0.5, -z / radius / 2 + 0.5);
                        }

                        h = base + 1;

                        for (j=2; j<sides; j++)
                        {
                            this._mesh._indices[0].push(base);
                            this._mesh._indices[0].push(h);

                            h = base + j;
                            this._mesh._indices[0].push(h);
                        }

                        base = this._mesh._positions[0].length / 3;
                    }

                    if (this._vf.bottom)
                    {
                        for (j=sides-1; j>=0; j--)
                        {
                            beta = j * delta;
                            x = radius * Math.sin(beta);
                            z = -radius * Math.cos(beta);

                            this._mesh._positions[0].push(x, -height, z);
                            this._mesh._normals[0].push(0, -1, 0);
                            this._mesh._texCoords[0].push(x / radius / 2 + 0.5, z / radius / 2 + 0.5);
                        }

                        h = base + 1;

                        for (j=2; j<sides; j++)
                        {
                            this._mesh._indices[0].push(h);
                            this._mesh._indices[0].push(base);

                            h = base + j;
                            this._mesh._indices[0].push(h);
                        }
                    }
                }

                this._mesh._invalidate = true;
                this._mesh._numFaces = this._mesh._indices[0].length / 3;
                this._mesh._numCoords = this._mesh._positions[0].length / 3;

                x3dom.geoCache[geoCacheID] = this._mesh;
            }
        },
        {
            fieldChanged: function(fieldName) {
                if (fieldName === "radius" || fieldName === "height")
                {
                    this._mesh._positions[0] = [];

                    var radius = this._vf.radius, height = this._vf.height / 2;
                    var sides = this._vf.subdivision;

                    var beta, x, z, j;
                    var delta = 2.0 * Math.PI / sides;

                    if (this._vf.side)
                    {
                        for (j=0; j<=sides; j++)
                        {
                            beta = j * delta;
                            x = Math.sin(beta);
                            z = -Math.cos(beta);

                            this._mesh._positions[0].push(x * radius, -height, z * radius);
                            this._mesh._positions[0].push(x * radius, height, z * radius);
                        }
                    }

                    if (radius > 0)
                    {
                        var h, base = this._mesh._positions[0].length / 3;

                        if (this._vf.top)
                        {
                            for (j=sides-1; j>=0; j--)
                            {
                                beta = j * delta;
                                x = radius * Math.sin(beta);
                                z = -radius * Math.cos(beta);

                                this._mesh._positions[0].push(x, height, z);
                            }
                        }
                    }

                    if (this._vf.bottom)
                    {
                        for (j=sides-1; j>=0; j--)
                        {
                            beta = j * delta;
                            x = radius * Math.sin(beta);
                            z = -radius * Math.cos(beta);

                            this._mesh._positions[0].push(x, -height, z);
                        }
                    }

                    this.invalidateVolume();
                    this._mesh._numCoords = this._mesh._positions[0].length / 3;

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                        node.invalidateVolume();
                    });
                }
                else if (fieldName === "subdivision" || fieldName === "bottom" ||
                    fieldName === "top" || fieldName === "side")
                {
                    this._mesh._positions[0] = [];
                    this._mesh._indices[0] =[];
                    this._mesh._normals[0] = [];
                    this._mesh._texCoords[0] =[];

                    var radius = this._vf.radius, height = this._vf.height / 2;
                    var sides = this._vf.subdivision;

                    var beta, x, z, j;
                    var delta = 2.0 * Math.PI / sides;
                    var k = 0;

                    if (this._vf.side)
                    {
                        for (j=0, k=0; j<=sides; j++)
                        {
                            beta = j * delta;
                            x = Math.sin(beta);
                            z = -Math.cos(beta);

                            this._mesh._positions[0].push(x * radius, -height, z * radius);
                            this._mesh._normals[0].push(x, 0, z);
                            this._mesh._texCoords[0].push(1.0 - j / sides, 0);

                            this._mesh._positions[0].push(x * radius, height, z * radius);
                            this._mesh._normals[0].push(x, 0, z);
                            this._mesh._texCoords[0].push(1.0 - j / sides, 1);

                            if (j > 0)
                            {
                                this._mesh._indices[0].push(k + 0);
                                this._mesh._indices[0].push(k + 1);
                                this._mesh._indices[0].push(k + 2);

                                this._mesh._indices[0].push(k + 2);
                                this._mesh._indices[0].push(k + 1);
                                this._mesh._indices[0].push(k + 3);

                                k += 2;
                            }
                        }
                    }

                    if (radius > 0)
                    {
                        var h, base = this._mesh._positions[0].length / 3;

                        if (this._vf.top)
                        {
                            for (j=sides-1; j>=0; j--)
                            {
                                beta = j * delta;
                                x = radius * Math.sin(beta);
                                z = -radius * Math.cos(beta);

                                this._mesh._positions[0].push(x, height, z);
                                this._mesh._normals[0].push(0, 1, 0);
                                this._mesh._texCoords[0].push(x / radius / 2 + 0.5, -z / radius / 2 + 0.5);
                            }

                            h = base + 1;

                            for (j=2; j<sides; j++)
                            {
                                this._mesh._indices[0].push(base);
                                this._mesh._indices[0].push(h);

                                h = base + j;
                                this._mesh._indices[0].push(h);
                            }

                            base = this._mesh._positions[0].length / 3;
                        }

                        if (this._vf.bottom)
                        {
                            for (j=sides-1; j>=0; j--)
                            {
                                beta = j * delta;
                                x = radius * Math.sin(beta);
                                z = -radius * Math.cos(beta);

                                this._mesh._positions[0].push(x, -height, z);
                                this._mesh._normals[0].push(0, -1, 0);
                                this._mesh._texCoords[0].push(x / radius / 2 + 0.5, z / radius / 2 + 0.5);
                            }

                            h = base + 1;

                            for (j=2; j<sides; j++)
                            {
                                this._mesh._indices[0].push(h);
                                this._mesh._indices[0].push(base);

                                h = base + j;
                                this._mesh._indices[0].push(h);
                            }
                        }
                    }

                    this.invalidateVolume();
                    this._mesh._numFaces = this._mesh._indices[0].length / 3;
                    this._mesh._numCoords = this._mesh._positions[0].length / 3;

                    Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                        node.invalidateVolume();
                    });
                }
            }
        }
    )
);