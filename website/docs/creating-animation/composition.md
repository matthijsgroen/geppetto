---
sidebar_position: 5
---

# Composition screen

The composition screen is where you wire up all the moving parts of your image.

It has the same tree structure on the side as the layers. You can move the
layers and folders here to change the stacking order of the layers.

## Moving layers

By default, a layer is positioned with its center to the center of the image. So
if you create all the layer surfaces in the layer screen you will notice that
they are stacked on eachother at the center.

When you select a layer from the tree on the left, you can move the layer around
by holdin Shift while dragging. (This also works for folders).

For precision movement, use the pane in the bottom left, which should have the
title of the layer as name. There you can manipulate the X and Y by entering new
coordinates, or using the up/down arrows.

## Adding mutations

In the "Composition" pane on the left, you can reorder layers, place them in
folders and add mutations:

- `⚪️ +` Add Mutation to selected layer or folder
- `📁 +` Add folder
- `🗑` Delete the selected mutation or an _empty_ folder. You can only delete
  layers from the Layers screen (on purpose).
- `⬆` Move layer/folder up
- `⬇` Move layer/folder down

Each mutation type has a different effect on the surface(s) they are applied to.
When you add a mutation you will see a colored dot added to the center of an
image. This dot is the 'origin' of the effect. (For instance the point of
rotation). You can move the origin by using Shift while dragging with the
mutation selected, or by adjusting the origin manually in the bottom left panel.

### 🟢 Translation mutation

The green circle means translation. With the translation mutator, you can move
the layer or folder. If you enable the radius option, only the points within the
radius around the origin are moved.

### 🔴 Rotation mutation

The red circle means rotation. You can use this to rotate a layer or folder
around its origin (The red dot).

### 🟣 Stretch mutation

The purple circle means stretch. You can stretch all points of a layer or folder
using the origin as center of the stretch. 1 is the default size, 0.5 is half
(scale down) 2 is double the size (scale up). You can use negative values to
mirror surfaces.

### ⚪️ Opacity mutation

The white circle means opacity. You can change the opacity of an entire layer or
folder. The origin is changeable, but it will not affect the result.

### 🟠 Deformation mutation

The orange circle means deformation. It is like translation with radius, only
its effect will linear decline from the origin towards the radius.

### ⬜ Lightness mutation

The white square means lightness. It can be used to make colors darker.

### 🟧 Colorize mutation

The orange square is to set the color as base color for 'Saturation' effects.

### 🟩 Saturation mutation

The green square is to desaturate the colors. Normally colors would go to grayscale if the saturation is decreased, but here you can move the color towards the color set with the Colorize mutation.

## Adding Controls

Controls allow your image to be controlled from the outside, or by an animation.
A control has 'steps', each step is a set of values for mutations. By using
controls, Geppetto will transition these mutations when the controls are
changed.

You can add a control in the panel called "Controls".

- `⚙️` +` Adds a new control
- `🗑` Removes selected control
- `⬆` Moves control up in the list (has no functional effect
- `⬇` Moves control down in the list (has no functional effect

A Control has a set of steps you can see them as frames where interpolation
happens between them. The minimal amount is two. To set values for a control,
select a control, then select the step you want to update using the numbers in
the bottom of the screen, under the image. Next you select the mutation you want
to add or update, and select 'Add mutation to control' from the bottom panel.
You can also set a value there.

Multiple controls can make adjustments to the same mutation.

In case of 'Translation', 'Rotation' and 'Deformation', the different mutations
are added to eachother. For 'Opacity' and 'Stretch' the mutations are multiplied
with eachother.

To stop with the 'step adjustment' mode, just click the currently selected step
again.

## Resources

Mutations and Control use WebGL Resources. Specifically 'Vertex Uniforms'. This
way the whole mutation process can happen on the GPU, making sure the animation
is fluent, and freeing up the CPU for JS execution. Animations are done on the
CPU and do not affect this resource usage. At the bottom right of the screen,
there is an indicator how many of these 'Vertex Uniforms' are used. There is an
upper limit of 512 in there. This is the limit of an iPhone. Android devices,
Chromebooks and Desktop PC's, typically have a limit of 1024 or higher.

If you are playing multiple files at the same time, take into account to stack
the resource usage. Always make sure to test the animations on the devices you
want to support.

With mutations and controls added to your image, you are ready for animation!
This can be done in realtime using the Geppetto player that adjust the controls,
or by building animation timelines.
