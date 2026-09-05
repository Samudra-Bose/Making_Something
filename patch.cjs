const fs = require('fs');

function patchFile(file, triggerName, setWorldStr, progressStr) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.includes('Brew')) {
      content = content.replace(/anticipatePin: 1,[\s\S]*?onUpdate: \(self\) => {/, `anticipatePin: 1,
          onUpdate: (self) => {
             if (isActive) {
               useExperienceStore.getState().setActiveWorld('${setWorldStr}');
               ${progressStr ? `useExperienceStore.getState().${progressStr}(self.progress);` : ''}
             }`);
  } else {
      content = content.replace(
        /anticipatePin: 1\s*\n\s*}/,
        `anticipatePin: 1,
          onUpdate: (self) => {
            if (isActive) {
               useExperienceStore.getState().setActiveWorld('${setWorldStr}');
               ${progressStr ? `useExperienceStore.getState().${progressStr}(self.progress);` : ''}
            }
          }
        }`
      );
  }
  fs.writeFileSync(file, content, 'utf8');
}

patchFile('src/worlds/Origin.tsx', 'origin', '');
patchFile('src/worlds/Roast.tsx', 'roast', 'setRoastDevelopment');
patchFile('src/worlds/Brew.tsx', 'brew', 'setBrewProgress');
patchFile('src/worlds/Shop.tsx', 'shop', '');
