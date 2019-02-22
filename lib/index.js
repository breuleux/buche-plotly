
var Plotly = require('../plotly/plotly-1.42.5.min');
var debounce = require('debounce');


class PlotlyElement extends BucheElement {
    setup(config, children) {
        this.nodes = {};
        this.innerHTML = "&lt;PlotlyElement&gt; waiting for configuration.";
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.width = config.width || "800px";
        this.style.height = config.height || "500px";
        this.style.border = "1px solid black";
    }

    command_configure(path, cmd, options) {
        options.layout = options.layout || {};
        options.layout.datarevision = 0;
        this.options = options;
        this.innerHTML = "";
        this._container = document.createElement('div');
        this._container.style = "width: 100%; height: 100%";
        this._appendChild(this._container);
        options.container = this._container;

        var plots = options.plots || {}
        var traces = [];
        for (var name in plots) {
            var plot = plots[name];
            if (!plot.name) {
                plot.name = name;
            }
            traces.push(plot);
        }
        options.traces = traces;
        this.refresh();
    }

    fill(plot, src) {
        if (plot.constructor === Object) {
            if (plot.field) {
                if (src === null) {
                    return [];
                }
                else {
                    return src.transposed[plot.field];
                }
            }
            var p = {};
            for (var key in plot) {
                p[key] = this.fill(plot[key], src);
            }
            return p;
        }
        else {
            return plot;
        }
    }

    refreshPlot(plot) {
        var src = plot.dataSource;
        if (!src) {
            return plot;
        }
        else if (typeof(src) === 'string') {
            this.bucheDispatcher().doc.getChannel(src).then(ch => {
                plot.dataSource = ch;
                ch.on_row(debounce(_ => this.refresh(), 100));
            });
            return this.fill(plot, null);
        }
        else {
            return this.fill(plot, src);
        }
    }

    refresh() {
        var options = this.options;
        var traces = options.traces.map(plot => this.refreshPlot(plot));
        options.layout.datarevision++;
        Plotly.react(
            options.container,
            traces,
            options.layout
        );
    }
}


function bucheInstall() {
    customElements.define('plotly-element', PlotlyElement);
}


module.exports = {
    'bucheInstall': bucheInstall,
}
