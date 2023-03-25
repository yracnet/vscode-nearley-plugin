const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const execPromise = (command, options) => {
  return new Promise((resolve, reject) => {
    const child = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
    child.on("error", reject);
  });
};

const pipelineBuild = (project, source, target) => {
  const cwd = path.resolve(project);
  source = path.join(project, source);
  target = path.resolve(target);
  const options = {
    cwd,
  };
  return (
    Promise.resolve(true)
      .then(() => console.log(project, "Initializing"))
      // .then(() => execPromise("npm install", options))
      .then(() => execPromise("npm run build", options))
      .then(() => console.log(project, "Build finished"))
      .then(() => fs.remove(target))
      .then(() => fs.ensureDir(target))
      .then(() => console.log(project, "Clean finished"))
      .then(() => fs.copy(source, target))
      .then(() => console.log(project, "Copied finished"))
      .catch((err) => console.error(project, "Copied failed", err))
  );
};
Promise.resolve(true)
  // .then(() => pipelineBuild("../ne-test-client", "bin", "./bin"))
  .then(() => pipelineBuild("../ne-test-editor", "dist", "./media"));
