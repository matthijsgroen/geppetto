function t(t){return t&&t.__esModule?t.default:t}function e(t){return t&&t.__esModule?t.default:t}var r={};const a=Math.pow(2,-52),o=new Uint32Array(512);class n{static from(t,e=w,r=M){const a=t.length,o=new Float64Array(2*a);for(let n=0;n<a;n++){const a=t[n];o[2*n]=e(a),o[2*n+1]=r(a)}return new n(o)}constructor(t){const e=t.length>>1;if(e>0&&"number"!=typeof t[0])throw new Error("Expected coords to contain numbers.");this.coords=t;const r=Math.max(2*e-5,0);this._triangles=new Uint32Array(3*r),this._halfedges=new Int32Array(3*r),this._hashSize=Math.ceil(Math.sqrt(e)),this._hullPrev=new Uint32Array(e),this._hullNext=new Uint32Array(e),this._hullTri=new Uint32Array(e),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(e),this._dists=new Float64Array(e),this.update()}update(){const{coords:t,_hullPrev:e,_hullNext:r,_hullTri:o,_hullHash:n}=this,i=t.length>>1;let s=1/0,u=1/0,l=-1/0,m=-1/0;for(let e=0;e<i;e++){const r=t[2*e],a=t[2*e+1];r<s&&(s=r),a<u&&(u=a),r>l&&(l=r),a>m&&(m=a),this._ids[e]=e}const h=(s+l)/2,y=(u+m)/2;let w,M,g,E=1/0;for(let e=0;e<i;e++){const r=c(h,y,t[2*e],t[2*e+1]);r<E&&(w=e,E=r)}const N=t[2*w],T=t[2*w+1];E=1/0;for(let e=0;e<i;e++){if(e===w)continue;const r=c(N,T,t[2*e],t[2*e+1]);r<E&&r>0&&(M=e,E=r)}let _=t[2*M],V=t[2*M+1],x=1/0;for(let e=0;e<i;e++){if(e===w||e===M)continue;const r=d(N,T,_,V,t[2*e],t[2*e+1]);r<x&&(g=e,x=r)}let R=t[2*g],v=t[2*g+1];if(x===1/0){for(let e=0;e<i;e++)this._dists[e]=t[2*e]-t[0]||t[2*e+1]-t[1];f(this._ids,this._dists,0,i-1);const e=new Uint32Array(i);let r=0;for(let t=0,a=-1/0;t<i;t++){const o=this._ids[t];this._dists[o]>a&&(e[r++]=o,a=this._dists[o])}return this.hull=e.subarray(0,r),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(p(N,T,_,V,R,v)){const t=M,e=_,r=V;M=g,_=R,V=v,g=t,R=e,v=r}const L=function(t,e,r,a,o,n){const i=r-t,s=a-e,u=o-t,l=n-e,c=i*i+s*s,m=u*u+l*l,p=.5/(i*l-s*u);return{x:t+(l*c-s*m)*p,y:e+(i*m-u*c)*p}}(N,T,_,V,R,v);this._cx=L.x,this._cy=L.y;for(let e=0;e<i;e++)this._dists[e]=c(t[2*e],t[2*e+1],L.x,L.y);f(this._ids,this._dists,0,i-1),this._hullStart=w;let A=3;r[w]=e[g]=M,r[M]=e[w]=g,r[g]=e[M]=w,o[w]=0,o[M]=1,o[g]=2,n.fill(-1),n[this._hashKey(N,T)]=w,n[this._hashKey(_,V)]=M,n[this._hashKey(R,v)]=g,this.trianglesLen=0,this._addTriangle(w,M,g,-1,-1,-1);for(let i,s,u=0;u<this._ids.length;u++){const l=this._ids[u],c=t[2*l],m=t[2*l+1];if(u>0&&Math.abs(c-i)<=a&&Math.abs(m-s)<=a)continue;if(i=c,s=m,l===w||l===M||l===g)continue;let h=0;for(let t=0,e=this._hashKey(c,m);t<this._hashSize&&(h=n[(e+t)%this._hashSize],-1===h||h===r[h]);t++);h=e[h];let d,f=h;for(;d=r[f],!p(c,m,t[2*f],t[2*f+1],t[2*d],t[2*d+1]);)if(f=d,f===h){f=-1;break}if(-1===f)continue;let y=this._addTriangle(f,l,r[f],-1,-1,o[f]);o[l]=this._legalize(y+2),o[f]=y,A++;let E=r[f];for(;d=r[E],p(c,m,t[2*E],t[2*E+1],t[2*d],t[2*d+1]);)y=this._addTriangle(E,l,d,o[l],-1,o[E]),o[l]=this._legalize(y+2),r[E]=E,A--,E=d;if(f===h)for(;d=e[f],p(c,m,t[2*d],t[2*d+1],t[2*f],t[2*f+1]);)y=this._addTriangle(d,l,f,-1,o[f],o[d]),this._legalize(y+2),o[d]=y,r[f]=f,A--,f=d;this._hullStart=e[l]=f,r[f]=e[E]=l,r[l]=E,n[this._hashKey(c,m)]=l,n[this._hashKey(t[2*f],t[2*f+1])]=f}this.hull=new Uint32Array(A);for(let t=0,e=this._hullStart;t<A;t++)this.hull[t]=e,e=r[e];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,e){return Math.floor(function(t,e){const r=t/(Math.abs(t)+Math.abs(e));return(e>0?3-r:1+r)/4}(t-this._cx,e-this._cy)*this._hashSize)%this._hashSize}_legalize(t){const{_triangles:e,_halfedges:r,coords:a}=this;let n=0,i=0;for(;;){const s=r[t],u=t-t%3;if(i=u+(t+2)%3,-1===s){if(0===n)break;t=o[--n];continue}const l=s-s%3,c=u+(t+1)%3,m=l+(s+2)%3,p=e[i],d=e[t],f=e[c],y=e[m];if(h(a[2*p],a[2*p+1],a[2*d],a[2*d+1],a[2*f],a[2*f+1],a[2*y],a[2*y+1])){e[t]=y,e[s]=p;const a=r[m];if(-1===a){let e=this._hullStart;do{if(this._hullTri[e]===m){this._hullTri[e]=t;break}e=this._hullPrev[e]}while(e!==this._hullStart)}this._link(t,a),this._link(s,r[i]),this._link(i,m);const u=l+(s+1)%3;n<o.length&&(o[n++]=u)}else{if(0===n)break;t=o[--n]}}return i}_link(t,e){this._halfedges[t]=e,-1!==e&&(this._halfedges[e]=t)}_addTriangle(t,e,r,a,o,n){const i=this.trianglesLen;return this._triangles[i]=t,this._triangles[i+1]=e,this._triangles[i+2]=r,this._link(i,a),this._link(i+1,o),this._link(i+2,n),this.trianglesLen+=3,i}}var i,s,u,l;function c(t,e,r,a){const o=t-r,n=e-a;return o*o+n*n}function m(t,e,r,a,o,n){const i=(a-e)*(o-t),s=(r-t)*(n-e);return Math.abs(i-s)>=33306690738754716e-32*Math.abs(i+s)?i-s:0}function p(t,e,r,a,o,n){return(m(o,n,t,e,r,a)||m(t,e,r,a,o,n)||m(r,a,o,n,t,e))<0}function h(t,e,r,a,o,n,i,s){const u=t-i,l=e-s,c=r-i,m=a-s,p=o-i,h=n-s,d=c*c+m*m,f=p*p+h*h;return u*(m*f-d*h)-l*(c*f-d*p)+(u*u+l*l)*(c*h-m*p)<0}function d(t,e,r,a,o,n){const i=r-t,s=a-e,u=o-t,l=n-e,c=i*i+s*s,m=u*u+l*l,p=.5/(i*l-s*u),h=(l*c-s*m)*p,d=(i*m-u*c)*p;return h*h+d*d}function f(t,e,r,a){if(a-r<=20)for(let o=r+1;o<=a;o++){const a=t[o],n=e[a];let i=o-1;for(;i>=r&&e[t[i]]>n;)t[i+1]=t[i--];t[i+1]=a}else{let o=r+1,n=a;y(t,r+a>>1,o),e[t[r]]>e[t[a]]&&y(t,r,a),e[t[o]]>e[t[a]]&&y(t,o,a),e[t[r]]>e[t[o]]&&y(t,r,o);const i=t[o],s=e[i];for(;;){do{o++}while(e[t[o]]<s);do{n--}while(e[t[n]]>s);if(n<o)break;y(t,o,n)}t[r+1]=t[n],t[n]=i,a-o+1>=n-r?(f(t,e,o,a),f(t,e,r,n-1)):(f(t,e,r,n-1),f(t,e,o,a))}}function y(t,e,r){const a=t[e];t[e]=t[r],t[r]=a}function w(t){return t[0]}function M(t){return t[1]}i=r,s="default",u=function(){return n},Object.defineProperty(i,s,{get:u,enumerable:!0}),l=r,Object.defineProperty(l,"__esModule",{value:!0});var g=e(r);const E=t=>t.reduce(((t,e)=>t.concat(e)),[]),N=t=>({data:new Float32Array(E(t)),length:t.length,stride:void 0===t[0]?0:t[0].length}),T=t=>"folder"===t.type||"sprite"===t.type,_=(t,e,r=[])=>{for(const a of t){e(a,r);for(const t of a.mutationVectors)e(t,[...r,a]);"folder"===a.type&&_(a.items,e,[...r,a])}},V={translate:1,stretch:2,rotate:3,deform:4,opacity:5},x=(t,e)=>{const r=t[t.length-1];if(T(r)){const a=e?r.mutationVectors.indexOf(e):-1;if(a>0)return r.mutationVectors[a-1];for(let r=t.length-(e?2:1);r>=0;r--){const e=t[r];if(e&&T(e)&&e.mutationVectors.length>0)return e.mutationVectors[e.mutationVectors.length-1]}}return null},R=t=>{const e=t.controls.map((t=>t.name));return t.animations.map((t=>{const r=[],a=[];return t.keyframes.reduce(((t,e)=>(e.event&&a.push([e.time,e.event]),t.concat(Object.keys(e.controlValues)))),[]).filter(((t,e,r)=>r.indexOf(t)===e)).forEach((a=>{const o=[];t.keyframes.forEach((t=>{const e=t.controlValues[a];void 0!==e&&o.push([t.time,e])})),r.push([e.indexOf(a),new Float32Array(E(o))])})),{name:t.name,duration:0===t.keyframes.length?0:t.keyframes[t.keyframes.length-1].time,looping:t.looping,tracks:r,events:a}}))};var v=t=>{if("1.0"!==t.version)throw new Error("Only version 1.0 files are supported");const e=[],r=[],a=[];_(t.shapes,(t=>{if("sprite"!==t.type)return;const o=(t=>{let e=1/0,r=-1/0,a=1/0,o=-1/0;return t.points.forEach((([t,n])=>{e=t<e?t:e,r=t>r?t:r,a=n<a?n:a,o=n>o?n:o})),[(e+r)/2,(a+o)/2]})(t),n=(i=t.points,g.from(i).triangles);var i;const s=[...t.translate,.1*e.length],u=r.length;e.push({name:t.name,start:2*a.length,amount:n.length,mutator:0,x:s[0],y:s[1],z:1e-4*s[2]-.9}),t.points.forEach((([t,e])=>{r.push([t-o[0],e-o[1],t,e])})),n.forEach((t=>{a.push(t+u)}))}));const o=(t=>{const e=[],r=[],a={};_(t,((t,o)=>{if((t=>"deform"===t.type||"rotate"===t.type||"translate"===t.type||"stretch"===t.type||"opacity"===t.type)(t)){const i=[V[(n=t).type],n.origin[0],n.origin[1],"deform"===n.type||"translate"===n.type?n.radius:-1],s=r.length;r.push(i);const u=x(o,t),l=null===u?-1:e.findIndex((t=>t.name===u.name));e.push({name:t.name,index:s,parent:l}),a[t.name]=l}var n}));const o={};_(t,((t,r)=>{if(T(t)){const a=x(r.concat(t)),n=null===a?-1:e.findIndex((t=>t.name===a.name));o[t.name]=n}}));const n=new Int32Array(r.length);return e.forEach(((t,e)=>{n[e]=t.parent})),{mutatorMapping:a,parentList:n,vectorSettings:r,shapeMutatorMapping:o}})(t.shapes),n=o.parentList.length,i=Object.keys(o.mutatorMapping),s=[],u=new Float32Array(2*n);Object.entries(t.defaultFrame).forEach((([t,e])=>{const r=i.indexOf(t);-1!==r&&(u[2*r]=e[0],u[2*r+1]=e[1])}));const l=[],c=[],m=[];e.forEach((t=>{t.mutator=o.shapeMutatorMapping[t.name]})),e.sort(((t,e)=>(e.z||0)-(t.z||0)));const p=new Float32Array(t.controls.length),h=t.controls.reduce(((e,r,a)=>{const o=r.steps.reduce(((t,e)=>t.concat(Object.keys(e).filter((e=>!t.includes(e))))),[]);return s.push({name:r.name,steps:r.steps.length}),p[a]=t.controlValues[r.name],o.forEach((a=>{const o=i.indexOf(a),n=r.steps.map((t=>t[a])),s=t?.controls?.findIndex?.((t=>t.name===r.name))||0,u={name:r.name,controlIndex:s,valueStartIndex:l.length,values:n,stepType:0};l.push(...n),e={...e,[o]:{controls:((e[o]||{}).controls||[]).concat(u)}}})),e}),{}),d=Math.max(...Object.keys(h).map((t=>parseInt(t,10))));m.length=d,m.fill([0,0]);let f=0;return Object.entries(h).forEach((([t,e])=>{const r=e.controls.map((t=>[t.valueStartIndex,t.controlIndex,t.stepType]));m[parseInt(t,10)]=[c.length,r.length],f=Math.max(f,r.length),c.push(...r)})),{mutators:N(o.vectorSettings),mutatorParents:{data:o.parentList,length:o.parentList.length,stride:1},mutationValues:{data:u,length:o.parentList.length,stride:2},controlMutationValues:N(l),mutationValueIndices:N(c),controlMutationIndices:N(m),defaultControlValues:p,shapeVertices:N(r),shapeIndices:new Uint16Array(a),shapes:e,controls:s,maxIteration:f,animations:R(t)}},L=e("precision mediump float;\n#define GLSLIFY 1\nvarying mediump vec2 vTextureCoord;varying mediump float vOpacity;uniform sampler2D uSampler;uniform mediump vec2 uTextureDimensions;void main(void){highp vec2 A=vTextureCoord.xy/uTextureDimensions;mediump vec4 B=texture2D(uSampler,A);gl_FragColor=vec4(B.rgb*B.a*vOpacity,B.a*vOpacity);}"),A=e("#define GLSLIFY 1\n#define A 0.017453292519943295\nuniform vec2 viewport;uniform vec3 basePosition;uniform vec3 translate;uniform float mutation;uniform vec4 scale;uniform vec2 uMutationValues[MAX_MUT];uniform vec4 uMutationVectors[MAX_MUT];uniform int uMutationParent[MAX_MUT];attribute vec2 coordinates;attribute vec2 aTextureCoord;varying lowp vec2 vTextureCoord;varying lowp float vOpacity;mat4 B=mat4(2./viewport.x,0,0,0,0,-2./viewport.y,0,0,0,0,1,0,-1,+1,0,1);vec2 C(int D,int E){vec2 F=uMutationValues[D];vec2 G=uControlMutationIndices[D];int H=int(G.x);int I=int(G.y);if(I==0){return F;}for(int J=0;J<MAX_IT;J++){if(J<I){vec3 K=uMutationValueIndices[H+J];float L=uControlValues[int(K.y)];int M=int(floor(K.x+L));int N=int(ceil(K.x+L));float O=L-floor(L);vec2 P=uControlMutationValues[M];vec2 Q=uControlMutationValues[N];vec2 R=mix(P,Q,O);if(E==2||E==5){F*=R;}else{F+=R;}}else{return F;}}return F;}vec3 S(vec3 T,int D){vec4 mutation=uMutationVectors[D];int E=int(mutation.x);vec2 U=C(D,E);vec2 V=mutation.yz;vec3 F=T;if(E==1){float W=1.;if(mutation.a>0.&&distance(T.xy,V)>mutation.a){W=0.;}F=vec3(T.xy+U*W,T.z);}if(E==2){F=vec3(V.xy+vec2((T.x-V.x)*U.x,(T.y-V.y)*U.y),T.z);}if(E==3){float X=U.x*A;mat2 Y=mat2(cos(X),sin(X),-sin(X),cos(X));F=vec3((T.xy-V)*Y+V,T.z);}if(E==4){float W=1.-clamp(distance(T.xy,V),0.,mutation.a)/mutation.a;F=vec3(T.xy+U*W,T.z);}if(E==5){float Z=U.x;F=vec3(T.xy,T.z*Z);}return F;}vec3 a(vec3 T,int D){int b=D;vec3 F=T;for(int J=0;J<MAX_MUT;J++){if(b==-1){return F;}F=S(F,b);b=uMutationParent[b];}return F;}void main(){vec3 c=a(vec3(coordinates+translate.xy,1.),int(mutation));vec4 d=B*vec4((c.xy+basePosition.xy)*scale.x,translate.z-basePosition.z,1.);gl_Position=vec4((d.xy+scale.ba)*scale.y,d.z,1.);vTextureCoord=aTextureCoord.xy;vOpacity=c.z;}");const b=(t,e,r=0)=>{for(let a=0;a<t.length;a+=2)if(t[a]>e){const o=a>1?t[a-2]:0,n=a>1?t[a-1]:r,i=(e-o)/(t[a]-o);return n*(1-i)+t[a+1]*i}return t[t.length-1]},k={zoom:1,panX:0,panY:0,zIndex:0};const S=t=>{const e=t.getContext("webgl",{premultipliedalpha:!0,depth:!0,antialias:!0,powerPreference:"low-power"}),r=[];let a=[],o=[];return{render:()=>{e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,t.width,t.height)},addAnimation:(n,i,s,u)=>{const l=[e.TEXTURE0,e.TEXTURE1,e.TEXTURE2,e.TEXTURE3,e.TEXTURE4,e.TEXTURE5,e.TEXTURE6,e.TEXTURE7,e.TEXTURE8,e.TEXTURE9][s],[c,m,p]=((t,e)=>{const r=t.createProgram();if(!r)throw new Error("Failed to create shader program");const a=(t=>`\n  #define MAX_MUT ${t.mutators.length}\n  #define MAX_IT ${t.maxIteration}\n  uniform vec2 uControlMutationValues[${t.controlMutationValues.length}];\n  uniform vec3 uMutationValueIndices[${t.mutationValueIndices.length}];\n  uniform vec2 uControlMutationIndices[${t.controlMutationIndices.length}];\n  uniform float uControlValues[${t.controls.length}];\n  ${A}\n`)(e),o=t.createShader(t.VERTEX_SHADER),n=t.createShader(t.FRAGMENT_SHADER);if(!o||!n)throw t.deleteProgram(r),t.deleteShader(o),t.deleteShader(n),new Error("Failed to create shader program");if(t.shaderSource(o,a),t.shaderSource(n,L),t.compileShader(o),t.compileShader(n),t.attachShader(r,o),t.attachShader(r,n),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw console.error("Link failed: "+t.getProgramInfoLog(r)),console.error("vs info-log: "+t.getShaderInfoLog(o)),console.error("fs info-log: "+t.getShaderInfoLog(n)),new Error("Could not initialise shaders");return[r,o,n]})(e,n);e.useProgram(c);const h=((t,e,r)=>{const a=t.createTexture();return t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,r),t.useProgram(e),t.uniform2f(t.getUniformLocation(e,"uTextureDimensions"),r.width,r.height),a})(e,c,i),d=e.getUniformLocation(c,"uMutationParent");e.uniform1iv(d,n.mutatorParents.data);const f=((t,e)=>(r,a)=>{const o=t.getUniformLocation(e,r),n=a.stride;2==n?t.uniform2fv(o,a.data):3==n?(console.log(n,r,a.data.length),t.uniform3fv(o,a.data)):4==n&&t.uniform4fv(o,a.data)})(e,c);f("uMutationVectors",n.mutators),f("uMutationValues",n.mutationValues),f("uControlMutationValues",n.controlMutationValues),f("uMutationValueIndices",n.mutationValueIndices),f("uControlMutationIndices",n.controlMutationIndices);const y=e.getUniformLocation(c,"uControlValues");e.uniform1fv(y,n.defaultControlValues);const w=new Float32Array(n.defaultControlValues),M=new Float32Array(n.defaultControlValues),g=e.createBuffer(),E=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,g),e.bufferData(e.ARRAY_BUFFER,n.shapeVertices.data,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,E),e.bufferData(e.ELEMENT_ARRAY_BUFFER,n.shapeIndices,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null);const N=e.getUniformLocation(c,"basePosition"),T=e.getUniformLocation(c,"translate"),_=e.getUniformLocation(c,"mutation"),V=e.getUniformLocation(c,"viewport"),x=e.getUniformLocation(c,"scale"),R=e.getAttribLocation(c,"coordinates"),v=e.getAttribLocation(c,"aTextureCoord");let S=0,F=0,{zoom:U,panX:C,panY:I,zIndex:P}={...k,...u},B=[0,0],D=1;const O=[],X=n.animations.map((t=>t.name)),H=n.controls.map((t=>t.name)),z=n.animations.map((t=>t.looping)),W=t=>{const e=O.findIndex((e=>e.name===t));if(-1===e)return;const r=O[e];let o=+new Date-r.startedAt+r.startAt;const i=n.animations[r.index];z[r.index]&&(o%=i.duration),O.splice(e,1);for(const e of a)e(t);for(const[t,e]of i.tracks){const r=b(e,o,w[t]);w[t]=r}},$={destroy:function(){e.deleteShader(m),e.deleteShader(p),e.deleteProgram(c),e.deleteTexture(h),e.deleteBuffer(g),e.deleteBuffer(E),r.splice(r.indexOf($),1)},setLooping:function(t,e){const r=X.indexOf(e);if(-1===r)throw new Error(`Track ${e} does not exist in ${X.join(",")}`);z[r]=t},startTrack:function(t){const e=X.indexOf(t);if(-1===e)throw new Error(`Track ${t} does not exist in ${X.join(",")}`);const r=n.animations[e].tracks.map((([t])=>t));for(const t of O)n.animations[t.index].tracks.some((([t])=>r.includes(t)))&&W(X[t.index]);O.push({name:t,index:e,startAt:0,startedAt:+new Date,iterationStartedAt:+new Date-0,lastRender:0})},stopTrack:W,setControlValue:(t,e)=>{const r=H.indexOf(t);if(-1===r)throw new Error(`Control ${t} does not exist in ${H.join(",")}`);const a=n.controls[r].steps-1;if(e<0||e>a)throw new Error(`Control ${t} value shoulde be between 0 and ${a}. ${e} is out of bounds.`);for(const t of O)n.animations[t.index].tracks.some((([t])=>t===r))&&W(X[t.index]);w[r]=e,M[r]=e},setPanning:function(t,e){C=t,I=e},setZoom:function(t){U=t},setZIndex:function(t){P=t},render:function(){if(e.useProgram(c),e.bindBuffer(e.ARRAY_BUFFER,g),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,E),e.vertexAttribPointer(R,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0),e.enableVertexAttribArray(R),e.vertexAttribPointer(v,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(v),t.width!==S||t.height!==F){const r=t.width,a=t.height,o=i.width/r>i.height/a;D=o?r/i.width:a/i.height,e.uniform2f(V,r,a),B=[r/2/D,a/2/D],S=t.width,F=t.height}e.uniform4f(x,D,U,C,I),e.activeTexture(l),e.bindTexture(e.TEXTURE_2D,h),e.uniform1i(e.getUniformLocation(c,"uSampler"),s),e.uniform3f(N,B[0],B[1],.01*P);const r=+new Date;for(const t of O){const e=r-t.iterationStartedAt,a=n.animations[t.index],i=e%a.duration;if(a.duration<e){if(!z[t.index]){W(a.name);continue}t.iterationStartedAt=r-i;for(const[t]of a.tracks)w[t]=M[t]}for(const[e,n]of a.events){const a=t.iterationStartedAt+e;if(a<r&&a>t.lastRender)for(const r of o)r(n,t.name,e)}t.lastRender=r;for(const[t,e]of a.tracks){const r=b(e,i,w[t]);M[t]=r}}e.uniform1fv(y,M);for(const t of n.shapes)e.uniform3f(T,t.x,t.y,t.z),e.uniform1f(_,t.mutator),e.drawElements(e.TRIANGLES,t.amount,e.UNSIGNED_SHORT,t.start)},onTrackStopped:function(t){return a=a.concat(t),()=>{a=a.filter((e=>e!==t))}},onEvent:function(t){return o=o.concat(t),()=>{o=o.filter((e=>e!==t))}}};return r.push($),$},destroy:function(){for(const t of r)t.destroy();r.length=0}}};var F=null;var U,C=function(){return F||(F=function(){try{throw new Error}catch(e){var t=(""+e.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);if(t)return(""+t[0]).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/,"$1")+"/"}return"/"}()),F},I=t(C()+"landscape.21a3263c.png"),P=t(JSON.parse('{"animations":[{"name":"Waterrad","looping":true,"keyframes":[{"time":0,"controlValues":{"New Control":1,"Rad":1}},{"time":12000,"controlValues":{"New Control":0,"Rad":0}}]},{"name":"Waterrad2","looping":true,"keyframes":[{"time":0,"controlValues":{"Schoepen":0}},{"time":1000,"controlValues":{"Schoepen":1}}]},{"name":"Rook","looping":true,"keyframes":[{"time":0,"controlValues":{"Rook":0}},{"time":4999,"controlValues":{"Rook":2}}]}],"controlValues":{"New Control":0,"Rook":0,"Schoepen":1,"Rad":1},"controls":[{"name":"Rook","type":"slider","steps":[{"New Mutator (10)":[0,0],"New Mutator (9)":[0,0],"New Mutator (12)":[22,0],"New Mutator (11)":[0,0],"New Mutator (8)":[-23,0]},{"New Mutator (10)":[0,-100],"New Mutator (9)":[28,0],"New Mutator (12)":[-27,0],"New Mutator (11)":[-38,0],"New Mutator (8)":[47,0]},{"New Mutator (10)":[0,-216],"New Mutator (9)":[0,0],"New Mutator (12)":[22,0],"New Mutator (11)":[0,0],"New Mutator (8)":[-23,0]}]},{"name":"Schoepen","type":"slider","steps":[{"New Mutator (20)":[0,0],"New Mutator (17)":[0,0],"New Mutator (19)":[0,0],"New Mutator (18)":[0,0],"New Mutator (3)":[1,1],"New Mutator (7)":[0,0],"New Mutator (15)":[1,1],"New Mutator (16)":[0,0],"New Mutator (22)":[1,0.05],"New Mutator (21)":[0,0],"New Mutator (23)":[20,-35]},{"New Mutator (20)":[-43,-62],"New Mutator (17)":[72,0],"New Mutator (19)":[-36,-28],"New Mutator (18)":[69,0],"New Mutator (3)":[1,0.7],"New Mutator (7)":[-10,-91],"New Mutator (15)":[1,0.05],"New Mutator (16)":[0,0],"New Mutator (22)":[1,-0.6],"New Mutator (21)":[25,-88],"New Mutator (23)":[-3,0]}]},{"name":"Rad","type":"slider","steps":[{"New Mutator (1)":[0,0],"New Mutator (6)":[0,0]},{"New Mutator (1)":[360,0],"New Mutator (6)":[360,0]}]}],"defaultFrame":{"New Mutator":[0.45,1],"New Mutator (1)":[0,0],"New Mutator (2)":[0.5,1],"New Mutator (4)":[0.5,1],"New Mutator (5)":[0.45,1],"New Mutator (6)":[0,0],"New Mutator (17)":[84,0],"New Mutator (18)":[0,-3],"New Mutator (19)":[0,0],"New Mutator (3)":[1,1],"New Mutator (15)":[1,0.8],"New Mutator (16)":[63,0],"New Mutator (22)":[1,1],"New Mutator (10)":[0,0],"New Mutator (8)":[0,0],"New Mutator (11)":[0,0],"New Mutator (12)":[0,0],"New Mutator (9)":[0,0]},"shapes":[{"type":"sprite","points":[[3101,119],[3107,588],[2698,557],[2692,114]],"translate":[-214,-14],"mutationVectors":[],"name":"WheelHouse"},{"name":"Watermolen","type":"folder","items":[{"name":"Waterrad","type":"sprite","points":[[24,408],[384,408],[24,768],[384,768]],"translate":[-169,14],"mutationVectors":[{"type":"stretch","origin":[-181,14],"name":"New Mutator"},{"type":"rotate","origin":[-169,14],"name":"New Mutator (1)"}]},{"name":"Waterrad2","type":"sprite","points":[[24,24],[384,24],[24,384],[384,384]],"translate":[-187,15],"mutationVectors":[{"type":"stretch","origin":[-173,14],"name":"New Mutator (2)"}]},{"type":"sprite","points":[[455,1143],[455,1197],[335,1143],[335,1196]],"translate":[-293,-14],"mutationVectors":[{"name":"New Mutator (21)","type":"translate","origin":[-15,-67]},{"type":"stretch","origin":[-291,12],"name":"New Mutator (22)"}],"name":"Schoep (1) (1)"},{"type":"sprite","points":[[455,1143],[455,1197],[335,1143],[335,1196]],"translate":[-282,74],"mutationVectors":[{"name":"New Mutator (7)","type":"translate","origin":[-6,4]},{"type":"stretch","origin":[-283,102],"name":"New Mutator (15)"},{"type":"deform","origin":[-316,37],"name":"New Mutator (16)","radius":68}],"name":"Schoep (2)"},{"type":"sprite","points":[[455,1143],[455,1197],[335,1143],[335,1196]],"translate":[-264,130],"mutationVectors":[{"name":"New Mutator (20)","type":"translate","origin":[-6,4]},{"type":"stretch","origin":[-268,156],"name":"New Mutator (3)"},{"type":"deform","origin":[-272,107],"name":"New Mutator (17)","radius":86}],"name":"Schoep (1)"},{"name":"Schoep","type":"sprite","points":[[455,1143],[455,1197],[335,1143],[335,1196]],"translate":[-213,162],"mutationVectors":[{"name":"New Mutator (19)","type":"translate","origin":[-6,4]},{"type":"deform","origin":[-216,131],"name":"New Mutator (18)","radius":76}]},{"type":"sprite","points":[[455,1143],[455,1197],[335,1143],[335,1196]],"translate":[-205,159],"mutationVectors":[{"name":"New Mutator (23)","type":"translate","origin":[-6,4]}],"name":"Schoep (1) (2)"},{"name":"Waterrad (1)","type":"sprite","points":[[24,408],[384,408],[24,768],[384,768]],"translate":[-268,12],"mutationVectors":[{"type":"stretch","origin":[-274,12],"name":"New Mutator (5)"},{"type":"rotate","origin":[-268,12],"name":"New Mutator (6)"}]},{"name":"Waterrad2 (1)","type":"sprite","points":[[24,24],[384,24],[24,384],[384,384]],"translate":[-274,12],"mutationVectors":[{"type":"stretch","origin":[-281,9],"name":"New Mutator (4)"}]}],"mutationVectors":[]},{"type":"sprite","points":[[23,1265],[847,1273],[38,1915],[813,1912]],"translate":[-449,-87],"mutationVectors":[],"name":"House"},{"type":"sprite","points":[[97,790],[167,790],[244,789],[245,1178],[168,1176],[95,1176],[27,1176],[26,792],[26,825],[27,894],[25,960],[25,1030],[25,1093],[96,1143],[96,1068],[95,993],[95,925],[95,862],[167,822],[167,893],[166,964],[167,1035],[167,1115],[245,1083],[244,1000],[243,924],[241,856]],"translate":[-425,-348],"mutationVectors":[{"type":"deform","origin":[-478,-407],"name":"New Mutator (8)","radius":40},{"type":"deform","origin":[-386,-485],"name":"New Mutator (11)","radius":41},{"type":"deform","origin":[-473,-508],"name":"New Mutator (12)","radius":36},{"type":"deform","origin":[-385,-404],"name":"New Mutator (9)","radius":31},{"name":"New Mutator (10)","type":"translate","origin":[-5,0],"radius":-1}],"name":"Rook"},{"name":"Base Image","type":"sprite","points":[[710,-2],[712,1084],[2621,1086],[2621,2]],"translate":[0,0],"mutationVectors":[]}],"version":"1.0"}')),B=t(C()+"lady.30f3877b.png"),D=t(JSON.parse('{"animations":[{"name":"Eye blink","looping":true,"keyframes":[{"time":2500,"controlValues":{"LeftEyeClose":0,"RightEyeClose":0}},{"time":2750,"controlValues":{"LeftEyeClose":1,"RightEyeClose":1}},{"time":3000,"controlValues":{"RightEyeClose":0,"LeftEyeClose":0}}]},{"name":"Look around","looping":true,"keyframes":[{"time":1000,"controlValues":{"LeftEye-x":0.18,"RightEye-x":0.24}},{"time":2000,"controlValues":{"LeftEye-x":1,"RightEye-x":1.02}},{"time":3980,"controlValues":{"LeftEye-x":1.02,"RightEye-x":1}},{"time":5000,"controlValues":{"RightEye-x":1.8,"LeftEye-x":1.84}},{"time":6000,"controlValues":{"LeftEye-x":0.98,"RightEye-x":1.06}},{"time":8000,"controlValues":{"RightEye-x":1,"LeftEye-x":1}}]},{"name":"Talking","looping":true,"keyframes":[{"time":1000,"controlValues":{"Mouth":0}},{"time":1340,"controlValues":{"Mouth":0.62}},{"time":1670,"controlValues":{"Mouth":0}},{"time":2120,"controlValues":{"Mouth":0}},{"time":2430,"controlValues":{"Mouth":0.68}},{"time":2790,"controlValues":{"Mouth":0.24}},{"time":3160,"controlValues":{"Mouth":1}},{"time":3470,"controlValues":{"Mouth":0}}]},{"name":"No","looping":false,"keyframes":[{"time":510,"controlValues":{"HeadTurn":0.38}},{"time":1270,"controlValues":{"HeadTurn":0}},{"time":2180,"controlValues":{"HeadTurn":1}},{"time":2990,"controlValues":{"HeadTurn":0}},{"time":3980,"controlValues":{"HeadTurn":0.48}}]},{"name":"HeadTilt","looping":true,"keyframes":[{"time":1000,"controlValues":{"HeadTilt":0.42}},{"time":6000,"controlValues":{"HeadTilt":0.53}},{"time":9000,"controlValues":{"HeadTilt":0.14}},{"time":12000,"controlValues":{"HeadTilt":0.43}}]},{"name":"EyeWink","looping":false,"keyframes":[{"time":500,"controlValues":{"RightEyeClose":0,"LeftEyeClose":0}},{"time":800,"controlValues":{"RightEyeClose":1}},{"time":1200,"controlValues":{"RightEyeClose":1}},{"time":1500,"controlValues":{"RightEyeClose":0}}]},{"name":"Eyebrows","looping":true,"keyframes":[{"time":990,"controlValues":{"Eyebrows":1.32}},{"time":3940,"controlValues":{"Eyebrows":0.92}},{"time":6820,"controlValues":{"Eyebrows":1.88}},{"time":10220,"controlValues":{"Eyebrows":0}}]}],"controlValues":{"RightEye-x":1.1,"RightEye-y":0.41,"RightEyeClose":0,"RightEyebrow2":0.29,"RightEyebrow1":0.53,"LeftEyeClose":0,"LeftEye-x":1.08,"LeftEye-y":0.42,"Mouth":0,"HeadTurn":0.54,"HeadTilt":0.46,"Eyebrows":0.86},"controls":[{"name":"Eyebrows","type":"slider","steps":[{"New Mutator (3)":[0,6],"New Mutator (2)":[-10,0],"New Mutator (23)":[0,6],"New Mutator (24)":[10,0]},{"New Mutator (3)":[0,0],"New Mutator (2)":[0,0],"New Mutator (23)":[0,0],"New Mutator (24)":[0,0]},{"New Mutator (3)":[0,0],"New Mutator (2)":[9,0],"New Mutator (23)":[0,0],"New Mutator (24)":[-9,0]}]},{"name":"HeadTilt","type":"slider","steps":[{"New Mutator (19)":[15,0],"New Mutator (18)":[15,0],"New Mutator (20)":[-34,0],"New Mutator (21)":[-29,0],"New Mutator (22)":[-75,0]},{"New Mutator (18)":[-15,0],"New Mutator (19)":[-15,0],"New Mutator (20)":[32,0],"New Mutator (21)":[42,0],"New Mutator (22)":[103,0]}]},{"name":"HeadTurn","type":"slider","steps":[{"New Mutator (12)":[-9,0],"New Mutator (13)":[-2,0],"New Mutator (14)":[7,0],"New Mutator (15)":[3,0],"New Mutator (16)":[2,0],"New Mutator (17)":[-7,0],"New Mutator (6)":[1,0],"New Mutator":[1,0]},{"New Mutator (14)":[-5,0],"New Mutator (12)":[3,0],"New Mutator (13)":[7,0],"New Mutator (15)":[-3,0],"New Mutator (16)":[-2,0],"New Mutator (17)":[10,0],"New Mutator":[-1,0],"New Mutator (6)":[-1,0]}]},{"name":"Mouth","type":"slider","steps":[{"New Mutator (8)":[1,1],"New Mutator (10)":[1,1],"New Mutator (9)":[0,0],"New Mutator (11)":[0,0]},{"New Mutator (8)":[1,1.1],"New Mutator (10)":[1,3.85],"New Mutator (9)":[0,-20],"New Mutator (11)":[0,3]}]},{"name":"RightEye-y","type":"slider","steps":[{"New Mutator":[0,-8]},{"New Mutator":[0,11]}]},{"name":"LeftEye-y","type":"slider","steps":[{"New Mutator (6)":[0,-7]},{"New Mutator (6)":[0,11]}]},{"name":"RightEye-x","type":"slider","steps":[{"New Mutator":[-7,0],"New Mutator (4)":[0.85,1]},{"New Mutator":[1,0],"New Mutator (4)":[1,1]},{"New Mutator":[13,0],"New Mutator (4)":[0.85,1]}]},{"name":"LeftEye-x","type":"slider","steps":[{"New Mutator (6)":[-12,0],"New Mutator (7)":[0.85,1]},{"New Mutator (7)":[1,1],"New Mutator (6)":[0,0]},{"New Mutator (6)":[9,0],"New Mutator (7)":[0.85,1]}]},{"name":"RightEyeClose","type":"slider","steps":[{"RightEyeLashes":[1,1],"New Mutator (1)":[0,0]},{"New Mutator (1)":[0,48],"RightEyeLashes":[1,-1.2]}]},{"name":"LeftEyeClose","type":"slider","steps":[{"New Mutator (5)":[0,0],"LeftEyeLashes":[1,1]},{"LeftEyeLashes":[1,-1.1],"New Mutator (5)":[0,50]}]}],"defaultFrame":{"New Mutator (1)":[0,-29],"RightEyeLashes":[1,1],"New Mutator (4)":[1,1],"New Mutator":[0,0],"New Mutator (5)":[0,-25],"LeftEyeLashes":[1,1],"New Mutator (7)":[1,1],"New Mutator (6)":[0,0],"New Mutator (8)":[1,1],"New Mutator (10)":[1,0.25],"New Mutator (9)":[0,0],"New Mutator (18)":[-1,0],"New Mutator (19)":[0,0],"New Mutator (20)":[0,0],"New Mutator (21)":[0,0],"New Mutator (22)":[0,0],"New Mutator (2)":[0,0],"New Mutator (3)":[0,0],"New Mutator (24)":[0,0],"New Mutator (23)":[0,0]},"shapes":[{"name":"Head","type":"folder","items":[{"type":"sprite","points":[[1013,495],[1023,467],[1021,419],[1024,374],[1023,323],[1000,281],[955,263],[888,267],[836,303],[817,354],[813,412],[811,457],[822,473],[840,459],[847,431],[854,398],[856,368],[912,338],[917,361],[934,337],[971,345],[998,363],[998,409],[994,435],[999,471]],"translate":[-6,-36],"mutationVectors":[{"type":"deform","origin":[-98,48],"name":"New Mutator (21)","radius":96},{"type":"deform","origin":[87,54],"name":"New Mutator (20)","radius":101},{"name":"New Mutator (16)","type":"translate","origin":[0,0],"radius":-1}],"name":"HairFront"},{"type":"sprite","points":[[221,213],[265,212],[266,230],[223,233]],"translate":[2,46],"mutationVectors":[{"name":"New Mutator (14)","type":"translate","origin":[0,0],"radius":-1}],"name":"Nose"},{"type":"sprite","points":[[776,110],[780,98],[793,90],[805,91],[818,92],[830,95],[842,106],[833,114],[818,110],[795,108]],"translate":[-42,-46],"mutationVectors":[{"name":"New Mutator (3)","type":"translate","origin":[0,0],"radius":-1},{"type":"rotate","origin":[-55,-48],"name":"New Mutator (2)"}],"name":"LeftEyebrow"},{"type":"sprite","points":[[774,139],[783,154],[794,148],[810,146],[824,148],[837,150],[837,139],[825,132],[808,129],[788,132]],"translate":[41,-43],"mutationVectors":[{"name":"New Mutator (23)","type":"translate","origin":[0,0],"radius":-1},{"type":"rotate","origin":[54,-44],"name":"New Mutator (24)"}],"name":"RightEyebrow"},{"name":"LeftEyeLashes","type":"sprite","points":[[679,86],[679,108],[738,111],[736,86]],"translate":[-47,-13],"mutationVectors":[{"type":"stretch","origin":[-47,-6],"name":"LeftEyeLashes","radius":-1}]},{"name":"RightEyeLashes","type":"sprite","points":[[613,106],[668,108],[667,86],[611,84]],"translate":[43,-14],"mutationVectors":[{"type":"stretch","origin":[37,-6],"name":"RightEyeLashes","radius":-1}]},{"name":"Face","type":"sprite","points":[[431,266],[485,277],[509,270],[507,259],[435,255],[481,248],[462,248],[462,277],[572,54],[373,52],[572,272],[375,277]],"translate":[2,-34],"mutationVectors":[{"type":"deform","origin":[2,79],"name":"New Mutator (9)","radius":26}]},{"type":"sprite","points":[[128,165],[135,173],[145,170],[162,129],[160,113],[151,102],[134,113],[130,121]],"translate":[93,-3],"mutationVectors":[{"name":"New Mutator (12)","type":"translate","origin":[0,0],"radius":-1}],"name":"RightEar"},{"type":"sprite","points":[[103,111],[112,168],[103,176],[92,174],[74,110],[86,104]],"translate":[-91,-6],"mutationVectors":[{"name":"New Mutator (13)","type":"translate","origin":[0,0],"radius":-1}],"name":"LeftEar"},{"name":"UpperTeeth","type":"sprite","points":[[636,235],[717,236],[717,247],[694,256],[653,256],[636,245]],"translate":[0,65],"mutationVectors":[{"name":"New Mutator (11)","type":"translate","origin":[0,0]}]},{"name":"Mouth","type":"sprite","points":[[759,189],[761,210],[770,228],[785,235],[814,235],[833,232],[844,218],[847,194]],"translate":[0,83],"mutationVectors":[{"type":"stretch","origin":[1,65],"name":"New Mutator (10)","radius":-1}]},{"name":"Jaw","type":"sprite","points":[[612,266],[787,262],[777,310],[737,355],[701,362],[662,352],[622,313]],"translate":[0,87],"mutationVectors":[{"type":"stretch","origin":[0,40],"name":"New Mutator (8)","radius":-1}]},{"name":"RightEye","type":"folder","items":[{"name":"RightEyeLid","type":"sprite","points":[[618,149],[664,142],[657,131],[646,128],[630,128],[620,138],[634,149],[645,148]],"translate":[41,-11],"mutationVectors":[{"type":"deform","origin":[38,-6],"name":"New Mutator (1)","radius":15}]},{"name":"RightEyeWhite (1)","type":"sprite","points":[[624,79],[630,79],[630,71],[621,71]],"translate":[30,-10],"mutationVectors":[]},{"name":"RightIrisPupil","type":"sprite","points":[[653,186],[653,160],[627,160],[627,186]],"translate":[37,-9],"mutationVectors":[{"name":"New Mutator","type":"translate","origin":[0,0]},{"type":"stretch","origin":[38,-9],"name":"New Mutator (4)","radius":-1}]},{"name":"RightEyeWhite","type":"sprite","points":[[621,197],[620,228],[667,197],[666,227]],"translate":[40,-6],"mutationVectors":[]}],"mutationVectors":[]},{"name":"LeftEye","type":"folder","items":[{"name":"LeftEyeLid","type":"sprite","points":[[688,143],[695,131],[709,127],[721,129],[731,136],[736,151],[704,146],[716,148]],"translate":[-42,-12],"mutationVectors":[{"type":"deform","origin":[-42,-9],"name":"New Mutator (5)","radius":15}]},{"name":"LeftEyeWhite","type":"sprite","points":[[697,77],[705,78],[706,70],[697,70]],"translate":[-48,-12],"mutationVectors":[]},{"name":"LeftIrisPupil","type":"sprite","points":[[698,161],[698,186],[724,186],[724,161]],"translate":[-42,-11],"mutationVectors":[{"name":"New Mutator (6)","type":"translate","origin":[0,0]},{"type":"stretch","origin":[-41,-10],"name":"New Mutator (7)","radius":-1}]},{"name":"LeftEyeWhite (1)","type":"sprite","points":[[685,197],[685,227],[734,229],[733,197]],"translate":[-43,-6],"mutationVectors":[]}],"mutationVectors":[]}],"mutationVectors":[{"type":"rotate","origin":[-5,98],"name":"New Mutator (18)"},{"name":"New Mutator (15)","type":"translate","origin":[0,0],"radius":-1}]},{"type":"sprite","points":[[242,516],[253,411],[290,395],[391,371],[419,313],[510,311],[555,368],[647,390],[710,514],[473,524],[235,601],[225,664],[208,760],[722,798],[727,754],[699,406],[215,952],[702,983]],"translate":[0,438],"mutationVectors":[],"name":"Body"},{"type":"sprite","points":[[779,611],[822,582],[864,568],[921,567],[979,582],[1013,632],[1042,707],[1038,813],[1028,847],[1040,912],[1030,948],[1027,1024],[990,1103],[954,1120],[907,1064],[867,1106],[822,1083],[779,1105],[750,1084],[754,992],[743,934],[759,844],[753,753],[761,709],[747,660]],"translate":[-2,108],"mutationVectors":[{"type":"deform","origin":[-7,263],"name":"New Mutator (22)","radius":331},{"type":"rotate","origin":[-3,106],"name":"New Mutator (19)"},{"name":"New Mutator (17)","type":"translate","origin":[0,0],"radius":-1}],"name":"HairBack"}],"version":"1.0"}'));U=JSON.parse('{"name":"website","version":"1.0.0-beta.0","description":"Geppetto website","main":"../docs/index.html","author":"Matthijs Groen","license":"MIT","private":true,"scripts":{"start":"parcel serve ./src/index.html","build":"parcel build ./src/index.html --no-content-hash --public-url /geppetto/"},"devDependencies":{"@parcel/transformer-image":"2.0.0-beta.2","parcel":"^2.0.0-beta.2"},"dependencies":{"geppetto-player":"^1.0.0-beta.3"},"browserslist":["defaults","Chrome 63"]}');document.getElementById("errorBox");const O=document.getElementById("theatre"),X=(t=>{const e=t.getContext("webgl",{premultipliedalpha:!0,depth:!0,antialias:!0,powerPreference:"low-power"});if(!e)throw new Error("No WebGL Support");return e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),S(t)})(O),H=`https://github.com/matthijsgroen/geppetto/releases/download/${U.version}`,z=[{platform:"mac",arch:"x64",filename:`Geppetto-${U.version}-mac.zip`},{platform:"mac",arch:"arm64",filename:`Geppetto-${U.version}-arm64-mac.zip`},{platform:"win",filename:`Geppetto Setup ${U.version}.exe`},{platform:"linux",arch:"amd64",filename:`geppetto_${U.version}_amd64.deb`},{platform:"linux",arch:"arm64",filename:`geppetto_${U.version}_arm64.deb`}],W=async t=>new Promise((e=>{const r=new Image;r.crossOrigin="anonymous",r.src=t,r.onload=()=>e(r)}));(async()=>{const t=await W(I),e=v(P),r=X.addAnimation(e,t,0,{zoom:2}),a=await W(B),o=v(D),n=X.addAnimation(o,a,1,{zoom:2.4,panX:-.25,panY:.1,zIndex:2}),i=O.getBoundingClientRect();O.width=i.width*window.devicePixelRatio,O.height=i.height*window.devicePixelRatio,r.startTrack("Waterrad"),r.startTrack("Waterrad2"),r.startTrack("Rook"),n.startTrack("Eye blink"),n.startTrack("Talking"),n.startTrack("Eyebrows"),n.startTrack("HeadTilt");const[s,u,l]=document.querySelectorAll("button");let c=!0,m=!0;u.addEventListener("click",(()=>{m=!m,u.innerText=m?"Stop wheel":"Start wheel",m?(r.startTrack("Waterrad"),r.startTrack("Waterrad2")):(r.stopTrack("Waterrad"),r.stopTrack("Waterrad2"))})),s.addEventListener("click",(()=>{c=!c,s.innerText=c?"Stop smoke":"Start smoke",c?r.startTrack("Rook"):r.stopTrack("Rook")})),n.onTrackStopped((t=>{console.log(`Track ${t} has stopped`),"Eye wink"===t&&n.startTrack("Eye blink")})),l.addEventListener("click",(()=>{console.log("Start Eye wink"),n.startTrack("EyeWink")}));let p=[0,0],h=[0,0];const d=[.145,.385];let f=0;O.addEventListener("click",(t=>{const e=O.getBoundingClientRect(),r=[t.x/e.width,t.y/e.height];p=[Math.min(1,Math.max(-1,(r[0]-d[0])/.4)),Math.min(1,Math.max(-1,(r[1]-d[1])/.4))],f=180}));const y=.025,w=()=>{h[0]!==p[0]&&(h[0]<p[0]?h[0]+=Math.min(y,p[0]-h[0]):h[0]-=Math.min(y,h[0]-p[0])),h[1]!==p[1]&&(h[1]<p[1]?h[1]+=Math.min(y,p[1]-h[1]):h[1]-=Math.min(y,h[1]-p[1])),180===f&&h[0]===p[0]&&h[1]===p[1]&&0!==p[0]&&0!==p[1]&&f--,f<180&&(f--,f<0&&(p=[0,0])),n.setControlValue("RightEye-x",h[0]+1),n.setControlValue("LeftEye-x",h[0]+1),n.setControlValue("HeadTurn",1-.5*(h[0]+1)),n.setControlValue("RightEye-y",.5*(h[1]+1)),n.setControlValue("LeftEye-y",.5*(h[1]+1)),X.render(),r.render(),n.render(),window.requestAnimationFrame(w)};window.requestAnimationFrame(w)})(),document.getElementById("version").innerText=`Version ${U.version}`,z.forEach((t=>{const e=document.getElementById(`download-${t.platform}`),r=document.createElement("a");r.setAttribute("href",`${H}/${t.filename}`),r.innerText=`Download ${t.arch||t.platform} version`;const a=document.createElement("li");a.appendChild(r),e.appendChild(a)}));
//# sourceMappingURL=index.3535b31f.js.map
