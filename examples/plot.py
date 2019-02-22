#!/usr/bin/env buche --inspect python

import json, os, sys, math

def buche(**cfg):
    print(json.dumps(cfg))

here = os.path.dirname(os.path.realpath(__file__))
expr = sys.argv[1] if len(sys.argv) >= 2 else 'math.sin(x)'

# Import the plugin
buche(command='plugin', name='plotly')

# * Create a <buche-data> to accumulate data (invisible element)
# * Create a <buche-table> to display the data (optional)
# * Create a <plotly-element>
# * Put all that in tabs
# Small note: the field order in the table is determined by the field
# order when setting points, but until Python 3.7 dicts are not ordered,
# which is why the table might show the y column left of the x column.
buche(
    parent='/',
    content="""
    <buche-data address="data"></buche-data>
    <buche-tabs>
        <tab-entry label="Table">
            <buche-table data-source="/data"></buche-table>
        </tab-entry>
        <tab-entry label="Plot" active>
            <plotly-element address="plot"></plotly-element>
        </tab-entry>
    </buche-tabs>
    """
)

# Configure the plot to use the data from buche-data
buche(
    parent='/plot',
    command='configure',
    plots={
        expr:{
            'dataSource': '/data',
            'x': {'field': 'x'},
            'y': {'field': 'y'},
        }
    },
    layout={
        'showlegend': True
    }
)

# Print out 1000 points, which will show up in both the table and the plot
for i in range(1000):
    x = i / 100.0
    y = x * x
    buche(
        parent='/data',
        command='data',
        data={
            'x': x,
            'y': eval(expr)
        }
    )
