# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Number fields that are emptied crashed the application

## [1.0.0] - 2021-04-18

On the 18th of January 2021 I started with a project to allow myself to create animated scenery and characters using drawn images. In the past 3 months I learned a lot about WebGL, electron and drawing for animations. I'm really happy with the minimal viable product I have now, so today I'm making the release official.

Of course there are improvements to be made (there always are) but for a first release, the current state should be fine 😊

I would like to extend special thanks to my colleagues at [Kabisa](https://www.kabisa.nl/) To help with UX review (Lianne van Thuijl), an awesomme logo (Guido Theelen), discussion about packaging and building (Pascal Widdershoven) and daily motivation (Laurens Boekhorst and Andy Maes).

### Added

- Basic editing to create layer shapes
- Composition of layers with ordering and shift of location
- Placement of mutations on layers and folders
- Support for mutations:
  - Translation
  - Stretch
  - Rotate
  - Deform
  - Opacity
- Create controls to set boundaries to mutations, and change multiple mutations in sync.
- Create animation timeslines, built with keyframes of control values
- Allow emitting custom events by setting an event name on a keyframe
