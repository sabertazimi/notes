---
sidebar_position: 21
tags: [AI, Language, Python, Plot]
---

# Plot

```bash
pip3 install matplotlib
pip3 install ggplot
```

```python
import matplotlib.pyplot as plt

fig = plt.figure()
ax = plt.subplot2grid((1, 1), (0, 0))

ax.fill_between(x, y, y[0], where=(y > y[0]), facecolor='g', alpha=0.5)

ax.grid(True)
ax.xaxis.label.set_color('c')
ax.yaxis.label.set_color('r')
ax.set_yticks([0,25,50,75])
ax.xaxis.get_ticklabels()

ax.spines['left'].set_color('c')
ax.spines['right'].set_visible(False)
ax.spines['top'].set_visible(False)
ax.spines['left'].set_linewidth(5)
ax.tick_params(axis='x', colors='#f06215')
ax.axhline(20, color='k', linewidth=5)

ax.text(x, y, 'text')
ax.annotate(
  'Bad News!',
  xytext=(0.8, 0.9),
  textcoords='axes fraction',
  arrowprops = dict(facecolor='grey', color='grey')
)

plt.plot(x, y, label='label', color='red', linewidth=5)
plt.bar(x, y, label='label', color='#111')
plt.scatter(x, y, label='label', marker='*', size=100)
plt.stackplot(x, y1, y2, ..., yn, colors=[])
plt.pie(slices, labels=[], colors=[], startangle=90, explode=(), autopct='%1.1f%%')
plt.hist(data, bins=10, histtype='bar', rwidth=0.8)

plt.xlabel('xlabel')
plt.ylabel('ylabel')
plt.title('title')
plt.legend()
plt.subplots_adjust()
plt.show()
```

## Types

- `bar` plot.
- `line` plot.
- `scatter` plot.
- `pie` plot.
- `stack` plot.
- `histogram` plot.
- `interval` plot.
- `box` plot.
- `KDE` plot.
- `candlestick_ohlc` plot.

## Style

```python
from matplotlib import style
print(plt.style.available)
print(plt.__file__)
style.use('ggplot')
style.use('fivethirtyeight')
plt.style.use('mystylesheet.mplrc')
```

## Axis Tick

```python
ax3.xaxis.set_major_formatter(mDates.DateFormatter('%Y-%m-%d'))
ax3.xaxis.set_major_locator(mTicker.MaxNLocator(10))
ax1.yaxis.set_major_locator(mTicker.MaxNLocator(nbins=5, prune='lower'))

for label in ax3.xaxis.get_ticklabels():
    label.set_rotation(45)

plt.setp(ax1.get_xticklabels(), visible=False)
plt.setp(ax2.get_xticklabels(), visible=False)
```

## Legend

Up middle legend:

```python
ax.legend()
leg = ax.legend(loc=9, ncol=2,prop={'size':11})
leg.get_frame().set_alpha(0.4)
```

## Subplot

Tall and width for grid template:

```python
fig = plt.figure()
ax1 = fig.add_subplot(221)
ax2 = fig.add_subplot(222)
ax3 = fig.add_subplot(212)

ax1 = plt.subplot2grid((6,1), (0,0), rowspan=1, colspan=1)
ax2 = plt.subplot2grid((6,1), (1,0), rowspan=4, colspan=1)
ax3 = plt.subplot2grid((6,1), (5,0), rowspan=1, colspan=1)
```

Double y-axis:

```python
ax2v = ax2.twinx()
```

## 3D

```python
from mpl_toolkits.mplot3d import axes3d
import matplotlib.pyplot as plt
from matplotlib import style

style.use('ggplot')

fig = plt.figure()
ax1 = fig.add_subplot(111, projection='3d')

x = [1,2,3,4,5,6,7,8,9,10]
y = [5,6,7,8,2,5,6,3,7,2]
z = [1,2,6,3,2,7,3,3,7,2]

x2 = [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10]
y2 = [-5,-6,-7,-8,-2,-5,-6,-3,-7,-2]
z2 = [1,2,6,3,2,7,3,3,7,2]

ax1.scatter(x, y, z, c='g', marker='o')
ax1.scatter(x2, y2, z2, c ='r', marker='o')

ax1.set_xlabel('x axis')
ax1.set_ylabel('y axis')
ax1.set_zlabel('z axis')

plt.show()
```

```python
from mpl_toolkits.mplot3d import axes3d
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import style
style.use('ggplot')

fig = plt.figure()
ax1 = fig.add_subplot(111, projection='3d')

x3 = [1,2,3,4,5,6,7,8,9,10]
y3 = [5,6,7,8,2,5,6,3,7,2]
z3 = np.zeros(10)

dx = np.ones(10)
dy = np.ones(10)
dz = [1,2,3,4,5,6,7,8,9,10]

ax1.bar3d(x3, y3, z3, dx, dy, dz)

ax1.set_xlabel('x axis')
ax1.set_ylabel('y axis')
ax1.set_zlabel('z axis')

plt.show()
```

## Figures

[Matplotlib for Papers](https://github.com/jbmouret/matplotlib_for_papers):

```python
import matplotlib.pyplot as plt
import matplotlib

def latexify(fig_width=None, fig_height=None, columns=1):
    '''Set up matplotlib RC params for LaTeX plotting.
    Call this before plotting a figure.

    Parameters
    ----------
    fig_width : float, optional, inches
    fig_height : float,  optional, inches
    columns : {1, 2}
    '''

    # code adapted from http://www.scipy.org/Cookbook/Matplotlib/LaTeX_Examples

    # Width and max height in inches for IEEE journals taken from
    # computer.org/cms/Computer.org/Journal%20templates/transactions_art_guide.pdf

    assert(columns in [1,2])

    if fig_width is None:
        fig_width = 3.39 if columns==1 else 6.9 # width in inches

    if fig_height is None:
        golden_mean = (sqrt(5)-1.0)/2.0    # Aesthetic ratio
        fig_height = fig_width*golden_mean # height in inches

    MAX_HEIGHT_INCHES = 8.0
    if fig_height > MAX_HEIGHT_INCHES:
        print("WARNING: fig_height too large:" + str(fig_height) +
              "so will reduce to" + str(MAX_HEIGHT_INCHES) + "inches.")
        fig_height = MAX_HEIGHT_INCHES

    params = {'backend': 'ps',
              'text.latex.preamble': ['\usepackage{gensymb}'],
              'axes.labelsize': 8, # fontsize for x and y labels (was 10)
              'axes.titlesize': 8,
              'text.fontsize': 8, # was 10
              'legend.fontsize': 8, # was 10
              'xtick.labelsize': 8,
              'ytick.labelsize': 8,
              'text.usetex': True,
              'figure.figsize': [fig_width,fig_height],
              'font.family': 'serif'
    }

    matplotlib.rcParams.update(params)

def format_axes(ax):

    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)

    for spine in ['left', 'bottom']:
        ax.spines[spine].set_color(SPINE_COLOR)
        ax.spines[spine].set_linewidth(0.5)

    ax.xaxis.set_ticks_position('bottom')
    ax.yaxis.set_ticks_position('left')

    for axis in [ax.xaxis, ax.yaxis]:
        axis.set_tick_params(direction='out', color=SPINE_COLOR)

    return ax

latexify()
ax.set_xlabel("X label")
ax.set_ylabel("Y label")
ax.set_title("Title")
plt.tight_layout()
format_axes(ax)
plt.savefig("figure.pdf")
```

```python
import numpy as np
import matplotlib as mpl
mpl.use('pdf')
import matplotlib.pyplot as plt

plt.rc('font', family='serif', serif='Times')
plt.rc('text', usetex=True)
plt.rc('xtick', labelsize=8)
plt.rc('ytick', labelsize=8)
plt.rc('axes', labelsize=8)

# width as measured in ink scape
width = 3.487
height = width / 1.618

fig, ax = plt.subplots()
fig.subplots_adjust(left=.15, bottom=.16, right=.99, top=.97)

x = np.arange(0.0, 3*np.pi , 0.1)
plt.plot(x, np.sin(x))

ax.set_ylabel('Some Metric (in unit)')
ax.set_xlabel('Something (in unit)')
ax.set_xlim(0, 3*np.pi)

fig.set_size_inches(width, height)
fig.savefig('plot.pdf')
```
