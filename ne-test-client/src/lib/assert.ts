import cp from "child_process";
import path from "path";
let NEC = null;
export const assertNECompiler = () => {
  if (!NEC) {
    NEC = ["npx nearleyc", "nearleyc"].find((command) => {
      try {
        cp.execSync(`${command} -v`);
        return true;
      } catch (e) {
        return false;
      }
    });
    if (!NEC) {
      console.log(
        'NE-Test required access to "nearleyc" command. verify if it is a global command or local command'
      );
      process.exit(1);
    }
  }
  return NEC;
};

export const assertNELibary = () => {
  try {
    return require("nearley");
  } catch (e) {
    console.log(
      'NE-Test required nearley dependency. Try running "npm install nearley".'
    );
    process.exit(1);
  }
};

// export const assertFile = (file: string) => {
//   path.

// };
