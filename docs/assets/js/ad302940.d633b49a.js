"use strict";(self.webpackChunkgeppetto=self.webpackChunkgeppetto||[]).push([[37],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return h}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),m=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=m(n),h=i,p=d["".concat(s,".").concat(h)]||d[h]||u[h]||o;return n?a.createElement(p,r(r({ref:t},c),{},{components:n})):a.createElement(p,r({ref:t},c))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,r[1]=l;for(var m=2;m<o;m++)r[m]=n[m];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1201:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return h},default:function(){return k},frontMatter:function(){return d},metadata:function(){return p},toc:function(){return g}});var a=n(7462),i=n(3366),o=n(7294),r=n(3905),l=n(9750),s=n(4996),m="textureImage_3iwf",c=function(e){var t=e.src,n=e.alt;return o.createElement("img",{src:(0,s.Z)(t),alt:n,className:m})},u=["components"],d={sidebar_position:4},h="Creating an animation",p={unversionedId:"creating-animation",id:"creating-animation",isDocsHomePage:!1,title:"Creating an animation",description:"Overview",source:"@site/docs/creating-animation.md",sourceDirName:".",slug:"/creating-animation",permalink:"/docs/creating-animation",editUrl:"https://github.com/matthijsgroen/geppetto/edit/gh-pages/website/docs/creating-animation.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Demo",permalink:"/docs/demo"},next:{title:"Using the player",permalink:"/docs/player"}},g=[{value:"Overview",id:"overview",children:[],level:2},{value:"Creating a texture",id:"creating-a-texture",children:[],level:2},{value:"Creating layers",id:"creating-layers",children:[{value:"Rename layer",id:"rename-layer",children:[],level:3},{value:"Creating a surface",id:"creating-a-surface",children:[],level:3},{value:"Using the grid",id:"using-the-grid",children:[],level:3}],level:2},{value:"Making the image &#39;move&#39;",id:"making-the-image-move",children:[{value:"Moving layers",id:"moving-layers",children:[],level:3},{value:"Adding mutations",id:"adding-mutations",children:[{value:"\ud83d\udfe2 Translation mutation",id:"-translation-mutation",children:[],level:4},{value:"\ud83d\udd34 Rotation mutation",id:"-rotation-mutation",children:[],level:4},{value:"\ud83d\udfe3 Stretch mutation",id:"-stretch-mutation",children:[],level:4},{value:"\u26aa\ufe0f Opacity mutation",id:"\ufe0f-opacity-mutation",children:[],level:4},{value:"\ud83d\udfe0 Deformation mutation",id:"-deformation-mutation",children:[],level:4},{value:"\u2b1c Lightness mutation",id:"-lightness-mutation",children:[],level:4},{value:"\ud83d\udfe7 Target color mutation",id:"-target-color-mutation",children:[],level:4},{value:"\ud83d\udfe9 Color transition mutation",id:"-color-transition-mutation",children:[],level:4}],level:3},{value:"Adding Controls",id:"adding-controls",children:[],level:3},{value:"Resources",id:"resources",children:[],level:3}],level:2},{value:"Creating animations",id:"creating-animations",children:[{value:"Animation tracks",id:"animation-tracks",children:[],level:3},{value:"Creating frames",id:"creating-frames",children:[],level:3},{value:"Custom events",id:"custom-events",children:[],level:3}],level:2}],f={toc:g};function k(e){var t=e.components,o=(0,i.Z)(e,u);return(0,r.kt)("wrapper",(0,a.Z)({},f,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"creating-an-animation"},"Creating an animation"),(0,r.kt)("h2",{id:"overview"},"Overview"),(0,r.kt)("p",null,"Creating a Geppetto Animation is a 5 step affair."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create a texture image. This is a flat ",(0,r.kt)("inlineCode",{parentName:"p"},".png")," image with all the layers you want/need laid out next to eachother. Ideally this file has a size in the power of 2, but this is not required.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Import this image in the Geppetto Studio app, and define the layer vertices and stacking order of the layers.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},'Add mutations to layers and layergroups using the "composition" screen of the Geppetto Studio App. This allows layers to move, become transparent, bend or rotate.')),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Add controls to manipulate multiple mutators at once, and determine minimum and maximum mutation values, so that movements or effects can not go haywire.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},'Using the controls of step 4, you can define animations on a timeline, and add moments of events to them. These "events" you can use in the player to add sound effects to your animation, or trigger other animations based on the moment of the timeline.'))),(0,r.kt)("h2",{id:"creating-a-texture"},"Creating a texture"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Creating texture in the Gimp",src:n(8499).Z})),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a texture file (a 2d image file, for instance .png). You should\nuse a digital paint program for this. For instance ",(0,r.kt)("a",{parentName:"li",href:"https://www.adobe.com/products/photoshop.html"},"Photoshop")," or ",(0,r.kt)("a",{parentName:"li",href:"https://www.gimp.org/"},"The Gimp"),".\nMake sure you put the layers you want next to eachother in the flat image, you can make them stack again within the Geppetto Studio app."),(0,r.kt)("li",{parentName:"ol"},"In the app, you'll load in this texture and create shapes from the 2d\ntexture, in the ",(0,r.kt)("strong",{parentName:"li"},"Layers")," screen. Each shape is build by placing points,\nthat gets automatically triangulated into a shape. The location you place the\npoints can be important, since the goal of the mutations is to move these\npoints around, causing the texture on the shape to move, stretch, rotate or\nbend."),(0,r.kt)("li",{parentName:"ol"},"In the composition screen, you can stack and move the layers to form your\nintended picture. The order of layers is also the stacking order.")),(0,r.kt)(c,{src:"/demo-assets/scenery.png",alt:"Scenery texture",mdxType:"TextureImage"}),(0,r.kt)("h2",{id:"creating-layers"},"Creating layers"),(0,r.kt)(l.Z,{alt:"Layer screen",sources:{light:(0,s.Z)("/screenshots/layers-light.png"),dark:(0,s.Z)("/screenshots/layers-dark.png")},mdxType:"ThemedImage"}),(0,r.kt)("p",null,"The layer screen is where you create layers from your texture."),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"In the composition screen you can then stack te layers to make items move across of eachother."))),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a new file: Ctrl/Cmd + N (or File -> New from the main menu)"),(0,r.kt)("li",{parentName:"ol"},"Load your texture file: Ctrl/Cmd + Shift + O (or File -> Load Texture from\nthe main menu)")),(0,r.kt)("p",null,'You should now see your texture file in Geppetto. In the "Layers" pane on the\nleft, you can manage the layers:'),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udcc4 +")," Add Layer"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udcc1 +")," Add folder"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udcd1")," Clone current selected layer"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\uddd1")," Remove the current selected layer, or an ",(0,r.kt)("em",{parentName:"li"},"empty")," folder"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2b06")," Move layer/folder up"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2b07")," Move layer/folder down")),(0,r.kt)("p",null,"If you add a new layer, you'll see a ",(0,r.kt)("inlineCode",{parentName:"p"},"(0)")," appended to the layer. This is the\namount of points the layer contains. You must have at least 3 points in a layer\nto create a surface."),(0,r.kt)("h3",{id:"rename-layer"},"Rename layer"),(0,r.kt)("p",null,"To rename a layer, you can double-click on the layer/folder, and enter a new\nname."),(0,r.kt)("h3",{id:"creating-a-surface"},"Creating a surface"),(0,r.kt)("p",null,"With a layer selected, you can switch from edit mode. The edit modes are listed\non top of the central area:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u270b")," Move mode. By pressing and holding the mouse you can move the texture."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udd27")," Select mode. In this mode you can click on a point without adding new\nones, to allow editing of its location, or remove it."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u270f\ufe0f")," Add point mode. By clicking in the texture it will add a point to the\nlayer. The points are automatically connected to other points in the same\narea, forming triangles.")),(0,r.kt)("p",null,'The active selected point will display a larger block than the others. When a\npoint is selected, you can see (and edit) its coordinates in the "Point info"\npane in the bottomleft. You can also delete the selected point by using the ',(0,r.kt)("inlineCode",{parentName:"p"},"\ud83d\uddd1"),"\non top of the center area."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"When mutating elemements, they will move the points of a surface, making the image move. So placing extra points in your surface can imporove movement effects."))),(0,r.kt)("h3",{id:"using-the-grid"},"Using the grid"),(0,r.kt)("p",null,"You can enable a grid to more easily place points. Using the ",(0,r.kt)("inlineCode",{parentName:"p"},"-")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"+")," buttons in the toolbar, you can increase / decrease the raster size. By clicking on the size, you can toggle the visibility of the grid, and by clicking the ",(0,r.kt)("inlineCode",{parentName:"p"},"\ud83e\uddf2")," icon, you can make the grid magnetic, then all new points will automatically be placed on raster edges."),(0,r.kt)("h2",{id:"making-the-image-move"},"Making the image 'move'"),(0,r.kt)(l.Z,{alt:"Composition screen",sources:{light:(0,s.Z)("/screenshots/rotation-light.png"),dark:(0,s.Z)("/screenshots/rotation-dark.png")},mdxType:"ThemedImage"}),(0,r.kt)("p",null,"The composition screen is where you wire up all the moving parts of your image."),(0,r.kt)("p",null,"It has the same tree structure on the side as the layers. You can move the\nlayers and folders here to change the stacking order of the layers."),(0,r.kt)("h3",{id:"moving-layers"},"Moving layers"),(0,r.kt)("p",null,"By default, a layer is positioned with its center to the center of the image. So\nif you create all the layer surfaces in the layer screen you will notice that\nthey are stacked on eachother at the center."),(0,r.kt)("p",null,"When you select a layer from the tree on the left, you can move the layer around\nby holdin Shift while dragging. (This also works for folders)."),(0,r.kt)("p",null,"For precision movement, use the pane in the bottom left, which should have the\ntitle of the layer as name. There you can manipulate the X and Y by entering new\ncoordinates, or using the up/down arrows."),(0,r.kt)("h3",{id:"adding-mutations"},"Adding mutations"),(0,r.kt)("p",null,'In the "Composition" pane on the left, you can reorder layers, place them in\nfolders and add mutations:'),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u26aa\ufe0f +")," Add Mutation to selected layer or folder"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udcc1 +")," Add folder"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\uddd1")," Delete the selected mutation or an ",(0,r.kt)("em",{parentName:"li"},"empty")," folder. You can only delete\nlayers from the Layers screen (on purpose)."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2b06")," Move layer/folder up"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2b07")," Move layer/folder down")),(0,r.kt)("p",null,"Each mutation type has a different effect on the surface(s) they are applied to.\nWhen you add a mutation you will see a colored dot added to the center of an\nimage. This dot is the 'origin' of the effect. (For instance the point of\nrotation). You can move the origin by using Shift while dragging with the\nmutation selected, or by adjusting the origin manually in the bottom left panel."),(0,r.kt)("h4",{id:"-translation-mutation"},"\ud83d\udfe2 Translation mutation"),(0,r.kt)("p",null,"The green circle means translation. With the translation mutator, you can move\nthe layer or folder. If you enable the radius option, only the points within the\nradius around the origin are moved."),(0,r.kt)("h4",{id:"-rotation-mutation"},"\ud83d\udd34 Rotation mutation"),(0,r.kt)("p",null,"The red circle means rotation. You can use this to rotate a layer or folder\naround its origin (The red dot)."),(0,r.kt)("h4",{id:"-stretch-mutation"},"\ud83d\udfe3 Stretch mutation"),(0,r.kt)("p",null,"The purple circle means stretch. You can stretch all points of a layer or folder\nusing the origin as center of the stretch. 1 is the default size, 0.5 is half\n(scale down) 2 is double the size (scale up). You can use negative values to\nmirror surfaces."),(0,r.kt)("h4",{id:"\ufe0f-opacity-mutation"},"\u26aa\ufe0f Opacity mutation"),(0,r.kt)("p",null,"The white circle means opacity. You can change the opacity of an entire layer or\nfolder. The origin is changeable, but it will not affect the result."),(0,r.kt)("h4",{id:"-deformation-mutation"},"\ud83d\udfe0 Deformation mutation"),(0,r.kt)("p",null,"The orange circle means deformation. It is like translation with radius, only\nits effect will linear decline from the origin towards the radius."),(0,r.kt)("h4",{id:"-lightness-mutation"},"\u2b1c Lightness mutation"),(0,r.kt)("p",null,"The white square means lightness. It can be used to make colors darker."),(0,r.kt)("h4",{id:"-target-color-mutation"},"\ud83d\udfe7 Target color mutation"),(0,r.kt)("p",null,"The orange square is to set the color as base color for 'Color Transition' effects."),(0,r.kt)("h4",{id:"-color-transition-mutation"},"\ud83d\udfe9 Color transition mutation"),(0,r.kt)("p",null,"The green square is to transition the colors towards the 'Target color'. If no target color is specified it will transition to greyscale."),(0,r.kt)("h3",{id:"adding-controls"},"Adding Controls"),(0,r.kt)(l.Z,{alt:"Controls",sources:{light:(0,s.Z)("/screenshots/controls-light.png"),dark:(0,s.Z)("/screenshots/controls-dark.png")},mdxType:"ThemedImage"}),(0,r.kt)("p",null,"Controls allow your image to be controlled from the outside, or by an animation.\nA control has 'steps', each step is a set of values for mutations. By using\ncontrols, Geppetto will transition these mutations when the controls are\nchanged."),(0,r.kt)("p",null,'You can add a control in the panel called "Controls".'),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2699\ufe0f +")," Adds a new control"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\uddd1")," Removes selected control"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2b06")," Moves control up in the list (has no functional effect"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u2b07")," Moves control down in the list (has no functional effect")),(0,r.kt)("p",null,"A Control has a set of steps you can see them as frames where interpolation\nhappens between them. The minimal amount is two. To set values for a control,\nselect a control, then select the step you want to update using the numbers in\nthe bottom of the screen, under the image. Next you select the mutation you want\nto add or update, and select 'Add mutation to control' from the bottom panel.\nYou can also set a value there."),(0,r.kt)("p",null,"Multiple controls can make adjustments to the same mutation."),(0,r.kt)("p",null,"In case of 'Translation', 'Rotation' and 'Deformation', the different mutations\nare added to eachother. For 'Opacity' and 'Stretch' the mutations are multiplied\nwith eachother."),(0,r.kt)("p",null,"To stop with the 'step adjustment' mode, just click the currently selected step\nagain."),(0,r.kt)("h3",{id:"resources"},"Resources"),(0,r.kt)("p",null,"Mutations and Control use WebGL Resources. Specifically 'Vertex Uniforms'. This\nway the whole mutation process can happen on the GPU, making sure the animation\nis fluent, and freeing up the CPU for JS execution. Animations are done on the\nCPU and do not affect this resource usage. At the bottom right of the screen,\nthere is an indicator how many of these 'Vertex Uniforms' are used. There is an\nupper limit of 512 in there. This is the limit of an iPhone. Android devices,\nChromebooks and Desktop PC's, typically have a limit of 1024 or higher."),(0,r.kt)("p",null,"If you are playing multiple files at the same time, take into account to stack\nthe resource usage. Always make sure to test the animations on the devices you\nwant to support."),(0,r.kt)("p",null,"With mutations and controls added to your image, you are ready for animation!\nThis can be done in realtime using the Geppetto player that adjust the controls,\nor by building animation timelines."),(0,r.kt)("h2",{id:"creating-animations"},"Creating animations"),(0,r.kt)(l.Z,{alt:"Animation screen",sources:{light:(0,s.Z)("/screenshots/animation-light.png"),dark:(0,s.Z)("/screenshots/animation-dark.png")},mdxType:"ThemedImage"}),(0,r.kt)("p",null,"The animation screen is where you set up animations using controls defined in\nthe ",(0,r.kt)("a",{parentName:"p",href:"#making-the-image-move"},"Composition")," screen."),(0,r.kt)("h3",{id:"animation-tracks"},"Animation tracks"),(0,r.kt)("p",null,"Animation tracks can be played seperately from eachother. When an animation is\nusing the same controls as an already playing track, the other track will\nautomatically stop."),(0,r.kt)("p",null,"Animation menu buttons:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u23f1 +")," Add a new animation track"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udd0d +")," Zoom in on the timeline for more detail"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\udd0d -")," Zoom out on the timeline for more overview"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\u270f\ufe0f")," Add a new keyframe on selected track"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"\ud83d\uddd1")," Remove keyframe when selected, or remove track when no frame is selected.")),(0,r.kt)("h3",{id:"creating-frames"},"Creating frames"),(0,r.kt)("p",null,"On a selected timeline, you can add a frame using the ",(0,r.kt)("inlineCode",{parentName:"p"},"\u270f\ufe0f ")," icon. The position\nin you click in the track will determine the time of the frame. You can manually\nupdate the time with more precision using the frame detail panel."),(0,r.kt)("p",null,"You can set control values by clicking on a control item in the left panel and\nsetting a value. By adding controls to frames and setting different values the\nanimation track will interpolate between the frames creating an animation."),(0,r.kt)("h3",{id:"custom-events"},"Custom events"),(0,r.kt)("p",null,"Using the 'event' field in the frameInfo panel you can put a name that will be\nemitted by the player as event in the website. You can use these events for\ncustom implementations, for instance to synchronise sound effects with the\nanimation."))}k.isMDXComponent=!0},8499:function(e,t,n){t.Z=n.p+"assets/images/texture-6e24bde2806c3d0cea2ee74da8b345e5.png"}}]);