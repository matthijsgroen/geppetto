# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] - 2021-12-01

### Fixed

- Issue where `onTrackStopped` callbacks where triggered from the wrong animation

## [1.3.1] - 2021-11-29

### Fixed

- Issue where simple animations caused a failure in shader compilation

## [1.3.0] - 2021-11-17

### Added

- Added support for 3 new mutations: Lightness, Target color and Color transition.

### Fixed

- Triggering of events are now correct when using different playback speeds.

## [1.2.0] - 2021-05-07

### Changed

- Simple controls are now executed by JavasScript instead of a WebGL shader. Freeing up to 40% of vertex uniforms, allowing more complex animations.

## [1.1.1] - 2021-05-01

### Fixed

- Added browserslist to indicate output syntax. This helps in projects using the player to indicate if further transpilation is required (e.g. parcel).

## [1.1.0] - 2021-04-25

### Added

- Added Playback options on `startTrack`. The options `startAt` (in ms) and `speed` are now supported.

## [1.0.0] - 2021-04-18

On the 18th of January 2021 I started with a project to allow myself to create animated scenery and characters using drawn images. In the past 3 months I learned a lot about WebGL, electron and drawing for animations. I'm really happy with the minimal viable product I have now, so today I'm making the release official.

Of course there are improvements to be made (there always are) but for a first release, the current state should be fine 😊

### Added

- `setupWebGL` and `createPlayer` function creating a gepetto player to add animations.
- `prepareAnimation` to convert a Geppetto animation file (`.json`) to precalculated buffers.
- Stopping conflicting animation tracks when an animation is started or a control is used.
- Support for listening to custom events from animations.
