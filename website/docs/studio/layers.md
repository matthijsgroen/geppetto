---
sidebar_position: 3
---

# Layers screen

The layer screen is where you create layers from your texture.

1. Create a new file: Ctrl/Cmd + N (or File -> New from the main menu)
2. Load your texture file: Ctrl/Cmd + Shift + O (or File -> Load Texture from
   the main menu)

You should now see your texture file in Geppetto. In the "Layers" pane on the
left, you can manage the layers:

- `📄 +` Add Layer
- `📁 +` Add folder
- `📑` Clone current selected layer
- `🗑` Remove the current selected layer, or an _empty_ folder
- `⬆` Move layer/folder up
- `⬇` Move layer/folder down

If you add a new layer, you'll see a `(0)` appended to the layer. This is the
amount of points the layer contains. You must have at least 3 points in a layer
to create a surface.

## Rename layer

To rename a layer, you can double-click on the layer/folder, and enter a new
name.

## Creating a surface

With a layer selected, you can switch from edit mode. The edit modes are listed
on top of the central area:

- `✋` Move mode. By pressing and holding the mouse you can move the texture.
- `🔧` Select mode. In this mode you can click on a point without adding new
  ones, to allow editing of its location, or remove it.
- `✏️` Add point mode. By clicking in the texture it will add a point to the
  layer. The points are automatically connected to other points in the same
  area, forming triangles.

The active selected point will display a larger block than the others. When a
point is selected, you can see (and edit) its coordinates in the "Point info"
pane in the bottomleft. You can also delete the selected point by using the `🗑`
on top of the center area.
