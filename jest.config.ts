import type { Config } from "jest";  
  
const config: Config = {  
  preset: "ts-jest",  
  testEnvironment: "node",  
  testRegex: "/tests/.*.(test|spec)?.(ts|tsx)$",  
}  
  
export default config;
