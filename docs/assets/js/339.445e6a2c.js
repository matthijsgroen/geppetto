(self.webpackChunkgeppetto=self.webpackChunkgeppetto||[]).push([[339],{7757:function(t,e,n){t.exports=n(5666)},1262:function(t,e,n){"use strict";var r=n(7294),o=n(2389);e.Z=function(t){var e=t.children,n=t.fallback;return(0,o.Z)()&&null!=e?r.createElement(r.Fragment,null,e()):n||null}},6618:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return i}});const r=Math.pow(2,-52),o=new Uint32Array(512);class i{static from(t,e=d,n=m){const r=t.length,o=new Float64Array(2*r);for(let i=0;i<r;i++){const r=t[i];o[2*i]=e(r),o[2*i+1]=n(r)}return new i(o)}constructor(t){const e=t.length>>1;if(e>0&&"number"!=typeof t[0])throw new Error("Expected coords to contain numbers.");this.coords=t;const n=Math.max(2*e-5,0);this._triangles=new Uint32Array(3*n),this._halfedges=new Int32Array(3*n),this._hashSize=Math.ceil(Math.sqrt(e)),this._hullPrev=new Uint32Array(e),this._hullNext=new Uint32Array(e),this._hullTri=new Uint32Array(e),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(e),this._dists=new Float64Array(e),this.update()}update(){const{coords:t,_hullPrev:e,_hullNext:n,_hullTri:o,_hullHash:i}=this,s=t.length>>1;let c=1/0,h=1/0,d=-1/0,m=-1/0;for(let r=0;r<s;r++){const e=t[2*r],n=t[2*r+1];e<c&&(c=e),n<h&&(h=n),e>d&&(d=e),n>m&&(m=n),this._ids[r]=r}const p=(c+d)/2,g=(h+m)/2;let v,y,E,_=1/0;for(let r=0;r<s;r++){const e=a(p,g,t[2*r],t[2*r+1]);e<_&&(v=r,_=e)}const x=t[2*v],T=t[2*v+1];_=1/0;for(let r=0;r<s;r++){if(r===v)continue;const e=a(x,T,t[2*r],t[2*r+1]);e<_&&e>0&&(y=r,_=e)}let w=t[2*y],M=t[2*y+1],L=1/0;for(let r=0;r<s;r++){if(r===v||r===y)continue;const e=u(x,T,w,M,t[2*r],t[2*r+1]);e<L&&(E=r,L=e)}let b=t[2*E],A=t[2*E+1];if(L===1/0){for(let r=0;r<s;r++)this._dists[r]=t[2*r]-t[0]||t[2*r+1]-t[1];f(this._ids,this._dists,0,s-1);const e=new Uint32Array(s);let n=0;for(let t=0,r=-1/0;t<s;t++){const o=this._ids[t];this._dists[o]>r&&(e[n++]=o,r=this._dists[o])}return this.hull=e.subarray(0,n),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(l(x,T,w,M,b,A)){const t=y,e=w,n=M;y=E,w=b,M=A,E=t,b=e,A=n}const S=function(t,e,n,r,o,i){const a=n-t,s=r-e,l=o-t,c=i-e,u=a*a+s*s,f=l*l+c*c,h=.5/(a*c-s*l);return{x:t+(c*u-s*f)*h,y:e+(a*f-l*u)*h}}(x,T,w,M,b,A);this._cx=S.x,this._cy=S.y;for(let r=0;r<s;r++)this._dists[r]=a(t[2*r],t[2*r+1],S.x,S.y);f(this._ids,this._dists,0,s-1),this._hullStart=v;let R=3;n[v]=e[E]=y,n[y]=e[v]=E,n[E]=e[y]=v,o[v]=0,o[y]=1,o[E]=2,i.fill(-1),i[this._hashKey(x,T)]=v,i[this._hashKey(w,M)]=y,i[this._hashKey(b,A)]=E,this.trianglesLen=0,this._addTriangle(v,y,E,-1,-1,-1);for(let a,u,f=0;f<this._ids.length;f++){const s=this._ids[f],c=t[2*s],h=t[2*s+1];if(f>0&&Math.abs(c-a)<=r&&Math.abs(h-u)<=r)continue;if(a=c,u=h,s===v||s===y||s===E)continue;let d=0;for(let t=0,e=this._hashKey(c,h);t<this._hashSize&&(d=i[(e+t)%this._hashSize],-1===d||d===n[d]);t++);d=e[d];let m,p=d;for(;m=n[p],!l(c,h,t[2*p],t[2*p+1],t[2*m],t[2*m+1]);)if(p=m,p===d){p=-1;break}if(-1===p)continue;let g=this._addTriangle(p,s,n[p],-1,-1,o[p]);o[s]=this._legalize(g+2),o[p]=g,R++;let _=n[p];for(;m=n[_],l(c,h,t[2*_],t[2*_+1],t[2*m],t[2*m+1]);)g=this._addTriangle(_,s,m,o[s],-1,o[_]),o[s]=this._legalize(g+2),n[_]=_,R--,_=m;if(p===d)for(;m=e[p],l(c,h,t[2*m],t[2*m+1],t[2*p],t[2*p+1]);)g=this._addTriangle(m,s,p,-1,o[p],o[m]),this._legalize(g+2),o[m]=g,n[p]=p,R--,p=m;this._hullStart=e[s]=p,n[p]=e[_]=s,n[s]=_,i[this._hashKey(c,h)]=s,i[this._hashKey(t[2*p],t[2*p+1])]=p}this.hull=new Uint32Array(R);for(let r=0,a=this._hullStart;r<R;r++)this.hull[r]=a,a=n[a];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,e){return Math.floor(function(t,e){const n=t/(Math.abs(t)+Math.abs(e));return(e>0?3-n:1+n)/4}(t-this._cx,e-this._cy)*this._hashSize)%this._hashSize}_legalize(t){const{_triangles:e,_halfedges:n,coords:r}=this;let i=0,a=0;for(;;){const s=n[t],l=t-t%3;if(a=l+(t+2)%3,-1===s){if(0===i)break;t=o[--i];continue}const u=s-s%3,f=l+(t+1)%3,h=u+(s+2)%3,d=e[a],m=e[t],p=e[f],g=e[h];if(c(r[2*d],r[2*d+1],r[2*m],r[2*m+1],r[2*p],r[2*p+1],r[2*g],r[2*g+1])){e[t]=g,e[s]=d;const r=n[h];if(-1===r){let e=this._hullStart;do{if(this._hullTri[e]===h){this._hullTri[e]=t;break}e=this._hullPrev[e]}while(e!==this._hullStart)}this._link(t,r),this._link(s,n[a]),this._link(a,h);const l=u+(s+1)%3;i<o.length&&(o[i++]=l)}else{if(0===i)break;t=o[--i]}}return a}_link(t,e){this._halfedges[t]=e,-1!==e&&(this._halfedges[e]=t)}_addTriangle(t,e,n,r,o,i){const a=this.trianglesLen;return this._triangles[a]=t,this._triangles[a+1]=e,this._triangles[a+2]=n,this._link(a,r),this._link(a+1,o),this._link(a+2,i),this.trianglesLen+=3,a}}function a(t,e,n,r){const o=t-n,i=e-r;return o*o+i*i}function s(t,e,n,r,o,i){const a=(r-e)*(o-t),s=(n-t)*(i-e);return Math.abs(a-s)>=33306690738754716e-32*Math.abs(a+s)?a-s:0}function l(t,e,n,r,o,i){return(s(o,i,t,e,n,r)||s(t,e,n,r,o,i)||s(n,r,o,i,t,e))<0}function c(t,e,n,r,o,i,a,s){const l=t-a,c=e-s,u=n-a,f=r-s,h=o-a,d=i-s,m=u*u+f*f,p=h*h+d*d;return l*(f*p-m*d)-c*(u*p-m*h)+(l*l+c*c)*(u*d-f*h)<0}function u(t,e,n,r,o,i){const a=n-t,s=r-e,l=o-t,c=i-e,u=a*a+s*s,f=l*l+c*c,h=.5/(a*c-s*l),d=(c*u-s*f)*h,m=(a*f-l*u)*h;return d*d+m*m}function f(t,e,n,r){if(r-n<=20)for(let o=n+1;o<=r;o++){const r=t[o],i=e[r];let a=o-1;for(;a>=n&&e[t[a]]>i;)t[a+1]=t[a--];t[a+1]=r}else{let o=n+1,i=r;h(t,n+r>>1,o),e[t[n]]>e[t[r]]&&h(t,n,r),e[t[o]]>e[t[r]]&&h(t,o,r),e[t[n]]>e[t[o]]&&h(t,n,o);const a=t[o],s=e[a];for(;;){do{o++}while(e[t[o]]<s);do{i--}while(e[t[i]]>s);if(i<o)break;h(t,o,i)}t[n+1]=t[i],t[i]=a,r-o+1>=i-n?(f(t,e,o,r),f(t,e,n,i-1)):(f(t,e,n,i-1),f(t,e,o,r))}}function h(t,e,n){const r=t[e];t[e]=t[n],t[n]=r}function d(t){return t[0]}function m(t){return t[1]}},2191:function(t,e,n){var r=n(6618);function o(t,e,n,r){Object.defineProperty(t,e,{get:n,set:r,enumerable:!0,configurable:!0})}function i(t){return t&&t.__esModule?t.default:t}o(t.exports,"prepareAnimation",(()=>_)),o(t.exports,"createPlayer",(()=>S)),o(t.exports,"setupWebGL",(()=>b));const a=t=>t.reduce(((t,e)=>t.concat(e)),[]),s=t=>({data:new Float32Array(a(t)),length:t.length,stride:void 0===t[0]?0:t[0].length}),l=t=>"folder"===t.type||"sprite"===t.type,c=t=>"deform"===t.type||"rotate"===t.type||"translate"===t.type||"stretch"===t.type||"opacity"===t.type,u=t=>"lightness"===t.type||"saturation"===t.type||"colorize"===t.type,f=(t,e,n=[])=>{for(const r of t){e(r,n);for(const t of r.mutationVectors)e(t,[...n,r]);"folder"===r.type&&f(r.items,e,[...n,r])}},h={translate:1,stretch:2,rotate:3,deform:4,opacity:5,lightness:6,colorize:7,saturation:8},d=(t,e)=>{const n=t[t.length-1];if(l(n)){const r=e?n.mutationVectors.indexOf(e):-1;if(r>0)return n.mutationVectors[r-1];for(let n=t.length-(e?2:1);n>=0;n--){const e=t[n];if(e&&l(e)&&e.mutationVectors.length>0)return e.mutationVectors[e.mutationVectors.length-1]}}return null},m=t=>{const e=[],n=[],r={};f(t,((t,o)=>{if((t=>c(t)||u(t))(t)){const a=[h[(i=t).type],i.origin[0],i.origin[1],"deform"===i.type||"translate"===i.type?i.radius:-1],s=n.length;n.push(a);const l=d(o,t),c=null===l?-1:e.findIndex((t=>t.name===l.name));e.push({name:t.name,index:s,parent:c}),r[t.name]=c}var i}));const o={};f(t,((t,n)=>{if(l(t)){const r=d(n.concat(t)),i=null===r?-1:e.findIndex((t=>t.name===r.name));o[t.name]=i}}));const i=new Int32Array(n.length);return e.forEach(((t,e)=>{i[e]=t.parent})),{mutatorMapping:r,parentList:i,vectorSettings:n,shapeMutatorMapping:o}},p=t=>{const e=t.controls.map((t=>t.name));return t.animations.map((t=>{const n=[],r=[];return t.keyframes.reduce(((t,e)=>(e.event&&r.push([e.time,e.event]),t.concat(Object.keys(e.controlValues)))),[]).filter(((t,e,n)=>n.indexOf(t)===e)).forEach((r=>{const o=[];t.keyframes.forEach((t=>{const e=t.controlValues[r];void 0!==e&&o.push([t.time,e])})),n.push([e.indexOf(r),new Float32Array(a(o))])})),{name:t.name,duration:0===t.keyframes.length?0:t.keyframes[t.keyframes.length-1].time,looping:t.looping,tracks:n,events:r}}))};var g,v;(v=g||(g={}))[v.MULTIPLY=0]="MULTIPLY",v[v.ADD=1]="ADD",v[v.HUE=2]="HUE";const y=t=>t===h.stretch||t===h.lightness||t===h.saturation||t===h.opacity?g.MULTIPLY:t===h.colorize?g.HUE:g.ADD,E=["1.0","1.1"],_=t=>{if(!E.includes(t.version))throw new Error(`Version ${t.version} files are not supported`);const e=[],n=[],o=[];f(t.shapes,(t=>{if("sprite"!==t.type)return;const a=(t=>{let e=1/0,n=-1/0,r=1/0,o=-1/0;return t.points.forEach((([t,i])=>{e=t<e?t:e,n=t>n?t:n,r=i<r?i:r,o=i>o?i:o})),[(e+n)/2,(r+o)/2]})(t),s=(l=t.points,i(r).from(l).triangles);var l;const c=[...t.translate,.1*e.length],u=n.length;e.push({name:t.name,start:2*o.length,amount:s.length,mutator:0,x:c[0],y:c[1],z:1e-4*c[2]-.9}),t.points.forEach((([t,e])=>{n.push([t-a[0],e-a[1],t,e])})),s.forEach((t=>{o.push(t+u)}))}));const a=m(t.shapes),l=a.parentList.length,c=Object.keys(a.mutatorMapping),u=[],h=new Float32Array(2*l);Object.entries(t.defaultFrame).forEach((([t,e])=>{const n=c.indexOf(t);-1!==n&&(h[2*n]=e[0],h[2*n+1]=e[1])}));const d=[],g=[],v=[];e.forEach((t=>{t.mutator=a.shapeMutatorMapping[t.name]})),e.sort(((t,e)=>(e.z||0)-(t.z||0)));const _=new Float32Array(t.controls.length),x=t.controls.reduce(((e,n,r)=>{const o=n.steps.reduce(((t,e)=>t.concat(Object.keys(e).filter((e=>!t.includes(e))))),[]);return u.push({name:n.name,steps:n.steps.length}),_[r]=t.controlValues[n.name],o.forEach((r=>{const o=c.indexOf(r),i=n.steps.map((t=>t[r])),a=(null==t?void 0:t.controls.findIndex((t=>t.name===n.name)))||0,s={name:n.name,controlIndex:a,valueStartIndex:0,values:i,stepType:0};e={...e,[o]:(e[o]||[]).concat(s)}})),e}),{});v.length=a.vectorSettings.length,v.fill([0,0]);let T=0;const w=[];return Object.entries(x).forEach((([t,e])=>{const n=parseInt(t,10);if(1===e.length){const t=e[0],r=a.vectorSettings[n][0];return void w.push({mutation:n,mixMode:y(r),control:t.controlIndex,stepType:t.stepType,trackX:new Float32Array(t.values.reduce(((t,e,n)=>t.concat(n,e[0])),[])),trackY:new Float32Array(t.values.reduce(((t,e,n)=>t.concat(n,e[1])),[]))})}if(0===e.length)return;for(const o of e)o.valueStartIndex=d.length,d.push(...o.values);const r=e.map((t=>[t.valueStartIndex,t.controlIndex,t.stepType]));v[n]=[g.length,r.length],T=Math.max(T,r.length),g.push(...r)})),{directControls:w,mutators:s(a.vectorSettings),mutatorParents:{data:a.parentList,length:a.parentList.length,stride:1},mutationValues:{data:h,length:a.parentList.length,stride:2},controlMutationValues:s(d),mutationValueIndices:s(g),controlMutationIndices:s(v),defaultControlValues:_,shapeVertices:s(n),shapeIndices:new Uint16Array(o),shapes:e,controls:u,maxIteration:T,animations:p(t)}};const x=(t,e,n)=>t*(1-n)+e*n,T=(t,e,n)=>{const r=Math.abs(t-e);let o=t,i=e;return t<e&&Math.abs(t+1-e)<r&&(o+=1),t>e&&Math.abs(e-t+1)<r&&(i+=1),x(o,i,n)%1},w=(t,e,n=0,r=x)=>{for(let o=0;o<t.length;o+=2)if(t[o]>e){const i=o>1?t[o-2]:0,a=o>1?t[o-1]:n,s=(e-i)/(t[o]-i);return r(a,t[o+1],s)}return t[t.length-1]},M={zoom:1,panX:0,panY:0,zIndex:0},L=t=>{const e=t.getContext("webgl",{premultipliedalpha:!0,depth:!0,antialias:!0,powerPreference:"low-power"});if(!e)throw new Error("Canvas has no webgl context available");return e},b=t=>{const e=L(t);return e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),S(t)},A=(t,e)=>{const n=t.createProgram();if(!n)throw new Error("Failed to create shader program");const r=(t=>`\n#define MAX_MUT ${t.mutators.length}\n#define MAX_IT ${t.maxIteration}\nuniform vec2 uControlMutValues[${t.controlMutationValues.length}];\nuniform vec3 uMutValueIndices[${t.mutationValueIndices.length}];\nuniform vec2 uControlMutIndices[${t.controlMutationIndices.length}];\nuniform float uControlValues[${t.controls.length}];\n${i("#define GLSLIFY 1\n#define A 0.017453292519943295\nuniform vec2 viewport;uniform vec3 basePosition;uniform vec3 translate;uniform float mutation;uniform vec4 scale;uniform vec2 uMutValues[MAX_MUT];uniform vec4 uMutVectors[MAX_MUT];uniform int uMutParent[MAX_MUT];attribute vec2 coordinates;attribute vec2 aTextureCoord;varying lowp vec2 vTextureCoord;varying lowp float vOpacity;varying lowp float vBrightness;varying lowp float vSaturation;varying lowp float vTargetHue;varying lowp float vTargetSaturation;mat4 B=mat4(2./viewport.x,0,0,0,0,-2./viewport.y,0,0,0,0,1,0,-1,+1,0,1);float C(float D,float E,float F){float G=abs(D-E);float H=D;float I=E;if(D<E&&abs(D+1.-E)<G){H=D+1.;}if(D>E&&abs(E-D+1.)<G){I=E+1.;}return mod(mix(H,I,F),1.);}vec2 J(int K,int L){vec2 M=uMutValues[K];vec2 N=uControlMutIndices[K];int O=int(N.x);int P=int(N.y);if(P==0){return M;}for(int Q=0;Q<MAX_IT;Q++){if(Q<P){vec3 R=uMutValueIndices[O+Q];float S=uControlValues[int(R.y)];int T=int(floor(R.x+S));int U=int(ceil(R.x+S));float V=S-floor(S);vec2 W=uControlMutValues[T];vec2 X=uControlMutValues[U];vec2 Y=mix(W,X,V);if(L==2||L==5||L==6||L==8){M*=Y;}else if(L==7){M=vec2(C(W[0],X[0],V),Y[1]);}else{M+=Y;}}else{return M;}}return M;}mat3 Z(mat3 a,int K){vec4 mutation=uMutVectors[K];int L=int(mutation.x);vec2 b=J(K,L);vec2 c=mutation.yz;vec3 M=a[0];vec3 d=a[1];vec3 e=a[2];if(L==1){float e=1.;if(mutation.a>0.&&distance(M.xy,c)>mutation.a){e=0.;}M=vec3(M.xy+b*e,M.z);}if(L==2){M=vec3(c.xy+vec2((M.x-c.x)*b.x,(M.y-c.y)*b.y),M.z);}if(L==3){float f=b.x*A;mat2 g=mat2(cos(f),sin(f),-sin(f),cos(f));M=vec3((M.xy-c)*g+c,M.z);}if(L==4){float e=1.-clamp(distance(M.xy,c),0.,mutation.a)/mutation.a;M=vec3(M.xy+b*e,M.z);}if(L==5){M=vec3(M.xy,M.z*b.x);}if(L==6){d=vec3(b.x*d.x,d.yz);}if(L==7){e=vec3(b.xy,e.z);}if(L==8){d=vec3(d.x,b.x*d.y,d.z);}return mat3(M,d,e);}mat3 h(mat3 a,int K){int i=K;mat3 M=a;for(int Q=0;Q<MAX_MUT;Q++){if(i==-1){return M;}M=Z(M,i);i=uMutParent[i];}return M;}void main(){mat3 O=mat3(coordinates+translate.xy,1.,1.,1.,0,0,0,0);mat3 j=h(O,int(mutation));vec3 k=j[0];vec3 l=j[1];vec3 m=j[2];vec4 n=B*vec4((k.xy+basePosition.xy)*scale.x,translate.z-basePosition.z,1.);gl_Position=vec4((n.xy+scale.ba)*scale.y,n.z,1.);vTextureCoord=aTextureCoord.xy;vOpacity=k.z;vBrightness=l.x;vSaturation=l.y;vTargetHue=m.x;vTargetSaturation=m.y;}")}\n`)(e),o=t.createShader(t.VERTEX_SHADER),a=t.createShader(t.FRAGMENT_SHADER);if(!o||!a)throw t.deleteProgram(n),t.deleteShader(o),t.deleteShader(a),new Error("Failed to create shader program");if(t.shaderSource(o,r),t.shaderSource(a,i("precision mediump float;\n#define GLSLIFY 1\nvarying mediump vec2 vTextureCoord;varying lowp float vOpacity;varying lowp float vBrightness;varying lowp float vSaturation;varying lowp float vTargetHue;varying lowp float vTargetSaturation;uniform sampler2D uSampler;uniform mediump vec2 uTextureDimensions;float A(vec3 B){lowp float C=min(min(B.r,B.g),B.b);lowp float D=max(max(B.r,B.g),B.b);return(D+C)/2.;}float E(lowp float F,lowp float G,lowp float H){if(H<0.)H+=1.;else if(H>1.)H-=1.;lowp float I;if((6.*H)<1.)I=F+(G-F)*6.*H;else if((2.*H)<1.)I=G;else if((3.*H)<2.)I=F+(G-F)*((2./3.)-H)*6.;else I=F;return I;}vec3 J(vec3 K){lowp vec3 L;if(K.y==0.)L=vec3(K.z);else{lowp float G;if(K.z<0.5)G=K.z*(1.+K.y);else G=(K.z+K.y)-(K.y*K.z);float F=2.*K.z-G;L.r=E(F,G,K.x+(1./3.));L.g=E(F,G,K.x);L.b=E(F,G,K.x-(1./3.));}return L;}void main(void){highp vec2 M=vTextureCoord.xy/uTextureDimensions;mediump vec4 N=texture2D(uSampler,M);vec3 B=N.rgb;float O=A(B);B=mix(mix(B,J(vec3(vTargetHue,vTargetSaturation,O)),1.-vSaturation)*clamp(vBrightness,0.,1.),vec3(1.,1.,1.),clamp(vBrightness-1.,0.,1.));gl_FragColor=vec4(B*N.a*vOpacity,N.a*vOpacity);}")),t.compileShader(o),t.compileShader(a),t.attachShader(n,o),t.attachShader(n,a),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))throw console.error("Link failed: "+t.getProgramInfoLog(n)),console.error("vs info-log: "+t.getShaderInfoLog(o)),console.error("fs info-log: "+t.getShaderInfoLog(a)),new Error("Could not initialise shaders");return[n,o,a]},S=t=>{const e=L(t),n=[];let r=[],o=[];return{render:()=>{e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,t.width,t.height)},addAnimation:(i,a,s,l)=>{const c=[e.TEXTURE0,e.TEXTURE1,e.TEXTURE2,e.TEXTURE3,e.TEXTURE4,e.TEXTURE5,e.TEXTURE6,e.TEXTURE7,e.TEXTURE8,e.TEXTURE9][s],[u,f,h]=A(e,i);e.useProgram(u);const d=((t,e,n)=>{const r=t.createTexture();return t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.useProgram(e),t.uniform2f(t.getUniformLocation(e,"uTextureDimensions"),n.width,n.height),r})(e,u,a),m=e.getUniformLocation(u,"uMutParent");e.uniform1iv(m,i.mutatorParents.data);const p=((t,e)=>(n,r)=>{const o=t.getUniformLocation(e,n),i=r.stride;return 2==i?t.uniform2fv(o,r.data):3==i?t.uniform3fv(o,r.data):4==i&&t.uniform4fv(o,r.data),o})(e,u),v=p("uMutValues",i.mutationValues);p("uMutVectors",i.mutators),p("uControlMutValues",i.controlMutationValues),p("uMutValueIndices",i.mutationValueIndices),p("uControlMutIndices",i.controlMutationIndices);const y=e.getUniformLocation(u,"uControlValues");e.uniform1fv(y,i.defaultControlValues);const E=new Float32Array(i.defaultControlValues),_=new Float32Array(i.defaultControlValues),x=e.createBuffer(),L=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,x),e.bufferData(e.ARRAY_BUFFER,i.shapeVertices.data,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,L),e.bufferData(e.ELEMENT_ARRAY_BUFFER,i.shapeIndices,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null);const b=e.getUniformLocation(u,"basePosition"),S=e.getUniformLocation(u,"translate"),R=e.getUniformLocation(u,"mutation"),U=e.getUniformLocation(u,"viewport"),I=e.getUniformLocation(u,"scale"),F=e.getAttribLocation(u,"coordinates"),P=e.getAttribLocation(u,"aTextureCoord");let k=0,V=0,{zoom:B,panX:D,panY:O,zIndex:C}={...M,...l},z=[0,0],N=1;const X=[],G=i.animations.map((t=>t.name)),K=i.controls.map((t=>t.name)),H=i.animations.map((t=>t.looping)),Y=t=>{const e=X.findIndex((e=>e.name===t));if(-1===e)return;const n=X[e];let o=+new Date-n.startedAt+n.startAt;const a=i.animations[n.index];H[n.index]&&(o%=a.duration),X.splice(e,1);for(const[r,i]of a.tracks){const t=w(i,o,E[r]);E[r]=t}for(const i of r)i(t)},j=t=>{const e=K.indexOf(t);if(-1===e)throw new Error(`Control ${t} does not exist in ${K.join(",")}`);return e},$=t=>{const e=G.indexOf(t);if(-1===e)throw new Error(`Track ${t} does not exist in ${G.join(",")}`);return e},Q={destroy(){e.deleteShader(f),e.deleteShader(h),e.deleteProgram(u),e.deleteTexture(d),e.deleteBuffer(x),e.deleteBuffer(L),n.splice(n.indexOf(Q),1)},setLooping(t,e){const n=$(e);H[n]=t},startTrack(t,{startAt:e=0,speed:n=1}={}){const r=$(t),o=i.animations[r].tracks.map((([t])=>t));for(const a of X){i.animations[a.index].tracks.some((([t])=>o.includes(t)))&&Y(G[a.index])}X.push({name:t,index:r,startAt:e,speed:n,startedAt:+new Date,iterationStartedAt:+new Date-e/n,lastRender:0})},stopTrack:Y,setControlValue:(t,e)=>{const n=j(t),r=i.controls[n].steps-1;if(e<0||e>r)throw new Error(`Control ${t} value shoulde be between 0 and ${r}. ${e} is out of bounds.`);for(const o of X){i.animations[o.index].tracks.some((([t])=>t===n))&&Y(G[o.index])}E[n]=e,_[n]=e},getControlValue:t=>E[j(t)],setPanning(t,e){D=t,O=e},setZoom(t){B=t},setZIndex(t){C=t},render(){if(e.useProgram(u),e.bindBuffer(e.ARRAY_BUFFER,x),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,L),e.vertexAttribPointer(F,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0),e.enableVertexAttribArray(F),e.vertexAttribPointer(P,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(P),t.width!==k||t.height!==V){const n=t.width,r=t.height,o=a.width/n>a.height/r;N=o?n/a.width:r/a.height,e.uniform2f(U,n,r),z=[n/2/N,r/2/N],k=t.width,V=t.height}e.uniform4f(I,N,B,D,O),e.activeTexture(c),e.bindTexture(e.TEXTURE_2D,d),e.uniform1i(e.getUniformLocation(u,"uSampler"),s),e.uniform3f(b,z[0],z[1],.01*C);const n=+new Date;for(const t of X){const e=(n-t.iterationStartedAt)*t.speed,r=i.animations[t.index],a=e%r.duration;if(r.duration<e){if(!H[t.index]){Y(r.name);continue}t.iterationStartedAt=n-a;for(const[t]of r.tracks)E[t]=_[t]}for(const[i,s]of r.events){const e=t.iterationStartedAt+i/t.speed;if(e<n&&e>t.lastRender)for(const n of o)n(s,t.name,i)}t.lastRender=n;for(const[t,n]of r.tracks){const e=w(n,a,E[t]);_[t]=e}}const r=Float32Array.from(i.mutationValues.data);for(const t of i.directControls){const e=_[t.control],n=w(t.trackX,e),o=w(t.trackY,e);if(t.mixMode===g.MULTIPLY)r[2*t.mutation]*=n,r[2*t.mutation+1]*=o;else if(t.mixMode===g.ADD)r[2*t.mutation]+=n,r[2*t.mutation+1]+=o;else{const n=w(t.trackX,e,0,T);r[2*t.mutation]=n,r[2*t.mutation+1]*=o}}e.uniform2fv(v,r),e.uniform1fv(y,_);for(const t of i.shapes)e.uniform3f(S,t.x,t.y,t.z),e.uniform1f(R,t.mutator),e.drawElements(e.TRIANGLES,t.amount,e.UNSIGNED_SHORT,t.start)},onTrackStopped:t=>(r=r.concat(t),()=>{r=r.filter((e=>e!==t))}),onEvent:t=>(o=o.concat(t),()=>{o=o.filter((e=>e!==t))})};return n.push(Q),Q},destroy(){for(const t of n)t.destroy();n.length=0}}}},5666:function(t){var e=function(t){"use strict";var e,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(I){l=function(t,e,n){return t[e]=n}}function c(t,e,n,r){var o=e&&e.prototype instanceof g?e:g,i=Object.create(o.prototype),a=new S(r||[]);return i._invoke=function(t,e,n){var r=f;return function(o,i){if(r===d)throw new Error("Generator is already running");if(r===m){if("throw"===o)throw i;return U()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var s=L(a,n);if(s){if(s===p)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=d;var l=u(t,e,n);if("normal"===l.type){if(r=n.done?m:h,l.arg===p)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(r=m,n.method="throw",n.arg=l.arg)}}}(t,n,a),i}function u(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(I){return{type:"throw",arg:I}}}t.wrap=c;var f="suspendedStart",h="suspendedYield",d="executing",m="completed",p={};function g(){}function v(){}function y(){}var E={};l(E,i,(function(){return this}));var _=Object.getPrototypeOf,x=_&&_(_(R([])));x&&x!==n&&r.call(x,i)&&(E=x);var T=y.prototype=g.prototype=Object.create(E);function w(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function M(t,e){function n(o,i,a,s){var l=u(t[o],t,i);if("throw"!==l.type){var c=l.arg,f=c.value;return f&&"object"==typeof f&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,a,s)}),(function(t){n("throw",t,a,s)})):e.resolve(f).then((function(t){c.value=t,a(c)}),(function(t){return n("throw",t,a,s)}))}s(l.arg)}var o;this._invoke=function(t,r){function i(){return new e((function(e,o){n(t,r,e,o)}))}return o=o?o.then(i,i):i()}}function L(t,n){var r=t.iterator[n.method];if(r===e){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=e,L(t,n),"throw"===n.method))return p;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var o=u(r,t.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,p;var i=o.arg;return i?i.done?(n[t.resultName]=i.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,p):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,p)}function b(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function S(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(b,this),this.reset(!0)}function R(t){if(t){var n=t[i];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function n(){for(;++o<t.length;)if(r.call(t,o))return n.value=t[o],n.done=!1,n;return n.value=e,n.done=!0,n};return a.next=a}}return{next:U}}function U(){return{value:e,done:!0}}return v.prototype=y,l(T,"constructor",y),l(y,"constructor",v),v.displayName=l(y,s,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,l(t,s,"GeneratorFunction")),t.prototype=Object.create(T),t},t.awrap=function(t){return{__await:t}},w(M.prototype),l(M.prototype,a,(function(){return this})),t.AsyncIterator=M,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new M(c(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},w(T),l(T,s,"Generator"),l(T,i,(function(){return this})),l(T,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=R,S.prototype={constructor:S,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(A),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function o(r,o){return s.type="throw",s.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var l=r.call(a,"catchLoc"),c=r.call(a,"finallyLoc");if(l&&c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,p):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),A(n),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;A(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:R(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),p}},t}(t.exports);try{regeneratorRuntime=e}catch(n){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}},5861:function(t,e,n){"use strict";function r(t,e,n,r,o,i,a){try{var s=t[i](a),l=s.value}catch(c){return void n(c)}s.done?e(l):Promise.resolve(l).then(r,o)}function o(t){return function(){var e=this,n=arguments;return new Promise((function(o,i){var a=t.apply(e,n);function s(t){r(a,o,i,s,l,"next",t)}function l(t){r(a,o,i,s,l,"throw",t)}s(void 0)}))}}n.d(e,{Z:function(){return o}})}}]);