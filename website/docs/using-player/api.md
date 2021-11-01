---
sidebar_position: 2
---

import { ObjectMethods, MethodSignature } from "@site/src/components/APIDocumentation";
import API from "./typedocs.json";

# API Reference

The following methods are exposed on top level:

## Methods

### setupWebGL

<MethodSignature api={API} element="setupWebGL" />

### createPlayer

<MethodSignature api={API} element="createPlayer" />

### prepareAnimation

<MethodSignature api={API} element="prepareAnimation" />

## GeppetoPlayer

<ObjectMethods api={API} element="GeppettoPlayer" omitReturnTypes={["AnimationControls"]} />

## AnimationControls

<ObjectMethods api={API} element="AnimationControls" />
