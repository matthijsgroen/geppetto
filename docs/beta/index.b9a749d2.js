const e="https://github.com/matthijsgroen/geppetto/releases/download/".concat("1.2.0"),t=[{platform:"Mac",arch:"x64",filename:"Geppetto-".concat("1.2.0",".dmg")},{platform:"Mac",arch:"arm64",filename:"Geppetto-".concat("1.2.0","-arm64-mac.dmg")},{platform:"Windows",filename:"Geppetto.Setup.".concat("1.2.0",".exe")},{platform:"Linux",arch:"amd64",filename:"geppetto_".concat("1.2.0","_amd64.deb")},{platform:"Linux",arch:"arm64",filename:"geppetto_".concat("1.2.0","_arm64.deb")}];document.getElementById("version").innerText="Geppetto ".concat("1.2.0"),t.forEach((t=>{const a=document.getElementById("download-".concat(t.platform.toLocaleLowerCase())),o=document.createElement("a");o.setAttribute("href","".concat(e,"/").concat(t.filename)),o.innerText="".concat(t.arch||t.platform," version");const c=document.createElement("li");c.setAttribute("data-marker","⬇"),c.appendChild(o),a.appendChild(c)}));export default{};
//# sourceMappingURL=index.b9a749d2.js.map
