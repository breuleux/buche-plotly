
# buche-plotly

Buche plugin for the [plotly](https://plot.ly/javascript/) plotting library.

Provides the `plotly-element` component.


## Use

First you must output the following `buche` command:

```json
{"command":"plugin","name":"plotly"}
```

Buche will prompt you to install the plugin if it is not available, although you can install it manually with `buche --install plotly`.


## `<plotly-element>` component

The component is instantiated in HTML as follows:

```html
<plotly-element>
    <script type="buche/configure">
    {
        "layout": {"showlegend": true},
        "plots": {
            "plot1": {
                "x": [1, 2, 3, 4],
                "y": [1, 4, 9, 16]
            },
            "plot2": {
                "dataSource": "/some-data",
                "x": {"field": "distance"},
                "y": {"field": "size"}
            }
        }
    }
    </script>
</plotly-element>`
```


### `configure` command

If this is more convenient to you, you can leave out the configuration in `<plotly-element>`, and use a separate command to configure it. For example (using node.js):

```javascript
function buche(cfg) {
    console.log(JSON.stringify(cfg));
}

buche({
    parent: "/",
    tag: 'plotly-element',
    attributes: {
        address: 'plot',
    }
})

buche({
    parent: "/plot",
    command: "configure",
    plots: {...}
})
```

The `<plotly-element>` must have an `address` attribute in order for this to work, and the command must be directed to that address (see `parent` above).


### Live updates

New points can be added incrementally by linking a plot to a `<buche-data>` element, and then adding new rows to that element. For this you need to create a `<buche-data address="some-address">`, then use `some-address` as the `dataSource` for a plot, and specify which fields to use for `x` and `y`.

See `examples/plot.py` for an example, or the raw JSON in `examples/plot.jsonl`.
