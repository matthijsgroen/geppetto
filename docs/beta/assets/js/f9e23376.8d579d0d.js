"use strict";(self.webpackChunkgeppetto=self.webpackChunkgeppetto||[]).push([[80],{1262:function(t,e,n){var a=n(7294),o=n(2389);e.Z=function(t){var e=t.children,n=t.fallback;return(0,o.Z)()&&null!=e?a.createElement(a.Fragment,null,e()):n||null}},4912:function(t,e,n){n.r(e),n.d(e,{contentTitle:function(){return g},default:function(){return v},frontMatter:function(){return h},metadata:function(){return b},toc:function(){return k}});var a=n(7462),o=n(3366),r=n(7294),i=n(3905),l=n(9960),p="buttons_2EmP",u=n(1262),c=function(t,e){return"https://github.com/matthijsgroen/geppetto/releases/download/"+t+"/"+e},m=function(t){return[{platform:"Mac",arch:"x64",filename:"Geppetto-"+t+".dmg"},{platform:"Mac",arch:"arm64",filename:"Geppetto-"+t+"-arm64-mac.dmg"},{platform:"Windows",filename:"Geppetto.Setup."+t+".exe"},{platform:"Linux",arch:"amd64",filename:"geppetto_"+t+"_amd64.deb"},{platform:"Linux",arch:"arm64",filename:"geppetto_"+t+"_arm64.deb"}]};var d=function(t){var e=t.version,n=(0,r.useState)((function(){return navigator.platform.indexOf("Mac")>-1?"Mac":navigator.platform.indexOf("Linux")>-1?"Linux":"Windows"})),a=n[0],o=n[1],i=m(e).filter((function(t){return t.platform===a})),u=m(e).map((function(t){return t.platform})).filter((function(t,e,n){return n.indexOf(t)===e})),d=u.filter((function(t){return t!==a}));return r.createElement("div",null,r.createElement("div",{className:p},i.map((function(t){return r.createElement(l.Z,{key:t.filename,className:"button button--primary button--lg",href:c(e,t.filename)},"Download Studio ",e," for ",t.platform," ",t.arch)}))),r.createElement("p",{style:{textAlign:"center"}},"Other platforms:"," ",d.map((function(t,e){return r.createElement(r.Fragment,{key:e},0!==e&&" | ",r.createElement("a",{href:"#",onClick:function(){return o(t)}},t))}))))},s=function(t){return r.createElement(u.Z,null,(function(){return r.createElement(d,t)}))},f=["components"],h={sidebar_position:2,title:"Download"},g="Download",b={unversionedId:"download",id:"download",isDocsHomePage:!1,title:"Download",description:"Currently the Geppetto Studio app is only available as installable Desktop application for Mac, Linux and Windows. In the future I hope to also make it available directly from the browser.",source:"@site/docs/download.md",sourceDirName:".",slug:"/download",permalink:"/beta/docs/download",editUrl:"https://github.com/matthijsgroen/geppetto/edit/gh-pages/website/docs/download.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,title:"Download"},sidebar:"tutorialSidebar",previous:{title:"Getting started",permalink:"/beta/docs/intro"},next:{title:"Demo",permalink:"/beta/docs/demo"}},k=[{value:"Installation",id:"installation",children:[{value:"Open an untrusted app on Mac",id:"open-an-untrusted-app-on-mac",children:[],level:3}],level:2}],w={toc:k};function v(t){var e=t.components,n=(0,o.Z)(t,f);return(0,i.kt)("wrapper",(0,a.Z)({},w,n,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"download"},"Download"),(0,i.kt)("p",null,"Currently the ",(0,i.kt)("strong",{parentName:"p"},"Geppetto Studio app")," is only available as installable Desktop application for Mac, Linux and Windows. In the future I hope to also make it available directly from the browser."),(0,i.kt)(s,{version:"1.2.0",mdxType:"DownloadButtons"}),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("p",null,"The apps are untrusted at the moment, if you don't trust it, you can either checkout the electron code at ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/matthijsgroen/geppetto/tree/main/public/electron"},"https://github.com/matthijsgroen/geppetto/tree/main/public/electron")," to review yourself if you trust what I'm doing."),(0,i.kt)("h3",{id:"open-an-untrusted-app-on-mac"},"Open an untrusted app on Mac"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac"},"https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac")))}v.isMDXComponent=!0}}]);