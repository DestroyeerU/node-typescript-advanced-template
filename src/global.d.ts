// wrong: import { PackageType } from "library";
// correct: type PackageType = import('library').PackageType;

declare namespace NodeJS {
  // export interface Global {
  // put here global types
  // }
}
