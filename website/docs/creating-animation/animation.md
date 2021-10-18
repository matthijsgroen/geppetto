---
sidebar_position: 6
---

# Animation screen

The animation screen is where you set up animations using controls defined in
the [Composition](./Composition) screen.

## Animation tracks

Animation tracks can be played seperately from eachother. When an animation is
using the same controls as an already playing track, the other track will
automatically stop.

Animation menu buttons:

- `⏱ +` Add a new animation track
- `🔍 +` Zoom in on the timeline for more detail
- `🔍 -` Zoom out on the timeline for more overview
- `✏️` Add a new keyframe on selected track
- `🗑` Remove keyframe when selected, or remove track when no frame is selected.

## Creating frames ✏️

On a selected timeline, you can add a frame using the `✏️ ` icon. The position
in you click in the track will determine the time of the frame. You can manually
update the time with more precision using the frame detail panel.

You can set control values by clicking on a control item in the left panel and
setting a value. By adding controls to frames and setting different values the
animation track will interpolate between the frames creating an animation.

### Custom events

Using the 'event' field in the frameInfo panel you can put a name that will be
emitted by the player as event in the website. You can use these events for
custom implementations, for instance to synchronise sound effects with the
animation.
