"use strict";(self.webpackChunkgeppetto=self.webpackChunkgeppetto||[]).push([[686],{9904:function(e,n,a){a.r(n),a.d(n,{contentTitle:function(){return k},default:function(){return w},frontMatter:function(){return h},metadata:function(){return b},toc:function(){return f}});var t=a(7462),r=a(3366),o=a(7294),l=a(3905),i=a(2389),u=a(9443);var p=function(){var e=(0,o.useContext)(u.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=a(9521),m=a(6010),c="tabItem_1uMI";function d(e){var n,a,t,r=e.lazy,l=e.block,i=e.defaultValue,u=e.values,d=e.groupId,g=e.className,y=o.Children.map(e.children,(function(e){if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=u?u:y.map((function(e){var n=e.props;return{value:n.value,label:n.label}})),h=(0,s.lx)(v,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===i?i:null!=(n=null!=i?i:null==(a=y.find((function(e){return e.props.default})))?void 0:a.props.value)?n:null==(t=y[0])?void 0:t.props.value;if(null!==k&&!v.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=p(),f=b.tabGroupChoices,T=b.setTabGroupChoices,w=(0,o.useState)(k),N=w[0],x=w[1],I=[],C=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=f[d];null!=E&&E!==N&&v.some((function(e){return e.value===E}))&&x(E)}var A=function(e){var n=e.currentTarget,a=I.indexOf(n),t=v[a].value;t!==N&&(C(n),x(t),null!=d&&T(d,t))},j=function(e){var n,a=null;switch(e.key){case"ArrowRight":var t=I.indexOf(e.currentTarget)+1;a=I[t]||I[0];break;case"ArrowLeft":var r=I.indexOf(e.currentTarget)-1;a=I[r]||I[I.length-1]}null==(n=a)||n.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,m.Z)("tabs",{"tabs--block":l},g)},v.map((function(e){var n=e.value,a=e.label;return o.createElement("li",{role:"tab",tabIndex:N===n?0:-1,"aria-selected":N===n,className:(0,m.Z)("tabs__item",c,{"tabs__item--active":N===n}),key:n,ref:function(e){return I.push(e)},onKeyDown:j,onFocus:A,onClick:A},null!=a?a:n)}))),r?(0,o.cloneElement)(y.filter((function(e){return e.props.value===N}))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},y.map((function(e,n){return(0,o.cloneElement)(e,{key:n,hidden:e.props.value!==N})}))))}function g(e){var n=(0,i.Z)();return o.createElement(d,(0,t.Z)({key:String(n)},e))}var y=function(e){var n=e.children,a=e.hidden,t=e.className;return o.createElement("div",{role:"tabpanel",hidden:a,className:t},n)},v=["components"],h={sidebar_position:5},k="Using the player",b={unversionedId:"player",id:"player",isDocsHomePage:!1,title:"Using the player",description:"The Geppetto Player is a Typescript library you can use in your web project to embed animations on your website.",source:"@site/docs/player.md",sourceDirName:".",slug:"/player",permalink:"/beta/docs/player",editUrl:"https://github.com/matthijsgroen/geppetto/edit/gh-pages/website/docs/player.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Creating an animation",permalink:"/beta/docs/creating-animation"},next:{title:"Animation playground",permalink:"/beta/docs/playground"}},f=[{value:"Install Player",id:"install-player",children:[],level:2},{value:"Setup WebGL",id:"setup-webgl",children:[],level:2},{value:"Adding an animation",id:"adding-an-animation",children:[],level:2},{value:"Setting up a render loop",id:"setting-up-a-render-loop",children:[],level:2},{value:"Controlling an animation",id:"controlling-an-animation",children:[],level:2}],T={toc:f};function w(e){var n=e.components,a=(0,r.Z)(e,v);return(0,l.kt)("wrapper",(0,t.Z)({},T,a,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"using-the-player"},"Using the player"),(0,l.kt)("p",null,"The Geppetto Player is a Typescript library you can use in your web project to embed animations on your website."),(0,l.kt)("h2",{id:"install-player"},"Install Player"),(0,l.kt)("p",null,"You can install the library using the ",(0,l.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/geppetto-player"},(0,l.kt)("inlineCode",{parentName:"a"},"geppetto-player"))," npm package."),(0,l.kt)(g,{groupId:"package-manager",mdxType:"Tabs"},(0,l.kt)(y,{value:"npm",label:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"npm install geppetto-player\n"))),(0,l.kt)(y,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add geppetto-player\n")))),(0,l.kt)("h2",{id:"setup-webgl"},"Setup WebGL"),(0,l.kt)("p",null,"First you need to setup a canvas environment.\nYou can use the ",(0,l.kt)("inlineCode",{parentName:"p"},"setupWebGL")," method to help you with that."),(0,l.kt)(g,{groupId:"coding-language",mdxType:"Tabs"},(0,l.kt)(y,{value:"ts",label:"Typescript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},'import { setupWebGL } from "geppetto-player";\n\nconst canvas = document.getElementById("theatre") as HTMLCanvasElement;\nconst player = setupWebGL(canvas);\n'))),(0,l.kt)(y,{value:"js",label:"JavaScript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'import { setupWebGL } from "geppetto-player";\n\nconst canvas = document.getElementById("theatre");\nconst player = setupWebGL(canvas);\n')))),(0,l.kt)("p",null,"This will initialise the ",(0,l.kt)("inlineCode",{parentName:"p"},"WebGL")," context of the ",(0,l.kt)("inlineCode",{parentName:"p"},"<canvas />")," element, and return a player to setup Geppetto animations."),(0,l.kt)("p",null,"With the player you can now add animations to the player. You can setup and use multiple animations in a single player."),(0,l.kt)("h2",{id:"adding-an-animation"},"Adding an animation"),(0,l.kt)("p",null,"To add the animation, you need to convert the animation ",(0,l.kt)("inlineCode",{parentName:"p"},".json")," file created with the studio application to a format optimized for playback."),(0,l.kt)(g,{groupId:"coding-language",mdxType:"Tabs"},(0,l.kt)(y,{value:"ts",label:"Typescript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},'import { prepareAnimation, ImageDefinition } from "geppetto-player";\nimport animationData from "my-animation-file.json";\n\nconst preparedAnimation = prepareAnimation(\n  animationData as unknown as ImageDefinition\n);\n'))),(0,l.kt)(y,{value:"js",label:"JavaScript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'import { prepareAnimation, ImageDefinition } from "geppetto-player";\nimport animationData from "my-animation-file.json";\n\nconst preparedAnimation = prepareAnimation(animationData);\n')))),(0,l.kt)("p",null,"You also need to provide your texture using an ",(0,l.kt)("inlineCode",{parentName:"p"},"Image")," element in javascript."),(0,l.kt)("p",null,"You can load your texture with the example code provided here:"),(0,l.kt)(g,{groupId:"coding-language",mdxType:"Tabs"},(0,l.kt)(y,{value:"ts",label:"Typescript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},'const loadTexture = async (url: string): Promise<HTMLImageElement> =>\n  new Promise((resolve) => {\n    const image = new Image();\n    image.crossOrigin = "anonymous";\n    image.src = url;\n    image.onload = () => resolve(image);\n  });\n\nconst animationTexture = await loadTexture("./url-of-texture.png");\n'))),(0,l.kt)(y,{value:"js",label:"JavaScript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'const loadTexture = async (url) =>\n  new Promise((resolve) => {\n    const image = new Image();\n    image.crossOrigin = "anonymous";\n    image.src = url;\n    image.onload = () => resolve(image);\n  });\n\nconst animationTexture = await loadTexture("./url-of-texture.png");\n')))),(0,l.kt)("p",null,"You can now add your animation to the player, receiving an ",(0,l.kt)("inlineCode",{parentName:"p"},"AnimationControl")," object to control your animation."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const animationControl = player.addAnimation(\n  preparedAnimation,\n  animationTexture,\n  0\n);\n")),(0,l.kt)("h2",{id:"setting-up-a-render-loop"},"Setting up a render loop"),(0,l.kt)("p",null,"In order to make the animation work, you should create a render loop that renders the animation for each frame."),(0,l.kt)("p",null,"The reason we let you setup this loop, is that you will have more control over it."),(0,l.kt)("p",null,"For the animation above, this loop would be simple:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const renderFrame = () => {\n  player.render(); // Clear the canvas\n  animationControl.render(); // Render a frame of my first animation\n  // ... for multiple animations, do a render() call for each animationControl\n\n  window.requestAnimationFrame(renderFrame);\n};\n\nwindow.requestAnimationFrame(renderFrame);\n")),(0,l.kt)("h2",{id:"controlling-an-animation"},"Controlling an animation"),(0,l.kt)("p",null,"With the animation now visible, you can start animation tracks, listen to events, or do real-time control manipulations."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},'animationControl.startTrack("MyAnimation");\nanimationControl.setControlValue("MyControl", 0.65);\n')))}w.isMDXComponent=!0}}]);