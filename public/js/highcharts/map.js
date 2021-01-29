/*
 Highmaps JS v7.0.2 (2019-01-17)
 Highmaps as a plugin for Highcharts or Highstock.

 (c) 2011-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (z) {
    "object" === typeof module && module.exports ? (z["default"] = z, module.exports = z) : "function" === typeof define && define.amd ? define(function () {
        return z
    }) : z("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (z) {
    (function (a) {
        var m = a.addEvent,
            g = a.Axis,
            p = a.pick;
        m(g, "getSeriesExtremes", function () {
            var a = [];
            this.isXAxis && (this.series.forEach(function (d, r) {
                d.useMapGeometry && (a[r] = d.xData, d.xData = [])
            }), this.seriesXData = a)
        });
        m(g, "afterGetSeriesExtremes", function () {
            var a = this.seriesXData,
                d, t, g;
            this.isXAxis && (d = p(this.dataMin, Number.MAX_VALUE), t = p(this.dataMax, -Number.MAX_VALUE), this.series.forEach(function (e, b) {
                e.useMapGeometry && (d = Math.min(d, p(e.minX, d)), t = Math.max(t, p(e.maxX, t)), e.xData = a[b], g = !0)
            }), g && (this.dataMin = d, this.dataMax = t), delete this.seriesXData)
        });
        m(g, "afterSetAxisTranslation", function () {
            var a = this.chart,
                d;
            d = a.plotWidth / a.plotHeight;
            var a = a.xAxis[0],
                g;
            "yAxis" === this.coll && void 0 !== a.transA && this.series.forEach(function (a) {
                a.preserveAspectRatio && (g = !0)
            });
            if (g && (this.transA =
                    a.transA = Math.min(this.transA, a.transA), d /= (a.max - a.min) / (this.max - this.min), d = 1 > d ? this : a, a = (d.max - d.min) * d.transA, d.pixelPadding = d.len - a, d.minPixelPadding = d.pixelPadding / 2, a = d.fixTo)) {
                a = a[1] - d.toValue(a[0], !0);
                a *= d.transA;
                if (Math.abs(a) > d.minPixelPadding || d.min === d.dataMin && d.max === d.dataMax) a = 0;
                d.minPixelPadding -= a
            }
        });
        m(g, "render", function () {
            this.fixTo = null
        })
    })(z);
    (function (a) {
        var m = a.addEvent,
            g = a.Axis,
            p = a.Chart,
            r = a.color,
            d, t = a.extend,
            x = a.isNumber,
            e = a.Legend,
            b = a.LegendSymbolMixin,
            f = a.noop,
            w = a.merge,
            q = a.pick;
        a.ColorAxis || (d = a.ColorAxis = function () {
            this.init.apply(this, arguments)
        }, t(d.prototype, g.prototype), t(d.prototype, {
            defaultColorAxisOptions: {
                lineWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 1,
                tickPixelInterval: 72,
                startOnTick: !0,
                endOnTick: !0,
                offset: 0,
                marker: {
                    animation: {
                        duration: 50
                    },
                    width: .01,
                    color: "#999999"
                },
                labels: {
                    overflow: "justify",
                    rotation: 0
                },
                minColor: "#e6ebf5",
                maxColor: "#003399",
                tickLength: 5,
                showInLegend: !0
            },
            keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem",
                "legendSymbol"
            ].concat(g.prototype.keepProps),
            init: function (c, l) {
                var h = "vertical" !== c.options.legend.layout,
                    a;
                this.coll = "colorAxis";
                a = w(this.defaultColorAxisOptions, {
                    side: h ? 2 : 1,
                    reversed: !h
                }, l, {
                    opposite: !h,
                    showEmpty: !1,
                    title: null,
                    visible: c.options.legend.enabled
                });
                g.prototype.init.call(this, c, a);
                l.dataClasses && this.initDataClasses(l);
                this.initStops();
                this.horiz = h;
                this.zoomEnabled = !1;
                this.defaultLegendLength = 200
            },
            initDataClasses: function (c) {
                var l = this.chart,
                    h, a = 0,
                    k = l.options.chart.colorCount,
                    n = this.options,
                    b = c.dataClasses.length;
                this.dataClasses = h = [];
                this.legendItems = [];
                c.dataClasses.forEach(function (c, v) {
                    c = w(c);
                    h.push(c);
                    if (l.styledMode || !c.color) "category" === n.dataClassColor ? (l.styledMode || (v = l.options.colors, k = v.length, c.color = v[a]), c.colorIndex = a, a++, a === k && (a = 0)) : c.color = r(n.minColor).tweenTo(r(n.maxColor), 2 > b ? .5 : v / (b - 1))
                })
            },
            setTickPositions: function () {
                if (!this.dataClasses) return g.prototype.setTickPositions.call(this)
            },
            initStops: function () {
                this.stops = this.options.stops || [
                    [0, this.options.minColor],
                    [1, this.options.maxColor]
                ];
                this.stops.forEach(function (c) {
                    c.color = r(c[1])
                })
            },
            setOptions: function (c) {
                g.prototype.setOptions.call(this, c);
                this.options.crosshair = this.options.marker
            },
            setAxisSize: function () {
                var c = this.legendSymbol,
                    l = this.chart,
                    h = l.options.legend || {},
                    a, k;
                c ? (this.left = h = c.attr("x"), this.top = a = c.attr("y"), this.width = k = c.attr("width"), this.height = c = c.attr("height"), this.right = l.chartWidth - h - k, this.bottom = l.chartHeight - a - c, this.len = this.horiz ? k : c, this.pos = this.horiz ? h : a) : this.len = (this.horiz ?
                    h.symbolWidth : h.symbolHeight) || this.defaultLegendLength
            },
            normalizedValue: function (c) {
                this.isLog && (c = this.val2lin(c));
                return 1 - (this.max - c) / (this.max - this.min || 1)
            },
            toColor: function (c, l) {
                var a = this.stops,
                    b, k, n = this.dataClasses,
                    v, y;
                if (n)
                    for (y = n.length; y--;) {
                        if (v = n[y], b = v.from, a = v.to, (void 0 === b || c >= b) && (void 0 === a || c <= a)) {
                            k = v.color;
                            l && (l.dataClass = y, l.colorIndex = v.colorIndex);
                            break
                        }
                    } else {
                        c = this.normalizedValue(c);
                        for (y = a.length; y-- && !(c > a[y][0]););
                        b = a[y] || a[y + 1];
                        a = a[y + 1] || b;
                        c = 1 - (a[0] - c) / (a[0] - b[0] ||
                            1);
                        k = b.color.tweenTo(a.color, c)
                    }
                return k
            },
            getOffset: function () {
                var c = this.legendGroup,
                    a = this.chart.axisOffset[this.side];
                c && (this.axisParent = c, g.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = a)
            },
            setLegendColor: function () {
                var c, a = this.reversed;
                c = a ? 1 : 0;
                a = a ? 0 : 1;
                c = this.horiz ? [c, 0, a, 0] : [0, a, 0, c];
                this.legendColor = {
                    linearGradient: {
                        x1: c[0],
                        y1: c[1],
                        x2: c[2],
                        y2: c[3]
                    },
                    stops: this.stops
                }
            },
            drawLegendSymbol: function (c, a) {
                var l =
                    c.padding,
                    b = c.options,
                    k = this.horiz,
                    n = q(b.symbolWidth, k ? this.defaultLegendLength : 12),
                    v = q(b.symbolHeight, k ? 12 : this.defaultLegendLength),
                    y = q(b.labelPadding, k ? 16 : 30),
                    b = q(b.itemDistance, 10);
                this.setLegendColor();
                a.legendSymbol = this.chart.renderer.rect(0, c.baseline - 11, n, v).attr({
                    zIndex: 1
                }).add(a.legendGroup);
                this.legendItemWidth = n + l + (k ? b : y);
                this.legendItemHeight = v + l + (k ? y : 0)
            },
            setState: function (c) {
                this.series.forEach(function (a) {
                    a.setState(c)
                })
            },
            visible: !0,
            setVisible: f,
            getSeriesExtremes: function () {
                var c =
                    this.series,
                    a = c.length;
                this.dataMin = Infinity;
                for (this.dataMax = -Infinity; a--;) c[a].getExtremes(), void 0 !== c[a].valueMin && (this.dataMin = Math.min(this.dataMin, c[a].valueMin), this.dataMax = Math.max(this.dataMax, c[a].valueMax))
            },
            drawCrosshair: function (c, a) {
                var b = a && a.plotX,
                    l = a && a.plotY,
                    k, n = this.pos,
                    v = this.len;
                a && (k = this.toPixels(a[a.series.colorKey]), k < n ? k = n - 2 : k > n + v && (k = n + v + 2), a.plotX = k, a.plotY = this.len - k, g.prototype.drawCrosshair.call(this, c, a), a.plotX = b, a.plotY = l, this.cross && !this.cross.addedToColorAxis &&
                    this.legendGroup && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.addedToColorAxis = !0, this.chart.styledMode || this.cross.attr({
                        fill: this.crosshair.color
                    })))
            },
            getPlotLinePath: function (c, a, b, f, k) {
                return x(k) ? this.horiz ? ["M", k - 4, this.top - 6, "L", k + 4, this.top - 6, k, this.top, "Z"] : ["M", this.left, k, "L", this.left - 6, k + 6, this.left - 6, k - 6, "Z"] : g.prototype.getPlotLinePath.call(this, c, a, b, f)
            },
            update: function (c, a) {
                var b = this.chart,
                    l = b.legend;
                this.series.forEach(function (c) {
                    c.isDirtyData = !0
                });
                c.dataClasses && l.allItems && (l.allItems.forEach(function (c) {
                    c.isDataClass && c.legendGroup && c.legendGroup.destroy()
                }), b.isDirtyLegend = !0);
                b.options[this.coll] = w(this.userOptions, c);
                g.prototype.update.call(this, c, a);
                this.legendItem && (this.setLegendColor(), l.colorizeItem(this, !0))
            },
            remove: function () {
                this.legendItem && this.chart.legend.destroyItem(this);
                g.prototype.remove.call(this)
            },
            getDataClassLegendSymbols: function () {
                var c = this,
                    l = this.chart,
                    h = this.legendItems,
                    e = l.options.legend,
                    k = e.valueDecimals,
                    n = e.valueSuffix || "",
                    v;
                h.length || this.dataClasses.forEach(function (y, e) {
                    var A = !0,
                        d = y.from,
                        u = y.to;
                    v = "";
                    void 0 === d ? v = "\x3c " : void 0 === u && (v = "\x3e ");
                    void 0 !== d && (v += a.numberFormat(d, k) + n);
                    void 0 !== d && void 0 !== u && (v += " - ");
                    void 0 !== u && (v += a.numberFormat(u, k) + n);
                    h.push(t({
                        chart: l,
                        name: v,
                        options: {},
                        drawLegendSymbol: b.drawRectangle,
                        visible: !0,
                        setState: f,
                        isDataClass: !0,
                        setVisible: function () {
                            A = this.visible = !A;
                            c.series.forEach(function (c) {
                                c.points.forEach(function (c) {
                                    c.dataClass === e && c.setVisible(A)
                                })
                            });
                            l.legend.colorizeItem(this,
                                A)
                        }
                    }, y))
                });
                return h
            },
            name: ""
        }), ["fill", "stroke"].forEach(function (c) {
            a.Fx.prototype[c + "Setter"] = function () {
                this.elem.attr(c, r(this.start).tweenTo(r(this.end), this.pos), null, !0)
            }
        }), m(p, "afterGetAxes", function () {
            var c = this.options.colorAxis;
            this.colorAxis = [];
            c && new d(this, c)
        }), m(e, "afterGetAllItems", function (c) {
            var b = [],
                h = this.chart.colorAxis[0];
            h && h.options && h.options.showInLegend && (h.options.dataClasses ? b = h.getDataClassLegendSymbols() : b.push(h), h.series.forEach(function (b) {
                a.erase(c.allItems, b)
            }));
            for (h = b.length; h--;) c.allItems.unshift(b[h])
        }), m(e, "afterColorizeItem", function (c) {
            c.visible && c.item.legendColor && c.item.legendSymbol.attr({
                fill: c.item.legendColor
            })
        }), m(e, "afterUpdate", function (c, a, b) {
            this.chart.colorAxis[0] && this.chart.colorAxis[0].update({}, b)
        }))
    })(z);
    (function (a) {
        var m = a.defined,
            g = a.noop,
            p = a.seriesTypes;
        a.colorPointMixin = {
            isValid: function () {
                return null !== this.value && Infinity !== this.value && -Infinity !== this.value
            },
            setVisible: function (a) {
                var d = this,
                    r = a ? "show" : "hide";
                d.visible = !!a;
                ["graphic", "dataLabel"].forEach(function (a) {
                    if (d[a]) d[a][r]()
                })
            },
            setState: function (r) {
                a.Point.prototype.setState.call(this, r);
                this.graphic && this.graphic.attr({
                    zIndex: "hover" === r ? 1 : 0
                })
            }
        };
        a.colorSeriesMixin = {
            pointArrayMap: ["value"],
            axisTypes: ["xAxis", "yAxis", "colorAxis"],
            optionalAxis: "colorAxis",
            trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
            getSymbol: g,
            parallelArrays: ["x", "y", "value"],
            colorKey: "value",
            pointAttribs: p.column.prototype.pointAttribs,
            translateColors: function () {
                var a = this,
                    d = this.options.nullColor,
                    g = this.colorAxis,
                    p = this.colorKey;
                this.data.forEach(function (e) {
                    var b = e[p];
                    if (b = e.options.color || (e.isNull ? d : g && void 0 !== b ? g.toColor(b, e) : e.color || a.color)) e.color = b
                })
            },
            colorAttribs: function (a) {
                var d = {};
                m(a.color) && (d[this.colorProp || "fill"] = a.color);
                return d
            }
        }
    })(z);
    (function (a) {
        function m(a) {
            a && (a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        }

        function g(a) {
            this.init(a)
        }
        var p = a.addEvent,
            r = a.Chart,
            d = a.doc,
            t = a.extend,
            x = a.merge,
            e = a.pick;
        g.prototype.init =
            function (a) {
                this.chart = a;
                a.mapNavButtons = []
            };
        g.prototype.update = function (b) {
            var f = this.chart,
                d = f.options.mapNavigation,
                q, c, l, h, u, k = function (c) {
                    this.handler.call(f, c);
                    m(c)
                },
                n = f.mapNavButtons;
            b && (d = f.options.mapNavigation = x(f.options.mapNavigation, b));
            for (; n.length;) n.pop().destroy();
            e(d.enableButtons, d.enabled) && !f.renderer.forExport && a.objectEach(d.buttons, function (a, b) {
                q = x(d.buttonOptions, a);
                f.styledMode || (c = q.theme, c.style = x(q.theme.style, q.style), h = (l = c.states) && l.hover, u = l && l.select);
                a = f.renderer.button(q.text,
                    0, 0, k, c, h, u, 0, "zoomIn" === b ? "topbutton" : "bottombutton").addClass("highcharts-map-navigation highcharts-" + {
                    zoomIn: "zoom-in",
                    zoomOut: "zoom-out"
                } [b]).attr({
                    width: q.width,
                    height: q.height,
                    title: f.options.lang[b],
                    padding: q.padding,
                    zIndex: 5
                }).add();
                a.handler = q.onclick;
                a.align(t(q, {
                    width: a.width,
                    height: 2 * a.height
                }), null, q.alignTo);
                p(a.element, "dblclick", m);
                n.push(a)
            });
            this.updateEvents(d)
        };
        g.prototype.updateEvents = function (a) {
            var b = this.chart;
            e(a.enableDoubleClickZoom, a.enabled) || a.enableDoubleClickZoomTo ?
                this.unbindDblClick = this.unbindDblClick || p(b.container, "dblclick", function (a) {
                    b.pointer.onContainerDblClick(a)
                }) : this.unbindDblClick && (this.unbindDblClick = this.unbindDblClick());
            e(a.enableMouseWheelZoom, a.enabled) ? this.unbindMouseWheel = this.unbindMouseWheel || p(b.container, void 0 === d.onmousewheel ? "DOMMouseScroll" : "mousewheel", function (a) {
                b.pointer.onContainerMouseWheel(a);
                m(a);
                return !1
            }) : this.unbindMouseWheel && (this.unbindMouseWheel = this.unbindMouseWheel())
        };
        t(r.prototype, {
            fitToBox: function (a, f) {
                [
                    ["x",
                        "width"
                    ],
                    ["y", "height"]
                ].forEach(function (b) {
                    var d = b[0];
                    b = b[1];
                    a[d] + a[b] > f[d] + f[b] && (a[b] > f[b] ? (a[b] = f[b], a[d] = f[d]) : a[d] = f[d] + f[b] - a[b]);
                    a[b] > f[b] && (a[b] = f[b]);
                    a[d] < f[d] && (a[d] = f[d])
                });
                return a
            },
            mapZoom: function (a, f, d, r, c) {
                var b = this.xAxis[0],
                    h = b.max - b.min,
                    u = e(f, b.min + h / 2),
                    k = h * a,
                    h = this.yAxis[0],
                    n = h.max - h.min,
                    v = e(d, h.min + n / 2),
                    n = n * a,
                    u = this.fitToBox({
                        x: u - k * (r ? (r - b.pos) / b.len : .5),
                        y: v - n * (c ? (c - h.pos) / h.len : .5),
                        width: k,
                        height: n
                    }, {
                        x: b.dataMin,
                        y: h.dataMin,
                        width: b.dataMax - b.dataMin,
                        height: h.dataMax - h.dataMin
                    }),
                    k = u.x <= b.dataMin && u.width >= b.dataMax - b.dataMin && u.y <= h.dataMin && u.height >= h.dataMax - h.dataMin;
                r && (b.fixTo = [r - b.pos, f]);
                c && (h.fixTo = [c - h.pos, d]);
                void 0 === a || k ? (b.setExtremes(void 0, void 0, !1), h.setExtremes(void 0, void 0, !1)) : (b.setExtremes(u.x, u.x + u.width, !1), h.setExtremes(u.y, u.y + u.height, !1));
                this.redraw()
            }
        });
        p(r, "beforeRender", function () {
            this.mapNavigation = new g(this);
            this.mapNavigation.update()
        });
        a.MapNavigation = g
    })(z);
    (function (a) {
        var m = a.extend,
            g = a.pick,
            p = a.Pointer;
        a = a.wrap;
        m(p.prototype, {
            onContainerDblClick: function (a) {
                var d =
                    this.chart;
                a = this.normalize(a);
                d.options.mapNavigation.enableDoubleClickZoomTo ? d.pointer.inClass(a.target, "highcharts-tracker") && d.hoverPoint && d.hoverPoint.zoomTo() : d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(.5, d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
            },
            onContainerMouseWheel: function (a) {
                var d = this.chart,
                    g;
                a = this.normalize(a);
                g = a.detail || -(a.wheelDelta / 120);
                d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(Math.pow(d.options.mapNavigation.mouseWheelSensitivity,
                    g), d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
            }
        });
        a(p.prototype, "zoomOption", function (a) {
            var d = this.chart.options.mapNavigation;
            g(d.enableTouchZoom, d.enabled) && (this.chart.options.chart.pinchType = "xy");
            a.apply(this, [].slice.call(arguments, 1))
        });
        a(p.prototype, "pinchTranslate", function (a, d, g, p, e, b, f) {
            a.call(this, d, g, p, e, b, f);
            "map" === this.chart.options.chart.type && this.hasZoom && (a = p.scaleX > p.scaleY, this.pinchTranslateDirection(!a, d, g, p, e, b, f, a ? p.scaleX : p.scaleY))
        })
    })(z);
    (function (a) {
        var m = a.colorPointMixin,
            g = a.extend,
            p = a.isNumber,
            r = a.merge,
            d = a.noop,
            t = a.pick,
            x = a.isArray,
            e = a.Point,
            b = a.Series,
            f = a.seriesType,
            w = a.seriesTypes,
            q = a.splat;
        f("map", "scatter", {
            animation: !1,
            dataLabels: {
                crop: !1,
                formatter: function () {
                    return this.point.value
                },
                inside: !0,
                overflow: !1,
                padding: 0,
                verticalAlign: "middle"
            },
            marker: null,
            nullColor: "#f7f7f7",
            stickyTracking: !1,
            tooltip: {
                followPointer: !0,
                pointFormat: "{point.name}: {point.value}\x3cbr/\x3e"
            },
            turboThreshold: 0,
            allAreas: !0,
            borderColor: "#cccccc",
            borderWidth: 1,
            joinBy: "hc-key",
            states: {
                hover: {
                    halo: null,
                    brightness: .2
                },
                normal: {
                    animation: !0
                },
                select: {
                    color: "#cccccc"
                }
            }
        }, r(a.colorSeriesMixin, {
            type: "map",
            getExtremesFromAll: !0,
            useMapGeometry: !0,
            forceDL: !0,
            searchPoint: d,
            directTouch: !0,
            preserveAspectRatio: !0,
            pointArrayMap: ["value"],
            getBox: function (c) {
                var b = Number.MAX_VALUE,
                    h = -b,
                    d = b,
                    k = -b,
                    n = b,
                    v = b,
                    y = this.xAxis,
                    f = this.yAxis,
                    e;
                (c || []).forEach(function (c) {
                    if (c.path) {
                        "string" === typeof c.path && (c.path = a.splitPath(c.path));
                        var l = c.path || [],
                            f = l.length,
                            y = !1,
                            A = -b,
                            u = b,
                            g = -b,
                            q = b,
                            w = c.properties;
                        if (!c._foundBox) {
                            for (; f--;) p(l[f]) && (y ? (A = Math.max(A, l[f]), u = Math.min(u, l[f])) : (g = Math.max(g, l[f]), q = Math.min(q, l[f])), y = !y);
                            c._midX = u + (A - u) * t(c.middleX, w && w["hc-middle-x"], .5);
                            c._midY = q + (g - q) * t(c.middleY, w && w["hc-middle-y"], .5);
                            c._maxX = A;
                            c._minX = u;
                            c._maxY = g;
                            c._minY = q;
                            c.labelrank = t(c.labelrank, (A - u) * (g - q));
                            c._foundBox = !0
                        }
                        h = Math.max(h, c._maxX);
                        d = Math.min(d, c._minX);
                        k = Math.max(k, c._maxY);
                        n = Math.min(n, c._minY);
                        v = Math.min(c._maxX - c._minX, c._maxY - c._minY, v);
                        e = !0
                    }
                });
                e && (this.minY = Math.min(n,
                    t(this.minY, b)), this.maxY = Math.max(k, t(this.maxY, -b)), this.minX = Math.min(d, t(this.minX, b)), this.maxX = Math.max(h, t(this.maxX, -b)), y && void 0 === y.options.minRange && (y.minRange = Math.min(5 * v, (this.maxX - this.minX) / 5, y.minRange || b)), f && void 0 === f.options.minRange && (f.minRange = Math.min(5 * v, (this.maxY - this.minY) / 5, f.minRange || b)))
            },
            getExtremes: function () {
                b.prototype.getExtremes.call(this, this.valueData);
                this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
                this.valueMin = this.dataMin;
                this.valueMax =
                    this.dataMax;
                this.dataMin = this.minY;
                this.dataMax = this.maxY
            },
            translatePath: function (a) {
                var c = !1,
                    b = this.xAxis,
                    f = this.yAxis,
                    k = b.min,
                    n = b.transA,
                    b = b.minPixelPadding,
                    v = f.min,
                    d = f.transA,
                    f = f.minPixelPadding,
                    e, g = [];
                if (a)
                    for (e = a.length; e--;) p(a[e]) ? (g[e] = c ? (a[e] - k) * n + b : (a[e] - v) * d + f, c = !c) : g[e] = a[e];
                return g
            },
            setData: function (c, l, h, f) {
                var k = this.options,
                    n = this.chart.options.chart,
                    v = n && n.map,
                    d = k.mapData,
                    e = k.joinBy,
                    u = null === e,
                    g = k.keys || this.pointArrayMap,
                    w = [],
                    t = {},
                    m = this.chart.mapTransforms;
                !d && v && (d = "string" ===
                    typeof v ? a.maps[v] : v);
                u && (e = "_i");
                e = this.joinBy = q(e);
                e[1] || (e[1] = e[0]);
                c && c.forEach(function (b, n) {
                    var h = 0;
                    if (p(b)) c[n] = {
                        value: b
                    };
                    else if (x(b)) {
                        c[n] = {};
                        !k.keys && b.length > g.length && "string" === typeof b[0] && (c[n]["hc-key"] = b[0], ++h);
                        for (var d = 0; d < g.length; ++d, ++h) g[d] && void 0 !== b[h] && (0 < g[d].indexOf(".") ? a.Point.prototype.setNestedProperty(c[n], b[h], g[d]) : c[n][g[d]] = b[h])
                    }
                    u && (c[n]._i = n)
                });
                this.getBox(c);
                (this.chart.mapTransforms = m = n && n.mapTransforms || d && d["hc-transform"] || m) && a.objectEach(m, function (a) {
                    a.rotation &&
                        (a.cosAngle = Math.cos(a.rotation), a.sinAngle = Math.sin(a.rotation))
                });
                if (d) {
                    "FeatureCollection" === d.type && (this.mapTitle = d.title, d = a.geojson(d, this.type, this));
                    this.mapData = d;
                    this.mapMap = {};
                    for (m = 0; m < d.length; m++) n = d[m], v = n.properties, n._i = m, e[0] && v && v[e[0]] && (n[e[0]] = v[e[0]]), t[n[e[0]]] = n;
                    this.mapMap = t;
                    c && e[1] && c.forEach(function (a) {
                        t[a[e[1]]] && w.push(t[a[e[1]]])
                    });
                    k.allAreas ? (this.getBox(d), c = c || [], e[1] && c.forEach(function (a) {
                            w.push(a[e[1]])
                        }), w = "|" + w.map(function (a) {
                            return a && a[e[0]]
                        }).join("|") +
                        "|", d.forEach(function (a) {
                            e[0] && -1 !== w.indexOf("|" + a[e[0]] + "|") || (c.push(r(a, {
                                value: null
                            })), f = !1)
                        })) : this.getBox(w)
                }
                b.prototype.setData.call(this, c, l, h, f)
            },
            drawGraph: d,
            drawDataLabels: d,
            doFullTranslate: function () {
                return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans
            },
            translate: function () {
                var a = this,
                    b = a.xAxis,
                    h = a.yAxis,
                    d = a.doFullTranslate();
                a.generatePoints();
                a.data.forEach(function (c) {
                    c.plotX = b.toPixels(c._midX, !0);
                    c.plotY = h.toPixels(c._midY, !0);
                    d && (c.shapeType =
                        "path", c.shapeArgs = {
                            d: a.translatePath(c.path)
                        })
                });
                a.translateColors()
            },
            pointAttribs: function (a, b) {
                b = a.series.chart.styledMode ? this.colorAttribs(a) : w.column.prototype.pointAttribs.call(this, a, b);
                b["stroke-width"] = t(a.options[this.pointAttrToOptions && this.pointAttrToOptions["stroke-width"] || "borderWidth"], "inherit");
                return b
            },
            drawPoints: function () {
                var a = this,
                    b = a.xAxis,
                    h = a.yAxis,
                    d = a.group,
                    k = a.chart,
                    n = k.renderer,
                    e, f, g, q, p = this.baseTrans,
                    m, r, t, x, G;
                a.transformGroup || (a.transformGroup = n.g().attr({
                    scaleX: 1,
                    scaleY: 1
                }).add(d), a.transformGroup.survive = !0);
                a.doFullTranslate() ? (k.hasRendered && !k.styledMode && a.points.forEach(function (c) {
                    c.shapeArgs && (c.shapeArgs.fill = a.pointAttribs(c, c.state).fill)
                }), a.group = a.transformGroup, w.column.prototype.drawPoints.apply(a), a.group = d, a.points.forEach(function (c) {
                    c.graphic && (c.name && c.graphic.addClass("highcharts-name-" + c.name.replace(/ /g, "-").toLowerCase()), c.properties && c.properties["hc-key"] && c.graphic.addClass("highcharts-key-" + c.properties["hc-key"].toLowerCase()),
                        k.styledMode && c.graphic.css(a.pointAttribs(c, c.selected && "select")))
                }), this.baseTrans = {
                    originX: b.min - b.minPixelPadding / b.transA,
                    originY: h.min - h.minPixelPadding / h.transA + (h.reversed ? 0 : h.len / h.transA),
                    transAX: b.transA,
                    transAY: h.transA
                }, this.transformGroup.animate({
                    translateX: 0,
                    translateY: 0,
                    scaleX: 1,
                    scaleY: 1
                })) : (e = b.transA / p.transAX, f = h.transA / p.transAY, g = b.toPixels(p.originX, !0), q = h.toPixels(p.originY, !0), .99 < e && 1.01 > e && .99 < f && 1.01 > f && (f = e = 1, g = Math.round(g), q = Math.round(q)), m = this.transformGroup, k.renderer.globalAnimation ?
                    (r = m.attr("translateX"), t = m.attr("translateY"), x = m.attr("scaleX"), G = m.attr("scaleY"), m.attr({
                        animator: 0
                    }).animate({
                        animator: 1
                    }, {
                        step: function (a, c) {
                            m.attr({
                                translateX: r + (g - r) * c.pos,
                                translateY: t + (q - t) * c.pos,
                                scaleX: x + (e - x) * c.pos,
                                scaleY: G + (f - G) * c.pos
                            })
                        }
                    })) : m.attr({
                        translateX: g,
                        translateY: q,
                        scaleX: e,
                        scaleY: f
                    }));
                k.styledMode || d.element.setAttribute("stroke-width", (a.options[a.pointAttrToOptions && a.pointAttrToOptions["stroke-width"] || "borderWidth"] || 1) / (e || 1));
                this.drawMapDataLabels()
            },
            drawMapDataLabels: function () {
                b.prototype.drawDataLabels.call(this);
                this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect)
            },
            render: function () {
                var a = this,
                    d = b.prototype.render;
                a.chart.renderer.isVML && 3E3 < a.data.length ? setTimeout(function () {
                    d.call(a)
                }) : d.call(a)
            },
            animate: function (a) {
                var c = this.options.animation,
                    b = this.group,
                    d = this.xAxis,
                    k = this.yAxis,
                    n = d.pos,
                    e = k.pos;
                this.chart.renderer.isSVG && (!0 === c && (c = {
                    duration: 1E3
                }), a ? b.attr({
                    translateX: n + d.len / 2,
                    translateY: e + k.len / 2,
                    scaleX: .001,
                    scaleY: .001
                }) : (b.animate({
                        translateX: n,
                        translateY: e,
                        scaleX: 1,
                        scaleY: 1
                    },
                    c), this.animate = null))
            },
            animateDrilldown: function (a) {
                var c = this.chart.plotBox,
                    b = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
                    d = b.bBox,
                    k = this.chart.options.drilldown.animation;
                a || (a = Math.min(d.width / c.width, d.height / c.height), b.shapeArgs = {
                    scaleX: a,
                    scaleY: a,
                    translateX: d.x,
                    translateY: d.y
                }, this.points.forEach(function (a) {
                    a.graphic && a.graphic.attr(b.shapeArgs).animate({
                        scaleX: 1,
                        scaleY: 1,
                        translateX: 0,
                        translateY: 0
                    }, k)
                }), this.animate = null)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            animateDrillupFrom: function (a) {
                w.column.prototype.animateDrillupFrom.call(this, a)
            },
            animateDrillupTo: function (a) {
                w.column.prototype.animateDrillupTo.call(this, a)
            }
        }), g({
            applyOptions: function (a, b) {
                a = e.prototype.applyOptions.call(this, a, b);
                b = this.series;
                var c = b.joinBy;
                b.mapData && ((c = void 0 !== a[c[1]] && b.mapMap[a[c[1]]]) ? (b.xyFromShape && (a.x = c._midX, a.y = c._midY), g(a, c)) : a.value = a.value || null);
                return a
            },
            onMouseOver: function (c) {
                a.clearTimeout(this.colorInterval);
                if (null !== this.value || this.series.options.nullInteraction) e.prototype.onMouseOver.call(this,
                    c);
                else this.series.onMouseOut(c)
            },
            zoomTo: function () {
                var a = this.series;
                a.xAxis.setExtremes(this._minX, this._maxX, !1);
                a.yAxis.setExtremes(this._minY, this._maxY, !1);
                a.chart.redraw()
            }
        }, m))
    })(z);
    (function (a) {
        var m = a.seriesType,
            g = a.seriesTypes;
        m("mapline", "map", {
            lineWidth: 1,
            fillColor: "none"
        }, {
            type: "mapline",
            colorProp: "stroke",
            pointAttrToOptions: {
                stroke: "color",
                "stroke-width": "lineWidth"
            },
            pointAttribs: function (a, m) {
                a = g.map.prototype.pointAttribs.call(this, a, m);
                a.fill = this.options.fillColor;
                return a
            },
            drawLegendSymbol: g.line.prototype.drawLegendSymbol
        })
    })(z);
    (function (a) {
        var m = a.merge,
            g = a.Point;
        a = a.seriesType;
        a("mappoint", "scatter", {
            dataLabels: {
                enabled: !0,
                formatter: function () {
                    return this.point.name
                },
                crop: !1,
                defer: !1,
                overflow: !1,
                style: {
                    color: "#000000"
                }
            }
        }, {
            type: "mappoint",
            forceDL: !0
        }, {
            applyOptions: function (a, r) {
                a = void 0 !== a.lat && void 0 !== a.lon ? m(a, this.series.chart.fromLatLonToPoint(a)) : a;
                return g.prototype.applyOptions.call(this, a, r)
            }
        })
    })(z);
    (function (a) {
        var m = a.Series,
            g = a.Legend,
            p = a.Chart,
            r = a.addEvent,
            d = a.wrap,
            t = a.color,
            x = a.isNumber,
            e = a.numberFormat,
            b = a.objectEach,
            f = a.merge,
            w = a.noop,
            q = a.pick,
            c = a.stableSort,
            l = a.setOptions,
            h = a.arrayMin,
            u = a.arrayMax;
        l({
            legend: {
                bubbleLegend: {
                    borderColor: void 0,
                    borderWidth: 2,
                    className: void 0,
                    color: void 0,
                    connectorClassName: void 0,
                    connectorColor: void 0,
                    connectorDistance: 60,
                    connectorWidth: 1,
                    enabled: !1,
                    labels: {
                        className: void 0,
                        allowOverlap: !1,
                        format: "",
                        formatter: void 0,
                        align: "right",
                        style: {
                            fontSize: 10,
                            color: void 0
                        },
                        x: 0,
                        y: 0
                    },
                    maxSize: 60,
                    minSize: 10,
                    legendIndex: 0,
                    ranges: {
                        value: void 0,
                        borderColor: void 0,
                        color: void 0,
                        connectorColor: void 0
                    },
                    sizeBy: "area",
                    sizeByAbsoluteValue: !1,
                    zIndex: 1,
                    zThreshold: 0
                }
            }
        });
        a.BubbleLegend = function (a, c) {
            this.init(a, c)
        };
        a.BubbleLegend.prototype = {
            init: function (a, c) {
                this.options = a;
                this.visible = !0;
                this.chart = c.chart;
                this.legend = c
            },
            setState: w,
            addToLegend: function (a) {
                a.splice(this.options.legendIndex, 0, this)
            },
            drawLegendSymbol: function (a) {
                var b = this.chart,
                    k = this.options,
                    d = q(a.options.itemDistance, 20),
                    e, h = k.ranges;
                e = k.connectorDistance;
                this.fontMetrics = b.renderer.fontMetrics(k.labels.style.fontSize.toString() + "px");
                h && h.length && x(h[0].value) ? (c(h, function (a, c) {
                    return c.value - a.value
                }), this.ranges = h, this.setOptions(), this.render(), b = this.getMaxLabelSize(), h = this.ranges[0].radius, a = 2 * h, e = e - h + b.width, e = 0 < e ? e : 0, this.maxLabel = b, this.movementX = "left" === k.labels.align ? e : 0, this.legendItemWidth = a + e + d, this.legendItemHeight = a + this.fontMetrics.h / 2) : a.options.bubbleLegend.autoRanges = !0
            },
            setOptions: function () {
                var a = this,
                    c = a.ranges,
                    b = a.options,
                    d = a.chart.series[b.seriesIndex],
                    e = a.legend.baseline,
                    h = {
                        "z-index": b.zIndex,
                        "stroke-width": b.borderWidth
                    },
                    l = {
                        "z-index": b.zIndex,
                        "stroke-width": b.connectorWidth
                    },
                    g = a.getLabelStyles(),
                    u = d.options.marker.fillOpacity,
                    w = a.chart.styledMode;
                c.forEach(function (k, n) {
                    w || (h.stroke = q(k.borderColor, b.borderColor, d.color), h.fill = q(k.color, b.color, 1 !== u ? t(d.color).setOpacity(u).get("rgba") : d.color), l.stroke = q(k.connectorColor, b.connectorColor, d.color));
                    c[n].radius = a.getRangeRadius(k.value);
                    c[n] = f(c[n], {
                        center: c[0].radius - c[n].radius + e
                    });
                    w || f(!0, c[n], {
                        bubbleStyle: f(!1, h),
                        connectorStyle: f(!1, l),
                        labelStyle: g
                    })
                })
            },
            getLabelStyles: function () {
                var a =
                    this.options,
                    c = {},
                    d = "left" === a.labels.align,
                    h = this.legend.options.rtl;
                b(a.labels.style, function (a, b) {
                    "color" !== b && "fontSize" !== b && "z-index" !== b && (c[b] = a)
                });
                return f(!1, c, {
                    "font-size": a.labels.style.fontSize,
                    fill: q(a.labels.style.color, "#000000"),
                    "z-index": a.zIndex,
                    align: h || d ? "right" : "left"
                })
            },
            getRangeRadius: function (a) {
                var c = this.options;
                return this.chart.series[this.options.seriesIndex].getRadius.call(this, c.ranges[c.ranges.length - 1].value, c.ranges[0].value, c.minSize, c.maxSize, a)
            },
            render: function () {
                var a =
                    this,
                    c = a.chart.renderer,
                    b = a.options.zThreshold;
                a.symbols || (a.symbols = {
                    connectors: [],
                    bubbleItems: [],
                    labels: []
                });
                a.legendSymbol = c.g("bubble-legend");
                a.legendItem = c.g("bubble-legend-item");
                a.legendSymbol.translateX = 0;
                a.legendSymbol.translateY = 0;
                a.ranges.forEach(function (c) {
                    c.value >= b && a.renderRange(c)
                });
                a.legendSymbol.add(a.legendItem);
                a.legendItem.add(a.legendGroup);
                a.hideOverlappingLabels()
            },
            renderRange: function (a) {
                var c = this.options,
                    b = c.labels,
                    d = this.chart.renderer,
                    k = this.symbols,
                    h = k.labels,
                    e = a.center,
                    f = Math.abs(a.radius),
                    l = c.connectorDistance,
                    g = b.align,
                    u = b.style.fontSize,
                    l = this.legend.options.rtl || "left" === g ? -l : l,
                    b = c.connectorWidth,
                    w = this.ranges[0].radius,
                    q = e - f - c.borderWidth / 2 + b / 2,
                    m, u = u / 2 - (this.fontMetrics.h - u) / 2,
                    p = d.styledMode;
                "center" === g && (l = 0, c.connectorDistance = 0, a.labelStyle.align = "center");
                g = q + c.labels.y;
                m = w + l + c.labels.x;
                k.bubbleItems.push(d.circle(w, e + ((q % 1 ? 1 : .5) - (b % 2 ? 0 : .5)), f).attr(p ? {} : a.bubbleStyle).addClass((p ? "highcharts-color-" + this.options.seriesIndex + " " : "") + "highcharts-bubble-legend-symbol " +
                    (c.className || "")).add(this.legendSymbol));
                k.connectors.push(d.path(d.crispLine(["M", w, q, "L", w + l, q], c.connectorWidth)).attr(p ? {} : a.connectorStyle).addClass((p ? "highcharts-color-" + this.options.seriesIndex + " " : "") + "highcharts-bubble-legend-connectors " + (c.connectorClassName || "")).add(this.legendSymbol));
                a = d.text(this.formatLabel(a), m, g + u).attr(p ? {} : a.labelStyle).addClass("highcharts-bubble-legend-labels " + (c.labels.className || "")).add(this.legendSymbol);
                h.push(a);
                a.placed = !0;
                a.alignAttr = {
                    x: m,
                    y: g + u
                }
            },
            getMaxLabelSize: function () {
                var a, c;
                this.symbols.labels.forEach(function (b) {
                    c = b.getBBox(!0);
                    a = a ? c.width > a.width ? c : a : c
                });
                return a || {}
            },
            formatLabel: function (c) {
                var b = this.options,
                    d = b.labels.formatter;
                return (b = b.labels.format) ? a.format(b, c) : d ? d.call(c) : e(c.value, 1)
            },
            hideOverlappingLabels: function () {
                var a = this.chart,
                    c = this.symbols;
                !this.options.labels.allowOverlap && c && (a.hideOverlappingLabels(c.labels), c.labels.forEach(function (a, b) {
                    a.newOpacity ? a.newOpacity !== a.oldOpacity && c.connectors[b].show() : c.connectors[b].hide()
                }))
            },
            getRanges: function () {
                var a = this.legend.bubbleLegend,
                    c, b = a.options.ranges,
                    d, e = Number.MAX_VALUE,
                    l = -Number.MAX_VALUE;
                a.chart.series.forEach(function (a) {
                    a.isBubble && !a.ignoreSeries && (d = a.zData.filter(x), d.length && (e = q(a.options.zMin, Math.min(e, Math.max(h(d), !1 === a.options.displayNegative ? a.options.zThreshold : -Number.MAX_VALUE))), l = q(a.options.zMax, Math.max(l, u(d)))))
                });
                c = e === l ? [{
                    value: l
                }] : [{
                    value: e
                }, {
                    value: (e + l) / 2
                }, {
                    value: l,
                    autoRanges: !0
                }];
                b.length && b[0].radius && c.reverse();
                c.forEach(function (a, d) {
                    b &&
                        b[d] && (c[d] = f(!1, b[d], a))
                });
                return c
            },
            predictBubbleSizes: function () {
                var a = this.chart,
                    c = this.fontMetrics,
                    b = a.legend.options,
                    d = "horizontal" === b.layout,
                    e = d ? a.legend.lastLineHeight : 0,
                    h = a.plotSizeX,
                    f = a.plotSizeY,
                    l = a.series[this.options.seriesIndex],
                    a = Math.ceil(l.minPxSize),
                    g = Math.ceil(l.maxPxSize),
                    l = l.options.maxSize,
                    u = Math.min(f, h);
                if (b.floating || !/%$/.test(l)) c = g;
                else if (l = parseFloat(l), c = (u + e - c.h / 2) * l / 100 / (l / 100 + 1), d && f - c >= h || !d && h - c >= f) c = g;
                return [a, Math.ceil(c)]
            },
            updateRanges: function (a, c) {
                var b = this.legend.options.bubbleLegend;
                b.minSize = a;
                b.maxSize = c;
                b.ranges = this.getRanges()
            },
            correctSizes: function () {
                var a = this.legend,
                    c = this.chart.series[this.options.seriesIndex];
                1 < Math.abs(Math.ceil(c.maxPxSize) - this.options.maxSize) && (this.updateRanges(this.options.minSize, c.maxPxSize), a.render())
            }
        };
        r(a.Legend, "afterGetAllItems", function (c) {
            var b = this.bubbleLegend,
                d = this.options,
                e = d.bubbleLegend,
                h = this.chart.getVisibleBubbleSeriesIndex();
            b && b.ranges && b.ranges.length && (e.ranges.length && (e.autoRanges = !!e.ranges[0].autoRanges), this.destroyItem(b));
            0 <= h && d.enabled && e.enabled && (e.seriesIndex = h, this.bubbleLegend = new a.BubbleLegend(e, this), this.bubbleLegend.addToLegend(c.allItems))
        });
        p.prototype.getVisibleBubbleSeriesIndex = function () {
            for (var a = this.series, c = 0; c < a.length;) {
                if (a[c] && a[c].isBubble && a[c].visible && a[c].zData.length) return c;
                c++
            }
            return -1
        };
        g.prototype.getLinesHeights = function () {
            var a = this.allItems,
                c = [],
                b, d = a.length,
                e, h = 0;
            for (e = 0; e < d; e++)
                if (a[e].legendItemHeight && (a[e].itemHeight = a[e].legendItemHeight), a[e] === a[d - 1] || a[e + 1] && a[e]._legendItemPos[1] !==
                    a[e + 1]._legendItemPos[1]) {
                    c.push({
                        height: 0
                    });
                    b = c[c.length - 1];
                    for (h; h <= e; h++) a[h].itemHeight > b.height && (b.height = a[h].itemHeight);
                    b.step = e
                } return c
        };
        g.prototype.retranslateItems = function (a) {
            var c, b, d, e = this.options.rtl,
                h = 0;
            this.allItems.forEach(function (f, l) {
                c = f.legendGroup.translateX;
                b = f._legendItemPos[1];
                if ((d = f.movementX) || e && f.ranges) d = e ? c - f.options.maxSize / 2 : c + d, f.legendGroup.attr({
                    translateX: d
                });
                l > a[h].step && h++;
                f.legendGroup.attr({
                    translateY: Math.round(b + a[h].height / 2)
                });
                f._legendItemPos[1] =
                    b + a[h].height / 2
            })
        };
        r(m, "legendItemClick", function () {
            var a = this.chart,
                c = this.visible,
                b = this.chart.legend;
            b && b.bubbleLegend && (this.visible = !c, this.ignoreSeries = c, a = 0 <= a.getVisibleBubbleSeriesIndex(), b.bubbleLegend.visible !== a && (b.update({
                bubbleLegend: {
                    enabled: a
                }
            }), b.bubbleLegend.visible = a), this.visible = c)
        });
        d(p.prototype, "drawChartBox", function (a, c, d) {
            var e = this.legend,
                h = 0 <= this.getVisibleBubbleSeriesIndex(),
                f;
            e && e.options.enabled && e.bubbleLegend && e.options.bubbleLegend.autoRanges && h ? (f = e.bubbleLegend.options,
                h = e.bubbleLegend.predictBubbleSizes(), e.bubbleLegend.updateRanges(h[0], h[1]), f.placed || (e.group.placed = !1, e.allItems.forEach(function (a) {
                    a.legendGroup.translateY = null
                })), e.render(), this.getMargins(), this.axes.forEach(function (a) {
                    a.render();
                    f.placed || (a.setScale(), a.updateNames(), b(a.ticks, function (a) {
                        a.isNew = !0;
                        a.isNewLabel = !0
                    }))
                }), f.placed = !0, this.getMargins(), a.call(this, c, d), e.bubbleLegend.correctSizes(), e.retranslateItems(e.getLinesHeights())) : (a.call(this, c, d), e && e.options.enabled && e.bubbleLegend &&
                (e.render(), e.retranslateItems(e.getLinesHeights())))
        })
    })(z);
    (function (a) {
        var m = a.arrayMax,
            g = a.arrayMin,
            p = a.Axis,
            r = a.color,
            d = a.isNumber,
            t = a.noop,
            x = a.pick,
            e = a.pInt,
            b = a.Point,
            f = a.Series,
            w = a.seriesType,
            q = a.seriesTypes;
        w("bubble", "scatter", {
            dataLabels: {
                formatter: function () {
                    return this.point.z
                },
                inside: !0,
                verticalAlign: "middle"
            },
            animationLimit: 250,
            marker: {
                lineColor: null,
                lineWidth: 1,
                fillOpacity: .5,
                radius: null,
                states: {
                    hover: {
                        radiusPlus: 0
                    }
                },
                symbol: "circle"
            },
            minSize: 8,
            maxSize: "20%",
            softThreshold: !1,
            states: {
                hover: {
                    halo: {
                        size: 5
                    }
                }
            },
            tooltip: {
                pointFormat: "({point.x}, {point.y}), Size: {point.z}"
            },
            turboThreshold: 0,
            zThreshold: 0,
            zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"],
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["group", "dataLabelsGroup"],
            specialGroup: "group",
            bubblePadding: !0,
            zoneAxis: "z",
            directTouch: !0,
            isBubble: !0,
            pointAttribs: function (a, b) {
                var c = this.options.marker.fillOpacity;
                a = f.prototype.pointAttribs.call(this, a, b);
                1 !== c && (a.fill = r(a.fill).setOpacity(c).get("rgba"));
                return a
            },
            getRadii: function (a, b, e) {
                var c, d = this.zData,
                    h = e.minPxSize,
                    f = e.maxPxSize,
                    l = [],
                    g;
                c = 0;
                for (e = d.length; c < e; c++) g = d[c], l.push(this.getRadius(a, b, h, f, g));
                this.radii = l
            },
            getRadius: function (a, b, e, f, k) {
                var c = this.options,
                    h = "width" !== c.sizeBy,
                    l = c.zThreshold,
                    g = b - a;
                c.sizeByAbsoluteValue && null !== k && (k = Math.abs(k - l), g = Math.max(b - l, Math.abs(a - l)), a = 0);
                d(k) ? k < a ? e = e / 2 - 1 : (a = 0 < g ? (k - a) / g : .5, h && 0 <= a && (a = Math.sqrt(a)), e = Math.ceil(e + a * (f - e)) / 2) : e = null;
                return e
            },
            animate: function (a) {
                !a && this.points.length < this.options.animationLimit && (this.points.forEach(function (a) {
                    var c = a.graphic,
                        b;
                    c && c.width && (b = {
                        x: c.x,
                        y: c.y,
                        width: c.width,
                        height: c.height
                    }, c.attr({
                        x: a.plotX,
                        y: a.plotY,
                        width: 1,
                        height: 1
                    }), c.animate(b, this.options.animation))
                }, this), this.animate = null)
            },
            translate: function () {
                var c, b = this.data,
                    e, f, k = this.radii;
                q.scatter.prototype.translate.call(this);
                for (c = b.length; c--;) e = b[c], f = k ? k[c] : 0, d(f) && f >= this.minPxSize / 2 ? (e.marker = a.extend(e.marker, {
                    radius: f,
                    width: 2 * f,
                    height: 2 * f
                }), e.dlBox = {
                    x: e.plotX - f,
                    y: e.plotY - f,
                    width: 2 * f,
                    height: 2 * f
                }) : e.shapeArgs = e.plotY = e.dlBox = void 0
            },
            alignDataLabel: q.column.prototype.alignDataLabel,
            buildKDTree: t,
            applyZones: t
        }, {
            haloPath: function (a) {
                return b.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a)
            },
            ttBelow: !1
        });
        p.prototype.beforePadding = function () {
            var c = this,
                b = this.len,
                f = this.chart,
                w = 0,
                k = b,
                q = this.isXAxis,
                p = q ? "xData" : "yData",
                r = this.min,
                t = {},
                z = Math.min(f.plotWidth, f.plotHeight),
                C = Number.MAX_VALUE,
                D = -Number.MAX_VALUE,
                E = this.max - r,
                B = b / E,
                F = [];
            this.series.forEach(function (b) {
                var d = b.options;
                !b.bubblePadding || !b.visible && f.options.chart.ignoreHiddenSeries || (c.allowZoomOutside = !0, F.push(b), q && (["minSize", "maxSize"].forEach(function (a) {
                    var c = d[a],
                        b = /%$/.test(c),
                        c = e(c);
                    t[a] = b ? z * c / 100 : c
                }), b.minPxSize = t.minSize, b.maxPxSize = Math.max(t.maxSize, t.minSize), b = b.zData.filter(a.isNumber), b.length && (C = x(d.zMin, Math.min(C, Math.max(g(b), !1 === d.displayNegative ? d.zThreshold : -Number.MAX_VALUE))), D = x(d.zMax, Math.max(D, m(b))))))
            });
            F.forEach(function (a) {
                var b = a[p],
                    e = b.length,
                    f;
                q && a.getRadii(C, D, a);
                if (0 < E)
                    for (; e--;) d(b[e]) && c.dataMin <= b[e] && b[e] <= c.dataMax && (f = a.radii[e], w = Math.min((b[e] - r) *
                        B - f, w), k = Math.max((b[e] - r) * B + f, k))
            });
            F.length && 0 < E && !this.isLog && (k -= b, B *= (b + Math.max(0, w) - Math.min(k, b)) / b, [
                ["min", "userMin", w],
                ["max", "userMax", k]
            ].forEach(function (a) {
                void 0 === x(c.options[a[0]], c[a[1]]) && (c[a[0]] += a[2] / B)
            }))
        }
    })(z);
    (function (a) {
        var m = a.merge,
            g = a.Point,
            p = a.seriesType,
            r = a.seriesTypes;
        r.bubble && p("mapbubble", "bubble", {
            animationLimit: 500,
            tooltip: {
                pointFormat: "{point.name}: {point.z}"
            }
        }, {
            xyFromShape: !0,
            type: "mapbubble",
            pointArrayMap: ["z"],
            getMapData: r.map.prototype.getMapData,
            getBox: r.map.prototype.getBox,
            setData: r.map.prototype.setData
        }, {
            applyOptions: function (a, p) {
                return a && void 0 !== a.lat && void 0 !== a.lon ? g.prototype.applyOptions.call(this, m(a, this.series.chart.fromLatLonToPoint(a)), p) : r.map.prototype.pointClass.prototype.applyOptions.call(this, a, p)
            },
            isValid: function () {
                return "number" === typeof this.z
            },
            ttBelow: !1
        })
    })(z);
    (function (a) {
        var m = a.colorPointMixin,
            g = a.merge,
            p = a.noop,
            r = a.pick,
            d = a.Series,
            t = a.seriesType,
            x = a.seriesTypes;
        t("heatmap", "scatter", {
            animation: !1,
            borderWidth: 0,
            nullColor: "#f7f7f7",
            dataLabels: {
                formatter: function () {
                    return this.point.value
                },
                inside: !0,
                verticalAlign: "middle",
                crop: !1,
                overflow: !1,
                padding: 0
            },
            marker: null,
            pointRange: null,
            tooltip: {
                pointFormat: "{point.x}, {point.y}: {point.value}\x3cbr/\x3e"
            },
            states: {
                hover: {
                    halo: !1,
                    brightness: .2
                }
            }
        }, g(a.colorSeriesMixin, {
            pointArrayMap: ["y", "value"],
            hasPointSpecificOptions: !0,
            getExtremesFromAll: !0,
            directTouch: !0,
            init: function () {
                var a;
                x.scatter.prototype.init.apply(this, arguments);
                a = this.options;
                a.pointRange = r(a.pointRange, a.colsize || 1);
                this.yAxis.axisPointRange = a.rowsize || 1
            },
            translate: function () {
                var a =
                    this.options,
                    b = this.xAxis,
                    d = this.yAxis,
                    g = a.pointPadding || 0,
                    q = function (a, c, b) {
                        return Math.min(Math.max(c, a), b)
                    },
                    c = this.pointPlacementToXValue();
                this.generatePoints();
                this.points.forEach(function (e) {
                    var f = (a.colsize || 1) / 2,
                        l = (a.rowsize || 1) / 2,
                        k = q(Math.round(b.len - b.translate(e.x - f, 0, 1, 0, 1, -c)), -b.len, 2 * b.len),
                        f = q(Math.round(b.len - b.translate(e.x + f, 0, 1, 0, 1, -c)), -b.len, 2 * b.len),
                        w = q(Math.round(d.translate(e.y - l, 0, 1, 0, 1)), -d.len, 2 * d.len),
                        l = q(Math.round(d.translate(e.y + l, 0, 1, 0, 1)), -d.len, 2 * d.len),
                        m = r(e.pointPadding,
                            g);
                    e.plotX = e.clientX = (k + f) / 2;
                    e.plotY = (w + l) / 2;
                    e.shapeType = "rect";
                    e.shapeArgs = {
                        x: Math.min(k, f) + m,
                        y: Math.min(w, l) + m,
                        width: Math.abs(f - k) - 2 * m,
                        height: Math.abs(l - w) - 2 * m
                    }
                });
                this.translateColors()
            },
            drawPoints: function () {
                var a = this.chart.styledMode ? "css" : "attr";
                x.column.prototype.drawPoints.call(this);
                this.points.forEach(function (b) {
                    b.graphic[a](this.colorAttribs(b))
                }, this)
            },
            animate: p,
            getBox: p,
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            alignDataLabel: x.column.prototype.alignDataLabel,
            getExtremes: function () {
                d.prototype.getExtremes.call(this,
                    this.valueData);
                this.valueMin = this.dataMin;
                this.valueMax = this.dataMax;
                d.prototype.getExtremes.call(this)
            }
        }), a.extend({
            haloPath: function (a) {
                if (!a) return [];
                var b = this.shapeArgs;
                return ["M", b.x - a, b.y - a, "L", b.x - a, b.y + b.height + a, b.x + b.width + a, b.y + b.height + a, b.x + b.width + a, b.y - a, "Z"]
            }
        }, m))
    })(z);
    (function (a) {
        function m(a, b) {
            var e, d, g, c = !1,
                l = a.x,
                h = a.y;
            a = 0;
            for (e = b.length - 1; a < b.length; e = a++) d = b[a][1] > h, g = b[e][1] > h, d !== g && l < (b[e][0] - b[a][0]) * (h - b[a][1]) / (b[e][1] - b[a][1]) + b[a][0] && (c = !c);
            return c
        }
        var g = a.Chart,
            p = a.extend,
            r = a.format,
            d = a.merge,
            t = a.win,
            x = a.wrap;
        g.prototype.transformFromLatLon = function (e, b) {
            if (void 0 === t.proj4) return a.error(21, !1, this), {
                x: 0,
                y: null
            };
            e = t.proj4(b.crs, [e.lon, e.lat]);
            var d = b.cosAngle || b.rotation && Math.cos(b.rotation),
                g = b.sinAngle || b.rotation && Math.sin(b.rotation);
            e = b.rotation ? [e[0] * d + e[1] * g, -e[0] * g + e[1] * d] : e;
            return {
                x: ((e[0] - (b.xoffset || 0)) * (b.scale || 1) + (b.xpan || 0)) * (b.jsonres || 1) + (b.jsonmarginX || 0),
                y: (((b.yoffset || 0) - e[1]) * (b.scale || 1) + (b.ypan || 0)) * (b.jsonres || 1) - (b.jsonmarginY ||
                    0)
            }
        };
        g.prototype.transformToLatLon = function (e, b) {
            if (void 0 === t.proj4) a.error(21, !1, this);
            else {
                e = {
                    x: ((e.x - (b.jsonmarginX || 0)) / (b.jsonres || 1) - (b.xpan || 0)) / (b.scale || 1) + (b.xoffset || 0),
                    y: ((-e.y - (b.jsonmarginY || 0)) / (b.jsonres || 1) + (b.ypan || 0)) / (b.scale || 1) + (b.yoffset || 0)
                };
                var d = b.cosAngle || b.rotation && Math.cos(b.rotation),
                    g = b.sinAngle || b.rotation && Math.sin(b.rotation);
                b = t.proj4(b.crs, "WGS84", b.rotation ? {
                    x: e.x * d + e.y * -g,
                    y: e.x * g + e.y * d
                } : e);
                return {
                    lat: b.y,
                    lon: b.x
                }
            }
        };
        g.prototype.fromPointToLatLon = function (e) {
            var b =
                this.mapTransforms,
                d;
            if (b) {
                for (d in b)
                    if (b.hasOwnProperty(d) && b[d].hitZone && m({
                            x: e.x,
                            y: -e.y
                        }, b[d].hitZone.coordinates[0])) return this.transformToLatLon(e, b[d]);
                return this.transformToLatLon(e, b["default"])
            }
            a.error(22, !1, this)
        };
        g.prototype.fromLatLonToPoint = function (d) {
            var b = this.mapTransforms,
                e, g;
            if (!b) return a.error(22, !1, this), {
                x: 0,
                y: null
            };
            for (e in b)
                if (b.hasOwnProperty(e) && b[e].hitZone && (g = this.transformFromLatLon(d, b[e]), m({
                        x: g.x,
                        y: -g.y
                    }, b[e].hitZone.coordinates[0]))) return g;
            return this.transformFromLatLon(d,
                b["default"])
        };
        a.geojson = function (a, b, d) {
            var e = [],
                f = [],
                c = function (a) {
                    var c, b = a.length;
                    f.push("M");
                    for (c = 0; c < b; c++) 1 === c && f.push("L"), f.push(a[c][0], -a[c][1])
                };
            b = b || "map";
            a.features.forEach(function (a) {
                var d = a.geometry,
                    g = d.type,
                    d = d.coordinates;
                a = a.properties;
                var k;
                f = [];
                "map" === b || "mapbubble" === b ? ("Polygon" === g ? (d.forEach(c), f.push("Z")) : "MultiPolygon" === g && (d.forEach(function (a) {
                    a.forEach(c)
                }), f.push("Z")), f.length && (k = {
                    path: f
                })) : "mapline" === b ? ("LineString" === g ? c(d) : "MultiLineString" === g && d.forEach(c),
                    f.length && (k = {
                        path: f
                    })) : "mappoint" === b && "Point" === g && (k = {
                    x: d[0],
                    y: -d[1]
                });
                k && e.push(p(k, {
                    name: a.name || a.NAME,
                    properties: a
                }))
            });
            d && a.copyrightShort && (d.chart.mapCredits = r(d.chart.options.credits.mapText, {
                geojson: a
            }), d.chart.mapCreditsFull = r(d.chart.options.credits.mapTextFull, {
                geojson: a
            }));
            return e
        };
        x(g.prototype, "addCredits", function (a, b) {
            b = d(!0, this.options.credits, b);
            this.mapCredits && (b.href = null);
            a.call(this, b);
            this.credits && this.mapCreditsFull && this.credits.attr({
                title: this.mapCreditsFull
            })
        })
    })(z);
    (function (a) {
        function m(a, b, d, c, e, h, g, k) {
            return ["M", a + e, b, "L", a + d - h, b, "C", a + d - h / 2, b, a + d, b + h / 2, a + d, b + h, "L", a + d, b + c - g, "C", a + d, b + c - g / 2, a + d - g / 2, b + c, a + d - g, b + c, "L", a + k, b + c, "C", a + k / 2, b + c, a, b + c - k / 2, a, b + c - k, "L", a, b + e, "C", a, b + e / 2, a + e / 2, b, a + e, b, "Z"]
        }
        var g = a.Chart,
            p = a.defaultOptions,
            r = a.extend,
            d = a.merge,
            t = a.pick,
            x = a.Renderer,
            e = a.SVGRenderer,
            b = a.VMLRenderer;
        r(p.lang, {
            zoomIn: "Zoom in",
            zoomOut: "Zoom out"
        });
        p.mapNavigation = {
            buttonOptions: {
                alignTo: "plotBox",
                align: "left",
                verticalAlign: "top",
                x: 0,
                width: 18,
                height: 18,
                padding: 5,
                style: {
                    fontSize: "15px",
                    fontWeight: "bold"
                },
                theme: {
                    "stroke-width": 1,
                    "text-align": "center"
                }
            },
            buttons: {
                zoomIn: {
                    onclick: function () {
                        this.mapZoom(.5)
                    },
                    text: "+",
                    y: 0
                },
                zoomOut: {
                    onclick: function () {
                        this.mapZoom(2)
                    },
                    text: "-",
                    y: 28
                }
            },
            mouseWheelSensitivity: 1.1
        };
        a.splitPath = function (a) {
            var b;
            a = a.replace(/([A-Za-z])/g, " $1 ");
            a = a.replace(/^\s*/, "").replace(/\s*$/, "");
            a = a.split(/[ ,]+/);
            for (b = 0; b < a.length; b++) /[a-zA-Z]/.test(a[b]) || (a[b] = parseFloat(a[b]));
            return a
        };
        a.maps = {};
        e.prototype.symbols.topbutton =
            function (a, b, d, c, e) {
                return m(a - 1, b - 1, d, c, e.r, e.r, 0, 0)
            };
        e.prototype.symbols.bottombutton = function (a, b, d, c, e) {
            return m(a - 1, b - 1, d, c, 0, 0, e.r, e.r)
        };
        x === b && ["topbutton", "bottombutton"].forEach(function (a) {
            b.prototype.symbols[a] = e.prototype.symbols[a]
        });
        a.Map = a.mapChart = function (b, e, m) {
            var c = "string" === typeof b || b.nodeName,
                f = arguments[c ? 1 : 0],
                h = f,
                p = {
                    endOnTick: !1,
                    visible: !1,
                    minPadding: 0,
                    maxPadding: 0,
                    startOnTick: !1
                },
                k, n = a.getOptions().credits;
            k = f.series;
            f.series = null;
            f = d({
                chart: {
                    panning: "xy",
                    type: "map"
                },
                credits: {
                    mapText: t(n.mapText,
                        ' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'),
                    mapTextFull: t(n.mapTextFull, "{geojson.copyright}")
                },
                tooltip: {
                    followTouchMove: !1
                },
                xAxis: p,
                yAxis: d(p, {
                    reversed: !0
                })
            }, f, {
                chart: {
                    inverted: !1,
                    alignTicks: !1
                }
            });
            f.series = h.series = k;
            return c ? new g(b, f, m) : new g(f, e)
        }
    })(z)
});
//# sourceMappingURL=map.js.map